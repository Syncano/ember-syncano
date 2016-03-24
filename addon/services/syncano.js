import Ember from 'ember';

export default Ember.Service.extend({
  isServiceFactory: true,
  account: null,
  instance: null,
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
  codebox(codeboxId) {
    let codebox = this.get('account')
      .instance(this.get('config.instance'))
      .codebox(codeboxId);
    codebox.result = this._kickoffCodebox;
    codebox._getResult = this._getCodeboxResult;
    return codebox;
  },
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
