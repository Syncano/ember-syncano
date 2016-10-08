import DS from 'ember-data';
import Ember from 'ember';

export default DS.Adapter.extend({
  /**
   * Uses the default serialize (JSONSerializer).
   */
  defaultSerializer: '-default',

  /**
   * Used by the store to retrieve a single record.
   */
  findRecord(store, type, id) {
    let connection = this.get('syncano.connection');
    let instanceName = this.get('syncano.instance')
    return new Ember.RSVP.Promise(function(resolve, reject) {
      connection.DataObject.please().get({id: id, className: type.modelName, instanceName: instanceName})
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to create a record.
   */
  createRecord(store, type, snapshot) {
    let connection = this.get('syncano.connection');
    let record = this.serialize(snapshot, { includeId: true });
    record.instanceName = this.get('syncano.instance');
    record.className = type.modelName;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      connection.DataObject.please().create(record)
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to update a record.
   */
  updateRecord(store, type, snapshot) {
    let connection = this.get('syncano.connection');
    let record = this.serialize(snapshot, { includeId: true });
    let instanceName = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      connection.DataObject.please().update({id: record.id, className: type.modelName, instanceName: instanceName}, record)
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to delete a record.
   */
  deleteRecord(store, type, snapshot) {
    let connection = this.get('syncano.connection');
    let record = this.serialize(snapshot, { includeId: true });
    let instanceName = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      connection.DataObject.please().delete({id: record.id, className: type.modelName, instanceName: instanceName})
        .then(function() {
          Ember.run(null, resolve);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to retrieve the entire collection of records of a
   * certain model.
   */
  findAll(store, type) {
    let instanceName = this.get('syncano.instance');
    let connection = this.get('syncano.connection');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      connection.DataObject.please().list({className: type.modelName, instanceName: instanceName})
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to retrieve a collection of records according to the
   * filters in `query`. `query` should be formatted exactly as a query obeject
   * as shown in the Syncano docs.
   */
  query(store, type, query) {
    let connection = this.get('syncano.connection');
    let instanceName = this.get('syncano.instance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      connection.DataObject.please().list({className: type.modelName, instanceName: instanceName}).filter(query)
        .then(function(data) {
          Ember.run(null, resolve, data);
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * Used by the store to retrieve a collection that is a subset of records of
   * based on their ids. It is an optimization for retrieving large sets of
   * records.
   */
  findMany(store, type, ids) {
    return this.query(store, type, { 'id': { '_in': ids }});
  },
});
