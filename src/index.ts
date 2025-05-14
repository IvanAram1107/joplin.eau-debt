import joplin from 'api';
import { Eau } from './eau';
import { EauDebtEntity } from './eau.types';

class EauDebtArray extends Array<EauDebtEntity> {
	public static fromEauDebtEntityList(list: EauDebtEntity[]) {
		return new EauDebtArray(...list);
	}

	constructor(...args: EauDebtEntity[]) {
		super(...args);
	}

	getHtml(): string {
		return "";
	}
}

joplin.plugins.register({
	onStart: async function() {
		const eau = new Eau();
		await eau.init()
		const { panel, html } = await Eau.createPanel("panel", true);
		const debts = EauDebtArray.fromEauDebtEntityList(eau.getDebt());
		const refreshHtml = async () => {
			await joplin.views.panels.setHtml(panel, Eau.replaceTemplateVars(html, (_) => debts.getHtml()));
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
				id: "eau-owner-input",
				label: "Person owes me",
				type: "checkbox"
			}]
		})
	},
});
