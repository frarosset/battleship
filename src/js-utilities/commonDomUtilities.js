// The next function is based on
// https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
export function initHorizontalSwipeDetection(
  element,
  callbackLeft = () => {},
  callbackRight = () => {}
) {
  let xTouchStart;

  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  element.addEventListener("touchstart", (e) => {
    xTouchStart = e.changedTouches[0].screenX;
  });

  element.addEventListener("touchend", (e) => {
    const xTouchEnd = e.changedTouches[0].screenX;
    const sensitivityInPixel = 10;
    const delta = xTouchEnd - xTouchStart;

    if (delta > sensitivityInPixel) {
      callbackRight();
    } else if (delta < -sensitivityInPixel) {
      callbackLeft();
    }
  });
}

export function triggerReflow(element) {
  element.offsetTop;
}

export function deleteElement(childToDelete) {
  removeDescendants(childToDelete);
  childToDelete.parentNode.removeChild(childToDelete);
}

export function removeDescendants(elem) {
  while (elem.hasChildNodes()) {
    removeDescendants(elem.lastChild);
    elem.removeChild(elem.lastChild);
  }
}

export function resetContent(contentDiv) {
  removeDescendants(contentDiv);
  contentDiv.setAttribute("class", "");
  window.scrollTo(0, 0);
}

// from: https://stackoverflow.com/a/143889
// Determines if the passed element is overflowing its bounds,
// either vertically or horizontally.
// Will temporarily modify the "overflow" style to detect this
// if necessary.
function checkOverflow(el)
{
   let curOverflow = el.style.overflow;

   if ( !curOverflow || curOverflow === "visible" )
      el.style.overflow = "hidden";

   let isOverflowing = el.clientWidth < el.scrollWidth 
                    || el.clientHeight < el.scrollHeight;

   el.style.overflow = curOverflow;

   return isOverflowing;
}

// throttle function to avoid calling the actual callback continuously (eg, on resize or scroll)
// from: https://stackoverflow.com/questions/68751736/throttle-window-scroll-event-in-react-with-settimeout
function throttle (callbackFn, limit=100) {
    let wait = false;                  
    return function () {              
        if (!wait) {                  
            callbackFn.call();           
            wait = true;               
            setTimeout(function () {
                callbackFn.call();
                wait = false;          
            }, limit);
        }
    }
}

function fitFontSize(elem, defaultFontSize='',delta=0.9){
    // Initialize the fontSize, if the initial value is provided
    if (defaultFontSize)
        elem.style.fontSize = defaultFontSize;
    let fontSize = getComputedStyle(elem).getPropertyValue('font-size');

    let fontSizeVal,fontSizeUnit; 
    [fontSizeVal,fontSizeUnit] = splitCSSUnits(fontSize);

    while (checkOverflow(elem)){
        fontSizeVal *= delta;
        elem.style.fontSize = fontSizeVal + fontSizeUnit;
    }
}

function splitCSSUnits(CSSAttrVal){
    return [CSSAttrVal.match(/[\d.]+/)[0],CSSAttrVal.match(/[^\d.]+/)[0]];
}