my-addon
==============================================================================

An [ember-cli addon](http://www.ember-cli.com/) for manage Alerts in Ember applications.


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


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
