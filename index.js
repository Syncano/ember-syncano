/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-syncano',
  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/syncano/dist/syncano.min.js');
  }
};
