import AlertModel from 'ember-alerter/models/alert';
import Service from '@ember/service';
import { A, isArray } from '@ember/array';

/**
 * Service that is used to send alerts through the application.
 *
 * In order to show the alerts in the application, you must have an alerter container
 * created. The container is instanciated by inserting the next lines:
 *
 * ```html
 * {{alert-container}}
 * ```
 *
 * To show an alert you need to call `add` method with an object.
 *
 * ```javascript
 * this.get('alerter').add({
 *     description: 'This is an error',
 *     type: 'error'
 * });
 * ```
 * All the types are defined in `alert-item/component`.
 *
 * You can clear all alerts by using the `clear` method.
 *
 * ```javascript
 * this.get('alerter').clear();
 * ```
 *
 * Or just some of them.
 *
 * ```javascript
 * this.get('alerter').clear((alert) => {
 *   return alert.type === 'error';
 * });
 * ```
 *
 * ```javascript
 * this.get('alerter').clear('type', 'error');
 * ```
 *
 * @extends Ember.Service
 */
export default Service.extend({

	/**
	 * Array model to store alerts.
	 *
	 * @property content
	 * @type Array
	 */
	content: null,

	/**
	 * Array with container views.
	 *
	 * @property views
	 * @type Array
	 */
	views: null,

	/**
	 * Setups objects in the service.
	 *
	 * @method init
	 */
	init() {
		this._super(...arguments);

		this.setProperties({
			content: A(),
			views: A()
		});
	},

	/**
	 * Add alert to the model.
	 *
	 * @method add
	 * @param {Object|Array} alerts
	 */
	add(alerts) {
		alerts = (!isArray(alerts) ? [alerts] : alerts);

		alerts = alerts.map((alert) => {
			this._assignView(alert);

			return AlertModel.create(alert);
		});

		this.get('content').addObjects(alerts);
	},

	/**
	 * Alias method to add.
	 *
	 * @method one
	 */
	one() {
		this.add(...arguments);
	},

	/**
	 * Clean all alerts in the model.
	 *
	 * @method clean
	 */
	clear(key, value) {
		const removed = [];
		let objects = this.get('content');

		if (typeof key === 'function') {
			objects = this.get('content').filter(key);
		} else if (typeof key === 'object') {
			objects = isArray(key) ? key : [key];
		} else if (key && value) {
			objects = this.get('content').filterBy(key, value);
		}

		objects.forEach((object) => {
			if (object && object.get('isShown')) {
				object.set('isShown', false);
			} else {
				removed.push(object);
			}
		});

		this.get('content').removeObjects(removed);
	},

	/**
	 * Select the last view writen in DOM.
	 *
	 * @method _assignView
	 * @param {Object} alert
	 * @private
	 */
	_assignView(alert) {
		const lastView = this.get('views.lastObject');

		// When an alert has no view assigned, it will be shown in every alert container.
		if (lastView) {
			alert.view = lastView.get('elementId');
		}
	}

});
