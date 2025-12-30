export const getScrollbarSize = () => {
  const div = document.createElement("div");
  div.style.overflow = "scroll";
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.position = "absolute";
  div.style.visibility = "hidden";

  document.body.appendChild(div);

  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  const scrollbarHeight = div.offsetHeight - div.clientHeight;

  document.body.removeChild(div);

  return { width: scrollbarWidth, height: scrollbarHeight };
}

export const updateScrollbarSizeVar = () => {
  const scrollbarSize = getScrollbarSize();
  document.documentElement.style.setProperty("--scrollbar", `${scrollbarSize.width}px`);
}