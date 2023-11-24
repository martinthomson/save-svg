browser.contextMenus.create({
  id: "save-svg",
  title: "Save SVG...",
  contexts: ["page", "frame", "link", "selection"],
}, () => void browser.runtime.lastError);

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-svg") {
    let code = `
    var i = browser.menus.getTargetElement(${info.targetElementId}).closest('svg');
    if (i) {
      var t = (new XMLSerializer()).serializeToString(i);
      var b = new Blob([t], {type: 'image/svg+xml'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = i.id || 'image';
      a.click();
    }`;
    browser.tabs.executeScript(tab.id, {
      frameId: info.frameId,
      code,
    }).catch(e => {
      console.warn(`Error in saving SVG: ${e}`);
    });
  }
});
