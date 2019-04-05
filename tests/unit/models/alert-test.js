import { module, test } from 'qunit';
/* eslint-disable no-magic-numbers */
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

let model;

module('Unit | Model | alert', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
      model = run(() => this.owner.lookup('service:store').createRecord('alert'));
  });

  test('it is not shown by default', (assert) => {
      const isShown = model.get('isShown');

      assert.equal(isShown, false);
  });

  test('it has a duration by default', (assert) => {
      assert.ok(model.get('duration'));
  });

  test('it is permanent when duration is negative', (assert) => {
      model.set('duration', 1000);

      assert.notOk(model.get('isPermanent'));

      model.set('duration', -1);

      assert.ok(model.get('isPermanent'));
  });
});
