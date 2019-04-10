import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import AlertModel from 'ember-alerter/models/alert';

let service;

module('Unit | Service | alerter', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function() {
		service = this.owner.lookup('service:alerter');
	});

	test('it has an empty array', (assert) => {
		const content = service.get('content');

		assert.ok(isEmpty(content));
	});

	test('it add alerts to the array as objects', (assert) => {
		const alert = { foo: 'bar' };
		const alerts = [{ bar: 'foo' }];

		service.add(alert);

		assert.equal(service.get('content.length'), 1);
		assert.ok(service.get('content.0') instanceof AlertModel);

		service.add(alerts);

		assert.equal(service.get('content.length'), 2);
		assert.ok(service.get('content.1') instanceof AlertModel);
	});

	test('it assign alert with last view when alert is added', function(assert) {
		this.owner.register('component:dummy-component', Component.extend());

		let view;
		const alert = {};

		run(() => {
			view = this.owner.lookup('component:dummy-component');
		});

		service.get('views').addObject(view);

		service.add(alert);

		assert.equal(alert.view, view.elementId);

		run(() => {
			this.owner.unregister('component:dummy-component');
			view.destroy();
		});
	});

	test('it clears all alerts', (assert) => {
		const alerts = [{}, {}, {}];

		service.add(alerts);

		service.clear();

		assert.equal(service.get('content.length'), 0);
	});

	test('it clears alerts by callback when callback is passed', (assert) => {
		const callback = (alert) => (alert.foo === 'bar');
		const alerts = [{ foo: 'bar' }, { foo: 'wow' }];

		service.add(alerts);

		service.clear(callback);

		assert.equal(service.get('content.length'), 1);
		assert.equal(service.get('content.0.foo'), 'wow');
	});

	test('it clears alerts by key-value when key-value is passed', (assert) => {
		const alerts = [{ foo: 'bar' }, { foo: 'wow' }];

		service.add(alerts);

		service.clear('foo', 'bar');

		assert.equal(service.get('content.length'), 1);
		assert.equal(service.get('content.0.foo'), 'wow');
	});

	test('it clears alerts by object when object is passed', (assert) => {
		const alerts = [{ foo: 'bar' }, { foo: 'wow' }];

		service.add(alerts);

		service.clear(service.get('content.0'));

		assert.equal(service.get('content.length'), 1);
		assert.equal(service.get('content.0.foo'), 'wow');
	});

	test('it clears alerts by array when array is passed', (assert) => {
		const alerts = [{ foo: 'bar' }, { foo: 'wow' }];

		service.add(alerts);

		service.clear(service.get('content'));

		assert.equal(service.get('content.length'), 0);
	});

	test('it sets shown property of alert to false when is true and clear is called', (assert) => {
		const alerts = { foo: 'bar' };

		service.add(alerts);

		service.get('content.0').set('isShown', true);

		service.clear();

		assert.equal(service.get('content.length'), 1);
		assert.equal(service.get('content.0.isShown'), false);
	});
});
