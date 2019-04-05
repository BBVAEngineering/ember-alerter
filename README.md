# ember-alerter

An [ember-cli addon](http://www.ember-cli.com/) for manage Alerts in Ember applications.

## Install in ember-cli application

In your application's directory:

    ember install ember-alerter

## Usage

```js
alerter: Ember.inject.service(),

...

this.get('alerter').add({
  description: 'My message',
  type: 'warning' // Alert type (optional, default: 'error')
  duration: 6000 // Milliseconds (optional, default 4000)
});
```

```hbs
{{#alert-container as |alert|}}
  <p>{{alert.title}}</p>

  <div>{{alert.description}}</div>
{{/alert-container}}
```

## Contribute

If you want to contribute to this addon, please read the [CONTRIBUTING.md](CONTRIBUTING.md).
