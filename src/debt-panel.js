function add() {
  webviewApi.postMessage({
    name: "add"
  });
}

function editDebt(entityId) {
  webviewApi.postMessage({
    name: "editDebt",
    entityId
  });
}

function removeDebt(entityId) {
  webviewApi.postMessage({
    name: "removeDebt",
    entityId
  });
}

function openDropdown() {
  const dd = document.getElementById("debt-dropdown");
  if(dd) {
    dd.classList.toggle("open");
  }
}

function eauDropdownChange(ddId, item) {
  const dd = document.getElementById(ddId);
  if(dd) {
    dd.classList.remove("open");
    webviewApi.postMessage({
      name: "dropdownChange",
      value: item
    })
  }
}

function removeShoppingItem(itemId) {
  webviewApi.postMessage({
    name: "removeShoppingItem",
    itemId
  });
}

function editShoppingItem(itemId) {
  webviewApi.postMessage({
    name: "editShoppingItem",
    itemId
  });
}
