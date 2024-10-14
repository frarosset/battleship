// Font Awesome 5 (Free)
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

export function initFaIcon(faIcon, fullWidth = true) {
  const i = document.createElement("i");
  const classNames = [`fa-${faIcon.prefix}`, `fa-${faIcon.icon}`];
  if (fullWidth) {
    classNames.push("fa-fw");
  }
  i.classList.add(...classNames);
  i.setAttribute("aria-hidden", "true");
  return i;
}

export function setFaIcon(parentElement, faIcon, fullWidth = true) {
  if (faIcon) {
    parentElement.appendChild(initFaIcon(faIcon, fullWidth));
  }
}

export function setFaIconAndLabel(
  parentElement,
  faIcon,
  label = "",
  fullWidth = true,
  txtType = null
) {
  if (faIcon) {
    parentElement.appendChild(initFaIcon(faIcon, fullWidth));
    parentElement.appendChild(createTextElement(label, txtType));
  } else {
    parentElement.textContent = label;
  }
}

export function setLabelAndFaIcon(
  parentElement,
  faIcon,
  label = "",
  fullWidth = true,
  txtType = null
) {
  if (faIcon) {
    parentElement.appendChild(createTextElement(label, txtType));
    parentElement.appendChild(initFaIcon(faIcon, fullWidth));
  } else {
    parentElement.textContent = label;
  }
}

export function setFaIconInBetweenText(
  parentElement,
  faIcon,
  textPre = "",
  textPost = "",
  fullWidth = true,
  txtType = null
) {
  if (faIcon) {
    parentElement.appendChild(createTextElement(textPre, txtType));
    parentElement.appendChild(initFaIcon(faIcon, fullWidth));
    parentElement.appendChild(createTextElement(textPost, txtType));
  } else {
    parentElement.textContent = `${textPre} ${textPost}`;
  }
}

export function changeChildFaIcon(
  parentElement,
  faIcon = { prefix: null, icon: null }
) {
  const iconSVG = parentElement.querySelector("svg");
  if (iconSVG) {
    // <i> element already converted to <svg>
    if (faIcon.prefix) {
      iconSVG.setAttribute("data-prefix", `fa-${faIcon.prefix}`);
    }
    if (faIcon.icon) {
      iconSVG.setAttribute("data-icon", faIcon.icon);
    }
  }
}

function createTextElement(label, txtType = null) {
  if (txtType) {
    const txtElement = document.createElement(txtType);
    txtElement.textContent = label;
    return txtElement;
  } else {
    return document.createTextNode(label);
  }
}
