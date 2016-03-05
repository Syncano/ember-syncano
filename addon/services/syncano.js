import Ember from 'ember';

export default {
  config: null,
  account: null,
  instance: null,
  create() {
    this.account = new Syncano({ accountKey: this.config.accountKey });
    this.instance = new Syncano({ apiKey: this.config.apiKey, instance: this.config.instance });
    return this;
  },
  isServiceFactory: true,
};
