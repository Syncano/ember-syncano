import Ember from 'ember';

export default Ember.Component.extend({
  syncano: Ember.inject.service(),

  tagName: 'span',
       
  didReceiveAttrs() {
    this._super(...arguments);
    let component = this;
    component.get('syncano').codebox(1).result({
      'firstName': component.get('person.firstName'),
      'lastName': component.get('person.lastName'),
    }).then(function(fullName) {
      if (!component.isDestroyed) {
        component.set('fullName', fullName);
      }
    });
  }
});
