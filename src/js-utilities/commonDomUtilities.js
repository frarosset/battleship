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

export function waitForAsync(waitInMs) {
  return new Promise((resolve) => setTimeout(resolve, waitInMs));
}

export async function ensureCssClassForAnimationAsync() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await waitForAsync(0);
}

export async function triggerAnimation(
  div,
  animationInitialStateClass,
  animationDuration,
  hide = false
) {
  // this uses a trick to trigger the animation on the element

  hide
    ? div.classList.remove(animationInitialStateClass)
    : div.classList.add(animationInitialStateClass);

  await ensureCssClassForAnimationAsync();

  div.classList.toggle(animationInitialStateClass);

  // wait for the animation to end before removing it
  return waitForAsync(animationDuration);
}
