import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { settled, find, visit } from '@ember/test-helpers';

module('Acceptance | alerter', (hooks) => {
	setupApplicationTest(hooks);

	test('Opening an alert', async(assert) => {
		await visit('/');

		const button = await find('#openOk');

		button.click();

		assert.dom('div.alrtCont div[data-id="alertDescription"]').hasText('Alert of type ok');

		await settled();
	});
});
