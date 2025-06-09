/* DO NOT MODIFY THIS FILE, IT WILL BE REPLACED */

export type EauTask = {
  id: string;
	description: string;
	dueToday: boolean;
}

export type EauDebtEntity = {
  id: string;
  name: string;
  amount: number;
  isDebtor: boolean;
}

export type EauShoppingItem = {
  id: string;
  name: string;
  price?: number;
}

export type EauConfig = {
  noteId: string;
  tasks: EauTask[];
  debt: EauDebtEntity[];
  shopping: EauShoppingItem[];
}

export type EauCommand = {
  id: string;
  label: string;
  iconName: string;
  execute: () => Promise<any>;
}

export type EauSettingsSection = {
  id: string;
  label: string;
  settings: EauSetting[];
}

export type EauSetting = {
  id: string;
  value: any;
  type: any; // SettingItemType
  description: string;
  label: string;
}

export type EauNote = {
  id: string;
  title: string;
  body: string;
  parent_id?: string;
  [key: string]: any;
}

export type EauNotebook = {
  id: string;
  title: string;
  [key: string]: any;
}

export type EauPanelResponse = {
  panel: string;
  html: string;
}

export type EauDialog = {
  title: string;
  inputs: EauDialogInput[];
}

export type EauDialogInput = {
  id: string;
  label: string;
  type: "number" | "text" | "checkbox";
}

type EauListItemBase = {
  checkbox?: EauCheckbox | EauCheckbox[];
  classes?: string[];
  button?: EauButton | EauButton[];
}

type EauListItemWithLabel = EauListItemBase & {
  label: string;
  content?: never;
}

type EauListItemWithContent = EauListItemBase & {
  label?: never;
  content: string;
}

export type EauListItem = EauListItemWithLabel | EauListItemWithContent;

/**
 * This is used to set the placement of the element inside a list item (except the label).
 * So basically to set the placement of the button and checkbox.
 * 
 * - "start" and "end" will set the order to -1 and 1 respectively. If 2 elements
 *    within one list item have "start" or "end" both will have the order set to
 *    the same value which can cause unexpected behaviour.
 * - <number> is to specify the exact order where you want the element to be. The 
 *    label's order is set to 0, so negative values will be placed at the start of
 *    the list item and positive values at the end.
 */
export type EauPlacement = "start" | "end" | number;

export type EauCheckbox = {
  value: "1" | "0" | boolean;
  onclick: string;
  placement?: EauPlacement;
}

export type EauButton = {
  content: string;
  onclick: string;
  placement?: EauPlacement;
}

export type EauDropdown = {
  id: string;
  label: string;
  items: string[];
}