import { setLabelAndFaIcon } from "./fontAwesomeUtilities.js";
import WebFont from "webfontloader";

const defaultData = {
  name: "F. Rosset",
  githubName: "frarosset",
};

export default function setCreditFooter(data, parent = document.body) {
  data = Object.assign({},defaultData, data);

  //let footer = document.querySelector("footer");
  //if (!footer) {
  const footer = document.createElement("footer");
  footer.classList.add("credit-footer");
  parent.appendChild(footer);
  //}

  const a = document.createElement("a");
  a.href = `https://github.com/${data.githubName}`;
  setLabelAndFaIcon(
    a,
    { prefix: "brands", icon: "github" },
    `${data.name} `,
    false
  );

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("Created by "));
  p.appendChild(a);

  const divContainer = document.createElement("div");
  divContainer.classList.add = "credit-footer";
  divContainer.appendChild(p);

  // Apply styling

  const aFont = "Bad Script";
  const pFont = "Montserrat";

  // Load the fonts
  // see https://github.com/typekit/webfontloader
  // you need to load the WebFont library in the <head>:
  // <script src="https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js" async ></script>
  // or install and import webfontloader
  // (npm install webfontloader)
  WebFont.load({
    google: {
      families: [aFont, pFont],
    },
  });

  const color = "rgb(0, 0, 0)";
  const bgColor = "rgb(210, 210, 210, 80%)";
  const fontSize = "16px";
  const iconSize = "21px";
  const padding = "5px";
  const lineHeight = "1.5";

  a.style.color = color;
  a.style.fontFamily = `"${aFont}", monospace`;
  a.style.fontSize = fontSize;
  a.style.fontWeight = "800";
  a.style.lineHeight = "inherit";
  a.style.textDecoration = "none";
  a.style.verticalAlign = "middle";

  a.children[0].style.fontSize = iconSize; // set FaIcon size
  a.children[0].style.lineHeight = 1;
  a.children[0].style.verticalAlign = "top";

  p.style.color = color;
  p.style.fontFamily = `"${pFont}", sans-serif`;
  p.style.fontSize = fontSize;
  p.style.lineHeight = lineHeight;
  p.style.textAlign = "center";
  p.style.verticalAlign = "middle";
  p.style.width = "100%";

  divContainer.style.alignItems = "center";
  divContainer.style.backgroundColor = bgColor;
  divContainer.style.display = "flex";
  divContainer.style.justifyContent = "center";
  divContainer.style.padding = padding;
  divContainer.style.width = "100%";

  // Add to DOM
  footer.appendChild(divContainer);

  return divContainer;
}
