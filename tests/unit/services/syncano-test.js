import { moduleFor, test } from 'ember-qunit';

moduleFor('service:syncano', 'Unit | Service | syncano', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it contains an account and an instance object', function(assert) {
  let service = this.subject();
  assert.ok(
    service.hasOwnProperty('account'),
    "The Syncano service has an `account` property"
  );
  assert.ok(
    service.hasOwnProperty('instance'),
    "The Syncano service has an `instance` property"
  );
});

test('it contains a codebox factory method', function(assert) {
  let service = this.subject();
  assert.ok(
    typeof service.codebox === 'function',
    "The Syncano service has an `codebox` method"
  );
});
