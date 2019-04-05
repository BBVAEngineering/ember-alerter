'use strict';

module.exports = {
	extends: 'recommended',
	rules: {
		'block-indentation': 'tab',
		'deprecated-each-syntax': true,
		'deprecated-inline-view-helper': true,
		'img-alt-attributes': true,
		'inline-link-to': true,
		'link-rel-noopener': true,
		'no-bare-strings': true,
		'no-html-comments': true,
		'no-inline-styles': true,
		'no-invalid-interactive': true,
		'no-nested-interactive': true,
		'no-triple-curlies': true,
		'no-unused-block-params': true,
		'self-closing-void-elements': true,
		'simple-unless': false,
		'style-concatenation': true
	},
	ignore: [
		'tests/dummy/app/**'
	]
};
