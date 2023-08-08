const sdkEndpoint = "http://localhost:3010";

export class PrfsSDK {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  mount(containerName: string) {
    const container = document.querySelector(containerName);

    if (!container) {
      console.error(`No target element named, ${containerName}`);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = sdkEndpoint;

    container.append(iframe);
  }
}
