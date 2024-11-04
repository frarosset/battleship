export function removeDescendants(elem, newContent = undefined) {
  elem.replaceChildren(newContent);
}

export function resetContent(contentDiv, newContent = undefined) {
  removeDescendants(contentDiv, newContent);
  contentDiv.setAttribute("class", "");
  window.scrollTo(0, 0);
}
