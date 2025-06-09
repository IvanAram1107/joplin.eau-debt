import joplin from 'api';
import { Eau } from './eau';
import { EauDebtEntity, EauListItem, EauShoppingItem } from './eau.types';
import { Templates } from './eau.templates';
import { SettingItemType } from 'api/types';


const enum VIEWS {
	DEBTS = "Debts",
	SHOPPING = "Shopping List"
}


class EauShoppingArray extends Array<EauShoppingItem> {
	private fmt = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0});

	public static fromEauShoppingList(list: EauShoppingItem[]) {
		return new EauShoppingArray(...list);
	}

	constructor(...args: EauShoppingItem[]) {
		super(...args);
	}

	private getItems() {
		return this.sort((a, b) => (b.price || 0) - (a.price || 0));
	}

	getHtml(listItemsNum: number): string {
		return Templates.list(listItemsNum * 38, this.getItems().map<EauListItem>(i => {
			return {
				label: `<span>${i.name}</span>
								${i.price && `<span>${this.fmt.format(i.price)}</span>`}`,
				classes: [""],
				button: [{
					content: '<i class="fas fa-times"></i>',
					onclick: `removeShoppingItem('${i.id}')`,
					placement: "start"
				}, {
					content: '<i class="fas fa-edit"></i>',
					onclick: `editShoppingItem('${i.id}')`,
					placement: "end"
				}]
			}
		}));
	}

	removeItem(id: string) {
		const idx = this.findIndex(i => i.id === id);
		if(idx >= 0) {
			this.splice(idx, 1);
		}
	}

	addItem(id: string, name: string, price?: number) {
		const newItem: EauShoppingItem = {
			id,
			name,
			price
		}
		this.unshift(newItem);
	}

	editPrice(id: string, newPrice: number) {
		const item = this.find(d => d.id === id);
		if(item) {
			item.price = newPrice;
		}
	}
}


class EauDebtArray extends Array<EauDebtEntity> {
	private fmt = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0});
	public static fromEauDebtEntityList(list: EauDebtEntity[]) {
		return new EauDebtArray(...list);
	}

	constructor(...args: EauDebtEntity[]) {
		super(...args);
	}

	private getEntitiesSorted() {
		const {debtors, creditors} = this.sort((a, b) => b.amount - a.amount).reduce((acc, curr) => {
			acc[curr.isDebtor ? 'debtors' : 'creditors'].push(curr);
			return acc;
		}, {debtors: [], creditors: []});

		return [...debtors, ...creditors];
	}

	getHtml(listItemsNum: number): string {
		return Templates.list(listItemsNum * 38, this.getEntitiesSorted().map<EauListItem>(e => {
			return {
				label: `<span class="${e.isDebtor ? 'eau-debt-debtor' : 'eau-debt-creditor'}">${e.name}</span>
								<span class="${e.isDebtor ? 'eau-debt-debtor' : 'eau-debt-creditor'}">${this.fmt.format(e.amount)}</span>`,
				button: [{
					content: '<i class="fas fa-edit"></i>',
					onclick: `editDebt('${e.id}')`,
					placement: "end"
				}, {
					content: '<i class="fas fa-check"></i>',
					onclick: `removeDebt('${e.id}')`,
					placement: "start"
				}]
			}
		}));
	}

	removeEntity(id: string) {
		const idx = this.findIndex(d => d.id === id);
		if(idx >= 0) {
			this.splice(idx, 1);
		}
	}

	addEntity(id: string, name: string, amount: number, isDebtor: boolean) {
		const newEntity: EauDebtEntity = {
			id,
			name,
			amount,
			isDebtor 
		}
		this.unshift(newEntity);
	}

	editAmount(id: string, newAmount: number) {
		const entity = this.find(d => d.id === id);
		if(entity) {
			entity.amount = newAmount;
		}
	}
}


joplin.plugins.register({
	onStart: async function() {
		const eau = new Eau();
		await eau.init()
		const { panel, html } = await Eau.createPanel("debt-panel", true);
		const debts = EauDebtArray.fromEauDebtEntityList(eau.getDebt());
		const shopping = EauShoppingArray.fromEauShoppingList(eau.getShopping());
		let currentView = VIEWS.DEBTS;
		await Eau.setupSettings({
			id: "eauDebtSettings",
			label: "Eau - Debt",
			settings: [{
				id: "maxListItems_Debt",
				description: "",
				label: "Max number of list items",
				value: 8,
				type: SettingItemType.Int
			}]
		});
		const refreshHtml = async () => {
			const listItemsNum = await Eau.getSetting("maxListItems_Debt");
			await joplin.views.panels.setHtml(panel, Eau.replaceTemplateVars(html, (match) => {
				if(match === "content"){
					if(currentView === VIEWS.DEBTS) {
						return debts.getHtml(listItemsNum);
					} else if(currentView === VIEWS.SHOPPING){
						return shopping.getHtml(listItemsNum);
					}
				} else if(match === "dropdown") {
					return Templates.dropdown({
						id: "debt-dropdown",
						label: currentView,
						items: [
							VIEWS.DEBTS,
							VIEWS.SHOPPING
						]
					})
				}
			}));
		}
		await refreshHtml();
		const dialog = await Eau.createDialog({
			title: "Add Debt",
			inputs: [{
				id: "eau-name-input",
				label: "Name",
				type: "text"
			}, {
				id: "eau-amount-input",
				label: "Amount",
				type: "number"
			}, {
				id: "eau-creditor-input",
				label: "Is creditor",
				type: "checkbox"
			}]
		});
		const editDialog = await Eau.createDialog({
			title: "Edit Debt",
			inputs: [{
				id: "eau-amount-input",
				label: "New amount",
				type: "number"
			}]
		});
		const addShoppingDialog = await Eau.createDialog({
			title: "Add Shopping Item",
			inputs: [{
				id: "eau-item-name-input",
				label: "Name",
				type: "text"
			}, {
				id: "eau-item-price-input",
				label: "Price",
				type: "number"
			}]
		});
		const editShoppingDialog = await Eau.createDialog({
			title: "Edit Shopping Item",
			inputs: [{
				id: "eau-price-input",
				label: "New price",
				type: "number"
			}]
		});
		joplin.views.panels.onMessage(panel, async (message: any) => {
			if(message.name === "dropdownChange") {
				currentView = message.value;
			} else if(currentView === VIEWS.DEBTS) {
				if(message.name === "add") {
					const res = await joplin.views.dialogs.open(dialog);
					if(res.id === "submit") {
						const name = res.formData?.["eau-dialog-form"]?.["eau-name-input"];
						const amount = res.formData?.["eau-dialog-form"]?.["eau-amount-input"];
						const creditor = res.formData?.["eau-dialog-form"]?.["eau-creditor-input"];
						if(name && amount) {
							debts.addEntity(Eau.generateId(), name, amount, creditor !== "on");
						}
					} else return;
				} else if(message.name === "removeDebt") {
					debts.removeEntity(message.entityId);
				} else if(message.name === "editDebt") {
					const res = await joplin.views.dialogs.open(editDialog);
					if(res.id === "submit") {
						const amount = res.formData?.["eau-dialog-form"]?.["eau-amount-input"];
						if(amount) {
							debts.editAmount(message.entityId, amount);
						}
					}
				}
				await eau.setDebt(debts);
			} else if(currentView === VIEWS.SHOPPING){
				if(message.name === "add") {
					const res = await joplin.views.dialogs.open(addShoppingDialog);
					if(res.id === "submit") {
						const name = res.formData?.["eau-dialog-form"]?.["eau-item-name-input"];
						const price = res.formData?.["eau-dialog-form"]?.["eau-item-price-input"];
						if(name) {
							shopping.addItem(Eau.generateId(), name, price);
						}
					} else return;
				} else if(message.name === "removeShoppingItem") {
					shopping.removeItem(message.itemId);
				} else if(message.name === 'editShoppingItem') {
					const res = await joplin.views.dialogs.open(editShoppingDialog);
					if(res.id === "submit") {
						const price = res.formData?.["eau-dialog-form"]?.["eau-price-input"];
						if(price) {
							shopping.editPrice(message.itemId, price);
						}
					}
				}
				await eau.setShopping(shopping);
			}
			await refreshHtml();
		})
	},
});
