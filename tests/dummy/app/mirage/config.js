import ENV from '../config/environment';

export default function() {

  this.urlPrefix = 'https://api.syncano.io';
  this.namespace = '/v1/instances/' + ENV.syncano.instance + '/classes';

  this.get('/person/objects', function(db) {
    return { 'objects': db.people };
  });

  this.get('/person/objects/:id', function(db, request) {
    return db.people.find(request.params.id);
  });

  this.post('/person/objects', function(db, request) {
    console.log(request.requestBody);
    let thing = db.people.insert(request.requestBody);
    console.log(thing);
    return thing;
  });

  this.patch('/person/objects/:id', function(db, request) {
    console.log(request);
    return db.people.update(request.params.id, {});
  });

  this.delete('/person/objects/:id', function(db, request) {
    db.people.remove(request.params.id);
    return {};
  });
}
