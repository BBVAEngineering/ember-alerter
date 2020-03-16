import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { waitFor, settled, visit, click } from '@ember/test-helpers';

module('Acceptance | alerter', (hooks) => {
	setupApplicationTest(hooks);

	test('Opening an alert', async(assert) => {
		await visit('/');

		click('#openOk');

		const $element = await waitFor('div.alrtCont div[data-id="alertDescription"]');

		assert.equal($element.textContent.trim(), 'Alert of type ok');

		await settled();
	});
});
