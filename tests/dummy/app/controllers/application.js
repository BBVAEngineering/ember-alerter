import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplciationController extends Controller {
	@service alerter;

	@action
	open(type) {
		this.alerter.add({
			description: `Alert of type ${type}`,
			duration: 100,
			type
		});
	}
}
