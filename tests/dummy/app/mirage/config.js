import ENV from '../config/environment';
import { faker } from 'ember-cli-mirage';

export default function() {
  this.urlPrefix = 'https://api.syncano.io';

  /* Endpoints for data objects */
  this.namespace = '/v1/instances/' + ENV.syncano.instance + '/classes';

  this.get('/person/objects', function(db) {
    return { 'objects': db.people };
  });

  this.get('/person/objects/:id', function(db, request) {
    return db.people.find(request.params.id);
  });

  this.post('/person/objects', function(db, request) {
    return db.people.insert(request.requestBody);
  });

  this.patch('/person/objects/:id', function(db, request) {
    return db.people.update(request.params.id, {});
  });

  this.delete('/person/objects/:id', function(db, request) {
    db.people.remove(request.params.id);
    return {};
  });

  /* Endpoints for codeboxes and traces */
  this.namespace = '/v1/instances/' + ENV.syncano.instance + '/codeboxes';

  this.post('/:codeboxId/run', function(db, request) {
    let payload = JSON.parse(request.requestBody).payload;
    return db.traces.insert({
      'status': 'processing',
      'result': { stdout: `${payload.lastName}, ${payload.firstName}` },
    });
  });

  this.get('/:codeboxId/traces/:traceId', function(db, request) {
    if (ENV.environment === 'test' || faker.random.boolean()) {
      return db.traces.update(request.params.traceId, { 'status': 'success' });
    }
    return db.traces.find(request.params.traceId);
  });
}
