/* DO NOT MODIFY THIS FILE, IT WILL BE REPLACED */

import { EauButton, EauCheckbox, EauDialog, EauDialogInput, EauDropdown, EauListItem, EauPlacement } from "./eau.types";

function getOrder(placement?: EauPlacement) {
  if(placement === 'start'){
    return 'order: -1';
  } else if(placement === 'end') {
    return 'order: 1';
  } else if(typeof placement === "number"){
    return `order: ${placement}`
  } else {
    return '';
  }
}

export const Templates = {
  dialog(data: EauDialog){
    return `<div class="eau-dialog">
      <p class="eau-dialog-title">
        ${ data.title }
      </p>
      <form name="eau-dialog-form" class="eau-form">
        ${ data.inputs.map(input => this.dialogInput(input)).join("\n") }
      </form>
    </div>`;
  },
  dialogInput(input: EauDialogInput){
    return `<div class="eau-form-field">
      <label for="${ input.id }" class="eau-label">${ input.label }</label>
      <input id="${ input.id }" name="${ input.id }" type="${ input.type }" class="${ input.type === 'checkbox' ? 'eau-checkbox-input' : 'eau-input' }" ${input.type !== "checkbox" ? 'placeholder' : ''} />
    </div>`;
  },
  list(items: EauListItem[]){
    return `<div class='eau-list eau-scrollbar'>
      ${ items.map(item => this.listItem(item)).join("\n") }
    </div>`;
  } ,
  listItem(item: EauListItem) {
    let html = `<div class="eau-list-item ${item.classes?.join(' ') || ''}">`;
    if(item.label) {
      html += `<span class="eau-list-item-label" style="order: 0;">${item.label}</span>`;
    } else if(item.content) {
      html += item.content;
    }
    if(item.checkbox) {
      if("length" in item.checkbox){
        html += item.checkbox.map(ch => this.checkbox(ch)).join("\n");
      } else {
        html += this.checkbox(item.checkbox);
      }
    }
    if(item.button) {
      if("length" in item.button) {
        html += item.button.map(btn => this.button(btn)).join("\n");
      } else {
        html += this.button(item.button);
      }
    }
    html += '</div>';
    return html;
  },
  button(button: EauButton){
    return `<button class="eau-list-item-button" onclick="${button.onclick}" style="${getOrder(button.placement)}">
              ${button.content}
            </button>`;
  },
  checkbox(checkbox: EauCheckbox){
    return `<span class="eau-list-item-checkbox" style="${getOrder(checkbox.placement)}"
            data-checked="${typeof(checkbox.value) === 'boolean' ? +checkbox.value : checkbox.value}"
            onclick="${checkbox.onclick}"></span>`
  },
  dropdown(dropdown: EauDropdown) {
    return `<div class="eau-dropdown" id="${dropdown.id}">
              <span class="eau-dropdown-label">${dropdown.label}</span>
              <div class="eau-dropdown-content">
                ${dropdown.items.map(i => `<p class="eau-dropdown-item" onclick="eauDropdownChange('${dropdown.id}', '${i}')">${i}</p>`).join("\n")}
              </div>
            </div>`;
  }
}