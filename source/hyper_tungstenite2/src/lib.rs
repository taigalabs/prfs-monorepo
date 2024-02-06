use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use hyper_utils::io::{full, BytesBoxBody};
use pin_project_lite::pin_project;
use std::pin::Pin;
use std::task::{Context, Poll};

use tungstenite::handshake::derive_accept_key;
use tungstenite::protocol::{Role, WebSocketConfig};
use tungstenite::{error::ProtocolError, Error};

pub use hyper;
pub use tungstenite;

pub use tokio_tungstenite::WebSocketStream;

/// A [`WebSocketStream`] that wraps an upgraded HTTP connection from hyper.
pub type HyperWebsocketStream = WebSocketStream<TokioIo<hyper::upgrade::Upgraded>>;

pin_project! {
    /// A future that resolves to a websocket stream when the associated HTTP upgrade completes.
    #[derive(Debug)]
    pub struct HyperWebsocket {
        #[pin]
        inner: hyper::upgrade::OnUpgrade,
        config: Option<WebSocketConfig>,
    }
}

/// Try to upgrade a received `hyper::Request` to a websocket connection.
///
/// The function returns a HTTP response and a future that resolves to the websocket stream.
/// The response body *MUST* be sent to the client before the future can be resolved.
///
/// This functions checks `Sec-WebSocket-Key` and `Sec-WebSocket-Version` headers.
/// It does not inspect the `Origin`, `Sec-WebSocket-Protocol` or `Sec-WebSocket-Extensions` headers.
/// You can inspect the headers manually before calling this function,
/// and modify the response headers appropriately.
///
/// This function also does not look at the `Connection` or `Upgrade` headers.
/// To check if a request is a websocket upgrade request, you can use [`is_upgrade_request`].
/// Alternatively you can inspect the `Connection` and `Upgrade` headers manually.
///
pub fn upgrade<B>(
    mut request: impl std::borrow::BorrowMut<Request<B>>,
    config: Option<WebSocketConfig>,
) -> Result<(Response<BytesBoxBody>, HyperWebsocket), ProtocolError> {
    let request = request.borrow_mut();

    let key = request
        .headers()
        .get("Sec-WebSocket-Key")
        .ok_or(ProtocolError::MissingSecWebSocketKey)?;
    if request
        .headers()
        .get("Sec-WebSocket-Version")
        .map(|v| v.as_bytes())
        != Some(b"13")
    {
        return Err(ProtocolError::MissingSecWebSocketVersionHeader);
    }

    let response = Response::builder()
        .status(hyper::StatusCode::SWITCHING_PROTOCOLS)
        .header(hyper::header::CONNECTION, "upgrade")
        .header(hyper::header::UPGRADE, "websocket")
        .header("Sec-WebSocket-Accept", &derive_accept_key(key.as_bytes()))
        .body(full("switching to websocket protocol"))
        .expect("bug: failed to build response");

    let stream = HyperWebsocket {
        inner: hyper::upgrade::on(request),
        config,
    };

    Ok((response, stream))
}

/// Check if a request is a websocket upgrade request.
///
/// If the `Upgrade` header lists multiple protocols,
/// this function returns true if of them are `"websocket"`,
/// If the server supports multiple upgrade protocols,
/// it would be more appropriate to try each listed protocol in order.
pub fn is_upgrade_request<B>(request: &hyper::Request<B>) -> bool {
    header_contains_value(request.headers(), hyper::header::CONNECTION, "Upgrade")
        && header_contains_value(request.headers(), hyper::header::UPGRADE, "websocket")
}

/// Check if there is a header of the given name containing the wanted value.
fn header_contains_value(
    headers: &hyper::HeaderMap,
    header: impl hyper::header::AsHeaderName,
    value: impl AsRef<[u8]>,
) -> bool {
    let value = value.as_ref();
    for header in headers.get_all(header) {
        if header
            .as_bytes()
            .split(|&c| c == b',')
            .any(|x| trim(x).eq_ignore_ascii_case(value))
        {
            return true;
        }
    }
    false
}

fn trim(data: &[u8]) -> &[u8] {
    trim_end(trim_start(data))
}

fn trim_start(data: &[u8]) -> &[u8] {
    if let Some(start) = data.iter().position(|x| !x.is_ascii_whitespace()) {
        &data[start..]
    } else {
        b""
    }
}

fn trim_end(data: &[u8]) -> &[u8] {
    if let Some(last) = data.iter().rposition(|x| !x.is_ascii_whitespace()) {
        &data[..last + 1]
    } else {
        b""
    }
}

impl std::future::Future for HyperWebsocket {
    type Output = Result<HyperWebsocketStream, Error>;

    fn poll(self: Pin<&mut Self>, cx: &mut Context) -> Poll<Self::Output> {
        let this = self.project();
        let upgraded = match this.inner.poll(cx) {
            Poll::Pending => return Poll::Pending,
            Poll::Ready(x) => x,
        };

        let upgraded = upgraded.map_err(|_| Error::Protocol(ProtocolError::HandshakeIncomplete))?;

        let stream = WebSocketStream::from_raw_socket(
            TokioIo::new(upgraded),
            Role::Server,
            this.config.take(),
        );
        tokio::pin!(stream);

        // The future returned by `from_raw_socket` is always ready.
        // Not sure why it is a future in the first place.
        match stream.as_mut().poll(cx) {
            Poll::Pending => unreachable!("from_raw_socket should always be created ready"),
            Poll::Ready(x) => Poll::Ready(Ok(x)),
        }
    }
}
