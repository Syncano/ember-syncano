import Ember from 'ember';

export default Ember.Service.extend({

  //TODO login



  /**
   * Must be set to `true` for services.
   */
  isServiceFactory: true,

  /**
   * A Syncano account sub-service, used by `codebox()`.
   */
  account: null,

  /**
   * A Syncano instance sub-service, used by the Syncano adapter to interact
   * with the data store.
   */
  instance: null,

  /**
   * Initializer.
   * create the i
   */
  init(){


    //the config is obtained from the environment
    const api_key = this.get('config.apiKey');
    const account_key = this.get('config.accountKey');
    const instance = this.get('config.instance');

    //for some reason the Syncano class is not really the connection
    // create new syncano instance, and get the connection from it
    var connection = new Syncano({
    }).connection;

    //then configure it
    connection.accountKey = account_key;
    connection.apiKey = api_key;

    //bind the connection to the service
    this.connection = connection;

    //set the instance name
    this.instance = instance




  },

  //TODO TEST Scripts
  /**
   * OUTDATED??: CODEBOX IS NOW SCRIPT
   *
   * Used to run arbitrary code in a Syncano Codebox. It's a thin wrapper
   * around the `codebox()` method in the Syncano docs, the difference being
   * that it automatically uses the instance specified in the config
   * (`ENV.syncano.instance`). Additionally, it has a convenience method
   * `result()` that runs both `run()` and `trace()` until it gets a successful
   * result from Syncano.
   *
   * Usage:
   *  syncano: Ember.inject.service(),
   *  someMethod() {
   *    let syncano = this.get('syncano');
   *    let codeboxId = 123;
   *    let payload = { key_one: 'value one', key_two: 'value_two' };
   *
   *    syncano.codebox(codeboxId).result(payload).then(function(result) {
   *      doSomething(result);
   *    });
   *  },
   */
  codebox(codeboxId) {

    const instance_name = this.get('instance');

    let codebox = this.connection
      .instance(instance_name)
      .codebox(codeboxId);
    codebox.result = this._kickoffCodebox;
    codebox._getResult = this._getCodeboxResult;
    return codebox;
  },

  /**
   * A wrapper method around `codebox().run()`.
   */
  _kickoffCodebox(payload) {
    let codebox = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      codebox.run({ 'payload': payload })
        .then(function(data) {
          codebox._getResult(data.id).then(function(stdout) {
            Ember.run(null, resolve, stdout);
          });
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },

  /**
   * A wrapper method around `codebox().trace()`. If it doesn't get a
   * `success` response from the `trace()` call, then it schedules
   * another attempt in 200ms.
   */
  _getCodeboxResult(id) {
    let codebox = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      codebox.trace(id)
        .then(function(data) {
          switch (data.status) {
            case 'success':
              Ember.run(null, resolve, data.result.stdout);
              break;
            case 'processing':
              Ember.run.later(codebox, function() {
                this._getResult(id).then(resolve, reject);
              }, 200);
              break;
            default:
              Ember.run(null, reject, data);
          }
        })
        .catch(function(error) {
          Ember.run(null, reject, error);
        });
    });
  },
});
