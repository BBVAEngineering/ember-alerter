/* eslint-disable ember/no-observers, no-magic-numbers */

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { observer } from '@ember/object';

/**
 * Component that extends functionality of alert.
 *
 * @extends Ember.Component
 */
export default Component.extend({

	/**
	 * Service injection.
	 *
	 * @property alerter
	 * @type Object
	 */
	alerter: service(),

	/**
	 * When isShown property is changed, handles the duration and the life of the alert.
	 *
	 * @method isShownDidChange
	 */
	isShowDidChange: observer('model.isShown', function() {
		const alertShow = this.get('model.isShown');
		const wasShown = this.get('model.wasShown');
		const duration = this.get('model.duration');

		// Update last value.
		if (this.get('model')) {
			this.set('model.wasShown', alertShow);
		}

		if (alertShow && !wasShown) {
			// If is shown, run timer to not show.
			if (!this.get('model.isPermanent')) {
				later(this, function() {
					if (!this.isDestroyed) {
						this.set('model.isShown', false);
					}
				}, duration);
			}
		} else if (wasShown) {
			// If is not shown anymore, run timer to remove it from parent.
			later(this, function() {
				if (!this.isDestroyed) {
					this.get('alerter').clear(this.get('model'));
				}
			}, 500);
		}
	}),

	/**
	 * Disables visibility of the alert.
	 *
	 * @method click
	 * @param {Object} e
	 */
	click(e) {
		this._super(e);

		if (this.get('model.isShown')) {
			this.set('model.isShown', false);
		}
	},

	/**
	 * didReceiveAttrs hook.
	 *
	 * @method didReceiveAttrs
	 */
	didReceiveAttrs() {
		this._super();

		// If is first time show alert.
		later(this, function() {
			if (!this.isDestroyed && this.get('model')) {
				this.set('model.isShown', true);
			}
		}, 50);
	}

});
