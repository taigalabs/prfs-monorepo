// use http_body_util::BodyExt;
// use hyper::server::conn::http2;
use hyper_util::rt::TokioIo;
use std::cell::Cell;
use std::net::SocketAddr;
use std::rc::Rc;
use tokio::io::{self, AsyncWriteExt};
use tokio::net::TcpListener;

// use hyper::body::{Body as HttpBody, Bytes, Frame};
use hyper::service::service_fn;
use hyper::Request;
use hyper::{Error, Response};
use std::marker::PhantomData;
use std::pin::Pin;
use std::task::{Context, Poll};
use std::thread;
use tokio::net::TcpStream;

pub struct IOTypeNotSend {
    _marker: PhantomData<*const ()>,
    stream: TokioIo<TcpStream>,
}

impl IOTypeNotSend {
    fn new(stream: TokioIo<TcpStream>) -> Self {
        Self {
            _marker: PhantomData,
            stream,
        }
    }
}

// impl hyper::rt::Write for IOTypeNotSend {
//     fn poll_write(
//         mut self: Pin<&mut Self>,
//         cx: &mut Context<'_>,
//         buf: &[u8],
//     ) -> Poll<Result<usize, std::io::Error>> {
//         Pin::new(&mut self.stream).poll_write(cx, buf)
//     }

//     fn poll_flush(
//         mut self: Pin<&mut Self>,
//         cx: &mut Context<'_>,
//     ) -> Poll<Result<(), std::io::Error>> {
//         Pin::new(&mut self.stream).poll_flush(cx)
//     }

//     fn poll_shutdown(
//         mut self: Pin<&mut Self>,
//         cx: &mut Context<'_>,
//     ) -> Poll<Result<(), std::io::Error>> {
//         Pin::new(&mut self.stream).poll_shutdown(cx)
//     }
// }

// impl hyper::rt::Read for IOTypeNotSend {
//     fn poll_read(
//         mut self: Pin<&mut Self>,
//         cx: &mut Context<'_>,
//         buf: hyper::rt::ReadBufCursor<'_>,
//     ) -> Poll<std::io::Result<()>> {
//         Pin::new(&mut self.stream).poll_read(cx, buf)
//     }
// }
