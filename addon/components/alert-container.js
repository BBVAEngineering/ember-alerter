/* eslint-disable ember/no-on-calls-in-components */

import Component from '@ember/component';
import layout from '../templates/components/alert-container';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';

/**
 * Component that sorts alerts from service.
 *
 * @extends Ember.Component
 */
export default Component.extend({

	layout,

	/**
	 * Service injection
	 *
	 * @property alerter
	 * @type Object
	 */
	alerter: service(),

	/**
	 * HTML Classes.
	 *
	 * @property classNames
	 * @type Array
	 */
	classNames: ['alrtCont'],

	/**
	 * Attribute bindings.
	 *
	 * @property attributeBindings
	 * @type Array
	 */
	attributeBindings: ['data-alert-show'],

	/**
	 * HTML Class bindings.
	 *
	 * @property classNameBindings
	 * @type Array
	 */
	classNameBindings: ['currentAlert.isPermanent:relative'],

	/**
	 * Compute data-alert-show property.
	 *
	 * @property data-alert-show
	 * @type Boolean
	 */
	'data-alert-show': computed('currentAlert.isShown', function() {
		const isShown = this.get('currentAlert.isShown');

		return String(isShown);
	}),

	/**
	 * Filtered content of the component by view elementId.
	 *
	 * @property content
	 * @type Array
	 */
	content: computed('alerter.content.[]', function() {
		const elementId = this.get('elementId');

		const filter = this.get('alerter.content').filter((alert) => {
			const view = alert.get('view');

			// Select alerts that has no view in every container or
			// the one that has the current view.
			return (!view || elementId === view);
		});

		return A(filter).sortBy('isPermanent', 'duration');
	}),

	/**
	 * Get current alert as the first object or the current object showing.
	 *
	 * @property currentAlert
	 * @type Object
	 */
	currentAlert: computed('content.[]', function() {
		let currentAlert = this.get('content');

		currentAlert = A(currentAlert).rejectBy('isPermanent', true);

		currentAlert = A(currentAlert).findBy('isShown', true);

		if (!currentAlert) {
			currentAlert = this.get('content.firstObject');
		}

		return currentAlert;
	}),

	/**
	 * Register the view in the alerter service.
	 *
	 * @method register
	 */
	register: on('willInsertElement', function() {
		this.get('alerter.views').addObject(this);
	}),

	/**
	 * Unregister the view in the alerter service.
	 *
	 * @method unregister
	 */
	unregister: on('willDestroyElement', function() {
		this.get('alerter.views').removeObject(this);
	})

});
