import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('person');
  },
  actions: {
    create() {
      let route = this;
      let person = this.store.createRecord('person');
      person.save().then(function(person) {
        route.transitionTo('person', person); 
      });
    },
    delete(person) {
      person.destroyRecord();
    },
  },
});
