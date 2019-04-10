import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { A } from '@ember/array';
import AlertModel from 'ember-alerter/models/alert';

const alerter = {
	content: A(),
	views: A()
};

module('Unit | Component | alert-container', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function() {
		const component = this.owner.factoryFor('component:alert-container').create({ alerter });

		this.component = component;
	});

	test('it gets alerts assigned to the view or with no view from service sorted by duration', function(assert) {
		const alert1 = AlertModel.create({ view: this.component.elementId, duration: 200 });
		const alert2 = AlertModel.create({ duration: 100 });
		const alert3 = AlertModel.create({ view: 'foo' });

		this.component.get('alerter.content').addObjects([
			alert1,
			alert2,
			alert3
		]);

		assert.equal(this.component.get('content.length'), 2, 'Two alerts');
		assert.equal(this.component.get('content.0.duration'), 100, 'First alert');
		assert.equal(this.component.get('content.1.duration'), 200, 'Second alert');
	});

	test('it returns first alert in service when there is no one shown', function(assert) {
		const alert1 = AlertModel.create({ view: this.component.elementId });
		const alert2 = AlertModel.create();

		this.component.set('alerter.content', [alert1, alert2]);

		assert.equal(this.component.get('currentAlert'), alert1, 'The current alert is the first one');
	});

	test('it returns currently showing alert', function(assert) {
		const alert1 = AlertModel.create();
		const alert2 = AlertModel.create({ view: this.component.elementId, isShown: true });
		const alert3 = AlertModel.create();

		this.component.set('alerter.content', [alert1, alert2, alert3]);

		assert.equal(this.component.get('currentAlert'), alert2, 'The current alert is the visible one');
	});
});
