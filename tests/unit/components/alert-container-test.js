/* eslint-disable no-magic-numbers */
import Component from '@ember/component';
import { A } from '@ember/array';
import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';
import AlertModel from 'ember-alerter/models/alert';

let component, alerter, inner;

moduleForComponent('alert-container', 'Unit | Component | alert-container', {
	unit: true,

	needs: ['service:alerter'],

	beforeEach() {
		alerter = {
			content: A(),
			views: A()
		};

		inner = Component.extend();

		component = this.subject({ alerter });

		this.registry.register('component:alert-item', inner);
	},
	afterEach() {
		this.registry.unregister('component:alert-item');
	}
});

test('it gets alerts assigned to the view or with no view from service sorted by duration', (assert) => {
	const alert1 = AlertModel.create({ view: component.elementId, duration: 200 });
	const alert2 = AlertModel.create({ duration: 100 });
	const alert3 = AlertModel.create({ view: 'foo' });

	component.get('alerter.content').addObjects([
		alert1,
		alert2,
		alert3
	]);

	assert.equal(component.get('content.length'), 2);
	assert.equal(component.get('content.0.duration'), 100);
	assert.equal(component.get('content.1.duration'), 200);
});

test('it returns first alert in service when there is no one shown', (assert) => {
	const alert1 = AlertModel.create({ view: component.elementId });
	const alert2 = AlertModel.create();

	run(component, 'set', 'alerter.content', [alert1, alert2]);

	assert.equal(component.get('currentAlert'), alert1);
});

test('it returns currently showing alert', (assert) => {
	const alert1 = AlertModel.create();
	const alert2 = AlertModel.create({ view: component.elementId, isShown: true });
	const alert3 = AlertModel.create();

	run(component, 'set', 'content', [alert1, alert2, alert3]);

	assert.equal(component.get('currentAlert'), alert2);
});

test('it registers and unregisters itself in the service on insert and destroy', function(assert) {
	assert.equal(component.get('alerter.views.length'), 0);

	this.render();

	assert.equal(component.get('alerter.views.0'), component);

	run(component, 'destroy');

	assert.equal(alerter.views.length, 0);
});

test('it is closed when current alert is not shown', function(assert) {
	const alert = AlertModel.create({ isShown: false });

	component.set('currentAlert', alert);

	this.render();

	assert.equal(component.$().attr('data-alert-show'), 'false');
});

test('it is relative when current alert is permanent', function(assert) {
	const alert = AlertModel.create({ isPermanent: true });

	component.set('currentAlert', alert);

	this.render();

	assert.ok(component.$().hasClass('relative'));
});
