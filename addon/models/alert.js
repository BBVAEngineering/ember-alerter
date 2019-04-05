import EmberObject from '@ember/object';
import { lt } from '@ember/object/computed';

/**
 * Object that extends functionality of alert.
 *
 * @extends Ember.Object
 */
export default EmberObject.extend({

	/**
	 * Toggles the visibility of the alert.
	 *
	 * @property isShown
	 * @type Boolean
	 */
	isShown: false,

	/**
	 * Default duration (milliseconds).
	 *
	 * @property duration
	 * @type Number
	 */
	duration: 4000,

	/**
	 * Check duration to set as permanent.
	 *
	 * @property isPermanent
	 * @type Boolean
	 */
	isPermanent: lt('duration', 0)

});
