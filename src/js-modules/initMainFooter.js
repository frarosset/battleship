import { initFooter, initP } from "../js-utilities/commonDomComponents.js";

export default function initMainFooter() {
  const footer = initFooter("main-footer");
  const p = initP("main-footer__p");

  const str1 = `Dialogs and assets (ships, hit/miss marks) generated using ${getAnchorStr("Microsoft Copilot", "https://copilot.microsoft.com/")}.`;
  const str2 = `Background images generated using ${getAnchorStr("Google Gemini (Imagen 3)", "https://gemini.google.com/")}.`;
  const str3 = `Images have been edited using 
        ${getAnchorStr("Pixelcut", "https://www.pixelcut.ai/")},  
        ${getAnchorStr("removebg", "https://www.remove.bg/")},  
        ${getAnchorStr("onlinepngtools", "https://onlinepngtools.com/rotate-png")}, 
        ${getAnchorStr("Image Resizer.com", "https://imageresizer.com/")}, 
        ${getAnchorStr("TinyPNG", "https://tinypng.com/")}.`;

  p.innerHTML = `${str1} ${str2} ${str3}`;

  footer.append(p);
  return footer;
}

function getAnchorStr(label, link) {
  return `<a href="${link}" target="_blank">${label}</a>`;
}
