browser.contextMenus.create({
  id: "save-svg",
  title: "Save SVG...",
  contexts: ["page", "frame", "link", "selection"],
}, () => void browser.runtime.lastError);

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-svg") {
    let code = '';
    code += `var i = browser.menus.getTargetElement(${info.targetElementId}).closest('svg');`;
    code += `if (i) {`;
    code += `  var t = (new XMLSerializer()).serializeToString(i);`;
    code += `  var b = new Blob([t], {type: 'image/svg+xml'});`;
    code += `  var a = document.createElement('a');`;
    code += `  a.href = URL.createObjectURL(b);`;
    code += `  a.download = i.id || 'image';`;
    code += `  a.click();`;
    code += `}`;
    console.log(code);
    browser.tabs.executeScript(tab.id, {
      frameId: info.frameId,
      code,
    }).catch(e => {
      console.warn(`Error in saving SVG: ${e}`);
    });
  }
});
