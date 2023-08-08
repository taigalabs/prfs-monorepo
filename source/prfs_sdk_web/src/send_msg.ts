export async function sendMsgToChild(msg: string, iframe: HTMLIFrameElement) {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        res(data.result);
      }
    };

    iframe.contentWindow?.postMessage(`${msg}`, "*", [channel.port2]);
  });
}

export async function sendMsgToParent(msg: string) {
  return new Promise((res, rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      if (data.error) {
        rej(data.error);
      } else {
        res(data.result);
      }
    };

    window.parent.postMessage(`${msg}`, "*", [channel.port2]);
  });
}
