import $ from 'jquery';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { test } from 'qunit';

moduleForAcceptance('Acceptance | alerter');

test('Opening an alert. All types', (assert) => {
	visit('/');

	const alrtCont = 'div.alrtCont div[data-id="alertDescription"]';

	andThen(() => {
		$('#openOk').click();
		assert.equal(find(alrtCont).text(), 'Alert of type ok');
	});

	andThen(() => {
		$('#openInfo').click();
		assert.equal(find(alrtCont).text(), 'Alert of type info');
	});

	andThen(() => {
		$('#openAdvise').click();
		assert.equal(find(alrtCont).text(), 'Alert of type advise');
	});

	andThen(() => {
		$('#openWarning').click();
		assert.equal(find(alrtCont).text(), 'Alert of type warning');
	});

	andThen(() => {
		$('#openError').click();
		assert.equal(find(alrtCont).text(), 'Alert of type error');
	});
});
