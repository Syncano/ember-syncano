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
});
