/* eslint-disable no-magic-numbers */
import { moduleFor, test } from 'ember-qunit';

let model;

moduleFor('model:alert', 'Unit | Model | alert', {
	beforeEach() {
		model = this.subject();
	}
});

test('it is not shown by default', (assert) => {
	const isShown = model.get('isShown');

	assert.equal(isShown, false);
});

test('it has a duration by default', (assert) => {
	assert.ok(model.get('duration'));
});

test('it is permanent when duration is negative', (assert) => {
	model.set('duration', 1000);

	assert.notOk(model.get('isPermanent'));

	model.set('duration', -1);

	assert.ok(model.get('isPermanent'));
});
