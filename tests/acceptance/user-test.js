import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | person', {
  beforeEach() {
    server.createList('person', 1);
    visit('/');
  }
});

test('visiting / retrieves all person records', function(assert) {
  andThen(function() {
    assert.equal(find('li').length, 1, 'All records are retrieved');
  });
});

test('visiting /person/:person_id retrieves one person record', function(assert) {
  let personData = { 'firstName': 'Zach' , 'lastName': 'Garwood', 'age': 32 };
  let person = server.create('person', personData); 
  visit('person/' + person.id);
  andThen(function() {
    for (var property in personData) {
      assert.equal(find('#' + property).val(), personData[property]);
    }
  });
}); 

test('deleting a record removes it from the list', function(assert) {
  andThen(function() {
    click('button.delete:first');
  });
  andThen(function() {
    assert.equal(
      find('li').length,
      0,
      'One less than the original number of records are retrieved'
    );
  });
});

/* Axios, the HTTP client library Syncano-JS uses, doesn't play nice with
 * Mirage, as they both attempt to hijack the HXR requests, making it difficult
 * to accurately test the create and update functionality. So, the following
 * tests are a bit circuitous and not the most solid of tests.
 */
test('creating a record adds it to the list', function(assert) {
  andThen(function() {
    click('button.create');
  });
  visit('/');
  andThen(function() {
    assert.equal(
      find('li').length,
      2,
      'One more than the original number of records are retrieved'
    );
  });
});

test('updating a record persists changes', function(assert) {
  visit('person/1');
  fillIn('#firstName', 'Zachary');
  fillIn('#lastName', 'Garwood');
  visit('/');
  andThen(function() {
    assert.equal(
      find('li:first>a').text(), 'Garwood, Zachary',
      'The record is updated'
    );
  });
});
