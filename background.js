const MENU = "save-svg";

function save_svg(id) {
  var i = browser.menus.getTargetElement(id).closest('svg');
  if (!i) { return; }

  var t = (new XMLSerializer()).serializeToString(i);
  var b = new Blob([t], {type: 'image/svg+xml'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = i.id || 'image';
  a.click();
}

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: MENU,
    title: "Save SVG...",
    contexts: ["page", "frame", "link", "selection"],
  }, () => void browser.runtime.lastError);
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU) {
    return;
  }
  try {
    await browser.scripting.executeScript({
      target: { tabId: tab.id, frameIds: [ info.frameId ] },
      args: [info.targetElementId],
      func: save_svg,
    })
  } catch(e) {
    console.warn(`Error saving SVG: ${e}`);
  }
});
