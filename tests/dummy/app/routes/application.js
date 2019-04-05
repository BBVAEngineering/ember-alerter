import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

	alerter: service(),

	actions: {
		open(type) {
			this.get('alerter').add({
				description: `Alert of type ${type}`,
				duration: 100,
				type
			});
		}
	}

});
