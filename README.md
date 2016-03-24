# Ember-Syncano

An Ember CLI addon for seemlessly interacting with [Syncano](https://www.syncano.io/).

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Installation

`ember install ember-syncano`

## Configuration

Add your credentials to your app's `config/environment.js`:
```javascript
syncano: {
  accountKey: 'your-account-key',
  apiKey: 'your-api-key',
  instance: 'your-instance-name'
},
```

## Usage

Create models based on your Syncano Classes, then use Ember Data's store
like you normally would!

To use a Codebox, first inject the service into your route/component:
`syncano: Ember.inject.service(),`

Then call the `result()` method to get a Promise of the Codebox's result:
```javascript
let codeboxId = 123;
let payload = { key_one: 'value_one', key_two: 'value_two' };
this.get('syncano')
    .codebox(codeboxId)
    .result(payload)
    .then(function(result) {
        doSomething(result);
    });
```

## Development

### Get the code

* `git clone` this repository
* `npm install`
* `bower install`

### Run the dummy app

* `ember server`
* Visit your app at http://localhost:4200.

## Run the tests

To test against the current version of Ember:
`ember test`

To test multiple versions of Ember:
`npm test`

(PhantomJS is commented out because it seems to fail tests due to some issue
with Promise.)

## Building

* `ember build`
