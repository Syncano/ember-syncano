import Syncano from 'ember-syncano/services/syncano';
import ENV from '../config/environment';

export default Syncano.extend({
  config: ENV.syncano
});
