import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string', { defaultValue: '' }),
  lastName: DS.attr('string', { defaultValue: '' }),
  age: DS.attr('number', { defaultValue: 0 }),
});
