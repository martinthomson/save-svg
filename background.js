const MENU = "save-svg";

function save_svg(id) {
  function status(msg) {
    let d = document.createElement('dialog');
    d.style.display = 'block';
    d.style.zIndex = [...document.body.children].reduce((a, e) => {
      let z = parseInt(getComputedStyle(e).zIndex);
      return z && Math.max(a, z) || a;
    }, 0) + 1;
    d.style.position = 'fixed';
    d.style.bottom = '50px';
    d.style.margin = 'auto';
    d.style.padding = '10px 30px';
    d.style.font = 'normal bold 20px/20px sans-serif';
    d.style.color = 'white';
    d.style.backgroundColor = 'rgb(34, 102, 68)';
    d.style.border = '2px solid rgb(13, 49, 31)';
    d.style.borderRadius = '8px';
    d.style.opacity = 0.8;
    d.style.transition = 'opacity 1s linear';
    d.textContent = msg;
    d.onclick = _ => document.body.removeChild(d);
    document.body.appendChild(d);
    window.setTimeout(_ => {
      d.style.opacity = 0;
      window.setTimeout(_ => document.body.removeChild(d), 1000);
    }, 2000);
  }

  var i = browser.menus.getTargetElement(id).closest('svg');
  if (!i) {
    status("No SVG found");
    return;
  }

  var t = (new XMLSerializer()).serializeToString(i);
  var b = new Blob([t], {type: 'image/svg+xml'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = i.id || 'image';
  a.click();
  status("SVG saved");
}

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: MENU,
    title: 'Save SVG...',
    contexts: ['page', 'frame', 'link', 'selection'],
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
