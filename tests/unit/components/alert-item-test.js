/* eslint-disable no-magic-numbers */

import EmberObject from '@ember/object';
import sinon from 'sinon';
import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';

module('Unit | Component | alert-item', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function() {
		const model = EmberObject.create({
			isShown: false
		});

		const component = this.owner.factoryFor('component:alert-item').create({
			alerter: { clear: sinon.spy() },
			model
		});

		this.component = component;
	});

	test('it is not shown and is deleted when it is shown, it is not permanent and its duration expires', async function(assert) {
		this.component.set('model.isShown', true);

		await settled();

		assert.equal(this.component.get('model.isShown'), false);

		await settled();

		assert.ok(this.component.get('alerter').clear.calledWith(this.component.get('model')));
	});

	test('it is shown when it is shown, it is permanent and its duration expires', async function(assert) {
		this.component.set('model.isPermanent', true);
		this.component.set('model.isShown', true);

		await settled();

		assert.equal(this.component.get('model.isShown'), true);
	});

	test('it does not break when it is shown and is destroyed', async function(assert) {
		assert.expect(0);

		this.component.set('model.isShown', true);

		await settled();

		this.component.destroy();

		await settled();
	});

	test('it does not break when it not is shown and is destroyed', async function(assert) {
		assert.expect(0);

		this.component.set('model.isShown', true);

		await settled();

		this.component.destroy();

		await settled();
	});

	test('it disables visibility of the alert when clicked', function(assert) {
		this.component.set('model.isShown', true);

		this.component.click();

		assert.equal(this.component.get('model.isShown'), false);

		this.component.click();

		assert.equal(this.component.get('model.isShown'), false);
	});

	test('it does not enable visibility when it has no model', async function(assert) {
		assert.expect(0);

		this.component.set('model', null);

		this.component.appendTo('#ember-testing');

		await settled();
	});
});
