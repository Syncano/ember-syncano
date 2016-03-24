import Ember from 'ember';

export default Ember.Service.extend({
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
   * Set the `account` and `instance` properties on initialization.
   */
  init() {
    this.set(
      'account',
      new Syncano({ accountKey: this.get('config.accountKey') })
    );
    this.set(
      'instance',
      new Syncano({
        apiKey: this.get('config.apiKey'),
        instance: this.get('config.instance')
      })
    );
  },

  /**
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
    let codebox = this.get('account')
      .instance(this.get('config.instance'))
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
