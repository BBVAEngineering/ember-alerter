/* eslint-disable no-magic-numbers, max-statements */

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { waitFor, settled, render } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { setupRenderingTest } from 'ember-qunit';

let service;

module('Integration | Service | alerter', (hooks) => {
	setupRenderingTest(hooks);

	hooks.beforeEach(async function() {
		service = this.owner.lookup('service:alerter');

		await render(hbs `
          {{#alert-container as |alert|}}
              <div class="{{alert.type}}">
                  <div data-id="alertDescription">{{alert.description}}</div>
              </div>
          {{/alert-container}}
      `);
	});

	hooks.afterEach(() => {
		run(service.get('content'), 'clear');
		run.cancelTimers();
	});

	test('it renders an alert with the method `one`', async(assert) => {
		run(service, 'one', {
			description: 'Foo',
			type: 'error',
			duration: 100
		});

		assert.dom('[data-alert-show="false"].alrtCont .error').exists('Alert is hidden');

		await settled();
	});

	test('it renders and hide one alert', async(assert) => {
		let $element;

		run(service, 'add', {
			description: 'Foo',
			type: 'error',
			duration: 100
		});

		assert.dom('[data-alert-show="false"].alrtCont .error').exists('Alert is hidden');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.dom($element).hasText('Foo', 'Alert is shown');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error', { timeout: 10000 });

		assert.ok($element, 'Alert is hidden again');

		await settled();

		assert.dom('.alrtCont .error').doesNotExist('Alert is removed from DOM');
	});

	test('it renders secuentially multiple alerts', async(assert) => {
		let $element;

		run(service, 'add', [{
			duration: 200,
			description: 'Foo',
			type: 'error'
		}, {
			duration: 100,
			description: 'Bar',
			type: 'error'
		}]);

		$element = await waitFor('[data-alert-show="false"].alrtCont .error');

		assert.ok($element, 'First alert is hidden');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.dom($element).hasText('Bar', 'First alert is displayed');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error');

		assert.ok($element, 'First alert is hidden again');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error');

		assert.ok($element, 'Second alert is hidden');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.dom($element).hasText('Foo', 'Second alert is displayed');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error', { timeout: 10000 });

		assert.ok($element, 'Second alert is hidden again');

		await settled();

		assert.dom('.alrtCont .error').doesNotExist('Alert is removed from DOM');
	});

	test('it renders permanent alert', async(assert) => {
		let $element;

		run(service, 'add', {
			duration: -1,
			description: 'Foo',
			type: 'error'
		});

		$element = await waitFor('[data-alert-show="false"].alrtCont .error');

		assert.ok($element, 'First alert is hidden');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.dom($element).hasText('Foo', 'First alert is displayed');

		await settled();

		assert.dom('[data-alert-show="false"].alrtCont .error').doesNotExist('First alert is still displayed');

		run(service, 'add', {
			description: 'Bar',
			duration: 1000,
			type: 'error'
		});

		$element = await waitFor('[data-alert-show="false"].alrtCont .error');

		assert.ok($element, 'Second alert is hidden');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.dom($element).hasText('Bar', 'Second alert is displayed');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error', { timeout: 10000 });

		assert.ok($element, 'Second alert is hidden again');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.dom($element).hasText('Foo', 'First alert is visible again');
	});

	test('it renders second alert when the first disapears', async(assert) => {
		let $element;

		service.add({
			duration: 50,
			description: 'Foo',
			type: 'error1'
		});

		$element = await waitFor('[data-alert-show="false"].alrtCont .error1');

		assert.ok($element, 'First alert is hidden.');

		service.add({
			duration: 100,
			description: 'Bar',
			type: 'error2'
		});

		$element = await waitFor('[data-alert-show="true"].alrtCont .error1 [data-id="alertDescription"]', { timeout: 10000 });

		assert.dom($element).hasText('Foo', 'First alert is shown');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error1 [data-id="alertDescription"]');

		assert.dom($element).hasText('Foo', 'First alert is still shown');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error1', { timeout: 10000 });

		assert.ok($element, 'First alert is hidden again.');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error2', { timeout: 10000 });

		assert.ok($element, 'Second alert is hidden.');

		$element = await waitFor('[data-alert-show="true"].alrtCont .error2 [data-id="alertDescription"]');

		assert.dom($element).hasText('Bar', 'Second alert is shown.', { timeout: 10000 });

		$element = await waitFor('[data-alert-show="false"].alrtCont .error2');

		assert.ok($element, 'Second alert is hidden.');

		await settled();

		assert.dom('.alrtCont .error').doesNotExist('All alerts are deleted.');
	});

	test('it cleans alerts', async(assert) => {
		let $element;

		run(service, 'add', [{
			duration: 500,
			description: 'Foo',
			type: 'error'
		}, {
			duration: 400,
			description: 'Bar',
			type: 'error'
		}, {
			duration: 600,
			description: 'Wow',
			type: 'error'
		}]);

		$element = await waitFor('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.dom($element).hasText('Bar', 'Alert is displayed');

		run(service, 'clear');

		$element = await waitFor('[data-alert-show="false"].alrtCont .error');

		assert.ok($element, 'Alert is hidden.');

		await settled();

		assert.dom('.alrtCont .error').doesNotExist('All alerts are deleted.');
	});
});
