import Ember from 'ember';
import SyncanoAdapter from 'ember-syncano/adapters/syncano';

export default SyncanoAdapter.extend({
  syncano: Ember.inject.service()
});
