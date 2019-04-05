import { find, visit } from '@ember/test-helpers';
import $ from 'jquery';
import { module, test } from 'qunit';

import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | alerter', function(hooks) {
  setupApplicationTest(hooks);

  test('Opening an alert. All types', async assert => {
      await visit('/');

      const alrtCont = 'div.alrtCont div[data-id="alertDescription"]';

      $('#openOk').click();
      assert.dom(alrtCont).hasText('Alert of type ok');
      $('#openInfo').click();
      assert.dom(alrtCont).hasText('Alert of type info');
      $('#openAdvise').click();
      assert.dom(alrtCont).hasText('Alert of type advise');
      $('#openWarning').click();
      assert.dom(alrtCont).hasText('Alert of type warning');
      $('#openError').click();
      assert.dom(alrtCont).hasText('Alert of type error');
  });
});
