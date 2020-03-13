import AlertModel from 'ember-alerter/models/alert';
import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import { render, clearRender } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

const alerter = {
	content: A(),
	views: A()
};
const template = (hbs `
	{{#alert-container alerter=alerter as |theAlert|}}
		<p>{{theAlert.title}}</p>

		<div data-id="alertDescription">{{theAlert.description}}</div>
	{{/alert-container}}
`);

module('Integration | Component | alert-container', (hooks) => {
	setupRenderingTest(hooks);

	test('it registers and unregisters itself in the service on insert and destroy', async function(assert) {
		this.set('alerter', alerter);
		assert.equal(this.get('alerter.views.length'), 0);

		await render(template);

		const serviceView = this.get('alerter.views.0');

		assert.ok(this.get('alerter.views.length') === 1, 'The alert-container adds itself in the service');
		assert.ok((serviceView._target || serviceView._targetObject) === this, 'The added element is the current alert-container');

		await clearRender();

		assert.equal(alerter.views.length, 0);
	});

	test('it is closed when current alert is not shown', async function(assert) {
		const alert = AlertModel.create({ isShown: false, duration: 0 });

		this.set('alerter', alerter);
		this.get('alerter.content').pushObject(alert);

		await render(hbs `{{alert-container alerter=alerter}}`);

		assert.equal(this.element.querySelector('div.alrtCont').getAttribute('data-alert-show'), 'false');
	});
});
