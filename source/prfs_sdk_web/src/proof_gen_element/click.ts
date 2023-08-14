export function hideOnClickOutside(element: HTMLElement) {
  const outsideClickListener = (event: MouseEvent) => {
    console.log(11, event);

    if (!element.contains(event.target as any) && isVisible(element)) {
      // or use: event.target.closest(selector) === null
      // element.style.display = "none";
      removeClickListener();
    }
  };

  const removeClickListener = () => {
    document.removeEventListener("click", outsideClickListener);
  };

  document.addEventListener("click", outsideClickListener);
}

// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
const isVisible = (elem: HTMLElement) =>
  !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
