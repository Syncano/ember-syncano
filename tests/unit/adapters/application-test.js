import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:application', 'Unit | Adapter | application', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

// Replace this with your real tests.
test('`defaultSerializer` set to "-default"', function(assert) {
  let adapter = this.subject();
  assert.equal('-default', adapter.defaultSerializer);
});

test('CRUD methods defined', function(assert) {
  let adapter = this.subject();
  let methods = ['createRecord', 'findRecord', 'updateRecord', 'deleteRecord'];
  assert.expect(4);
  methods.forEach(function(method) {
    assert.ok(
      typeof adapter[method] === 'function',
      `"The Syncano adapter has the ${method} property`
    );
  });
});

test('query methods defined', function(assert) {
  let adapter = this.subject();
  let methods = ['findMany', 'query'];
  assert.expect(2);
  methods.forEach(function(method) {
    assert.ok(
      typeof adapter[method] === 'function',
      `"The Syncano adapter has the ${method} property`
    );
  });
});
