export function removeDescendants(elem, newContent = undefined) {
  elem.replaceChildren(newContent);
}

export function resetContent(contentDiv, newContent = undefined) {
  removeDescendants(contentDiv, newContent);
  contentDiv.setAttribute("class", "");
  window.scrollTo(0, 0);
}

export function getNestedElementOfClass(point, requiredClass) {
  const nestedElements = document.elementsFromPoint(...point);

  for (const element of nestedElements) {
    const classList = element.classList;

    if ([...classList].includes(requiredClass)) {
      return element;
    }
  }

  return null;
}
