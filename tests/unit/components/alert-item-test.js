/* eslint-disable no-magic-numbers */
import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import wait from 'dummy/tests/helpers/wait';

let component, model;

module('Unit | Component | alert-item', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
      model = EmberObject.create({
          isShown: false
      });

      component = this.owner.factoryFor('component:alert-item').create({
          alerter: { clear: sinon.spy() },
          model
      });
  });

  test('it is not shown and is deleted when it is shown, it is not permanent and its duration expires', (assert) => {
      run(component, 'set', 'model.isShown', true);

      wait(4000);

      assert.equal(component.get('model.isShown'), false);

      wait(500);

      assert.ok(component.get('alerter').clear.calledWith(component.get('model')));
  });

  test('it is shown when it is shown, it is permanent and its duration expires', (assert) => {
      run(component, 'set', 'model.isPermanent', true);
      run(component, 'set', 'model.isShown', true);

      wait(4000);

      assert.equal(component.get('model.isShown'), true);
  });

  test('it does not break when it is shown and is destroyed', (assert) => {
      assert.expect(0);

      run(component, 'set', 'model.isShown', true);
      run(component, 'destroy');

      wait(4000);
  });

  test('it does not break when it not is shown and is destroyed', (assert) => {
      assert.expect(0);

      run(component, 'set', 'model.isShown', true);

      wait(4000);

      run(component, 'destroy');

      wait(500);
  });

  test('it disables visibility of the alert when clicked', (assert) => {
      run(component, 'set', 'model.isShown', true);

      component.click();

      assert.equal(component.get('model.isShown'), false);

      component.click();

      assert.equal(component.get('model.isShown'), false);
  });

  test('it enables visibility of the alert when is rendered', function(assert) {
      this.render();

      assert.equal(component.get('model.isShown'), false);

      wait(500);

      assert.equal(component.get('model.isShown'), true);
  });

  test('it does not enable visibility when it has no model', (assert) => {
      assert.expect(0);

      run(component, 'set', 'model', null);

      run(component, 'appendTo', '#ember-testing');
  });
});
