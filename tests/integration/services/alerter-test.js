/* eslint-disable no-magic-numbers, max-statements */
import $ from 'jquery';
import hbs from 'htmlbars-inline-precompile';
import wait from 'dummy/tests/helpers/wait';
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { setupRenderingTest } from 'ember-qunit';

let service;

module('Integration | Service | alerter', function(hooks) {
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

	hooks.afterEach(function() {
		run(service.get('content'), 'clear');
		run.cancelTimers();
	});

	function find(query) {
		return $(query);
	}

	test('it renders and hide one alert', (assert) => {
		let $element;

		run(service, 'add', {
			description: 'Foo',
			type: 'error'
		});

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Alert is hidden');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Foo', 'Alert is shown');

		wait(4000);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Alert is hidden again');

		wait(500);

		$element = find('.alrtCont .error');

		assert.equal($element.length, 0, 'Alert is removed from DOM');
	});

	test('it renders secuentially multiple alerts', (assert) => {
		let $element;

		run(service, 'add', [{
			duration: 5000,
			description: 'Foo',
			type: 'error'
		}, {
			duration: 1000,
			description: 'Bar',
			type: 'error'
		}]);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'First alert is hidden');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Bar', 'First alert is displayed');

		wait(1000);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'First alert is hidden again');

		wait(500);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Second alert is hidden');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Foo', 'Second alert is displayed');

		wait(5000);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Second alert is hidden again');

		wait(500);

		$element = find('.alrtCont .error');

		assert.equal($element.length, 0, 'There is no alert');
	});

	test('it renders permanent alert', (assert) => {
		let $element;

		run(service, 'add', {
			duration: -1,
			description: 'Foo',
			type: 'error'
		});

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'First alert is hidden');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Foo', 'First alert is displayed');

		wait(10000);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 0, 'First alert is still displayed');

		run(service, 'add', {
			description: 'Bar',
			duration: 2000,
			type: 'error'
		});

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Second alert is hidden');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Bar', 'Second alert is displayed');

		wait(2000);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Second alert is hidden again');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Foo', 'First alert is visible again');
	});

	test('it renders second alert when the first disapears', (assert) => {
		let $element;

		run(service, 'add', {
			duration: 5000,
			description: 'Foo',
			type: 'error'
		});

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'First alert is hidden.');

		wait(500);

		run(service, 'add', {
			duration: 1000,
			description: 'Bar',
			type: 'error'
		});

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Foo', 'First alert is shown.');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Foo', 'First alert is still shown.');

		wait(4000);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'First alert is hidden again.');

		wait(500);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Second alert is hidden.');

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Bar', 'Second alert is shown.');

		wait(1000);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Second alert is hidden.');

		wait(500);

		$element = find('.alrtCont .error');

		assert.equal($element.length, 0, 'All alerts are deleted.');
	});

	test('it cleans alerts', (assert) => {
		let $element;

		run(service, 'add', [{
			duration: 5000,
			description: 'Foo',
			type: 'error'
		}, {
			duration: 4000,
			description: 'Bar',
			type: 'error'
		}, {
			duration: 6000,
			description: 'Wow',
			type: 'error'
		}]);

		wait(500);

		$element = find('[data-alert-show="true"].alrtCont .error [data-id="alertDescription"]');

		assert.equal($element.text().trim(), 'Bar', 'Alert is displayed');

		run(service, 'clear');

		wait(500);

		$element = find('[data-alert-show="false"].alrtCont .error');

		assert.equal($element.length, 1, 'Alert is hidden.');

		wait(500);

		$element = find('.alrtCont .error');

		assert.equal($element.length, 0, 'All alerts are deleted');
	});
});
