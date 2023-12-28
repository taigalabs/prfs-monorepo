export const PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE = "PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE";
export const PRFS_SDK_CRAETE_PROOF_EVENT_TYPE = "PRFS_SDK_CREATE_PROOF_EVENT_TYPE";

export function listenClickOutsideIFrame(element: HTMLIFrameElement) {
  function outsideClickListener(event: MouseEvent) {
    if (!element.contains(event.target as any)) {
      element.contentWindow?.postMessage(
        {
          type: PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE,
        },
        "*",
      );
    }
  }

  document.addEventListener("click", outsideClickListener);

  return outsideClickListener;
}

// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
function isVisible(elem: HTMLElement) {
  return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

export function removeClickListener(listener: (ev: MouseEvent) => void) {
  document.removeEventListener("click", listener);
}
