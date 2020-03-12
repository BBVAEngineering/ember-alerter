# ember-alerter

[![Build Status](https://travis-ci.org/BBVAEngineering/ember-alerter.svg?branch=master)](https://travis-ci.org/BBVAEngineering/ember-alerter)
[![GitHub version](https://badge.fury.io/gh/BBVAEngineering%2Fember-alerter.svg)](https://badge.fury.io/gh/BBVAEngineering%2Fember-alerter)
[![NPM version](https://badge.fury.io/js/ember-alerter.svg)](https://badge.fury.io/js/ember-alerter)
[![Dependency Status](https://david-dm.org/BBVAEngineering/ember-alerter.svg)](https://david-dm.org/BBVAEngineering/ember-alerter)
[![codecov](https://codecov.io/gh/BBVAEngineering/ember-alerter/branch/master/graph/badge.svg)](https://codecov.io/gh/BBVAEngineering/ember-alerter)
[![Greenkeeper badge](https://badges.greenkeeper.io/BBVAEngineering/ember-alerter.svg)](https://greenkeeper.io/)
[![Ember Observer Score](https://emberobserver.com/badges/ember-alerter.svg)](https://emberobserver.com/addons/ember-alerter)

## Information

[![NPM](https://nodei.co/npm/ember-alerter.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ember-alerter/)

An [ember-cli addon](http://www.ember-cli.com/) for manage Alerts in Ember applications.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-alerter
```


Usage
------------------------------------------------------------------------------

```js
alerter: service(),

...

this.get('alerter').add({
  description: 'My message',
  title: 'Ooops!'
  duration: 6000
});
```

```hbs
{{#alert-container as |alert|}}
  <p>{{alert.title}}</p>

  <div>{{alert.description}}</div>
{{/alert-container}}
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
