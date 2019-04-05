/* eslint-disable no-magic-numbers, no-useless-call */

import { later, run, begin, end } from '@ember/runloop';

import QUnit from 'qunit';

const getNow = Date.now;
const error = 25;
let delay;
let now;

function mockLater(...values) {
	const length = values.length;
	const diff = getNow() - now;
	let time;

	if (typeof values[length - 1] === 'number') {
		time = values.pop();
	} else {
		time = 50;
	}

	return later.apply(null, [...values, time - diff]);
}

function waitFor(count) {
	const backburner = run.backburner;
	let timers = backburner._timers.slice();
	let debouncees = backburner._debouncees.map(([ctx, fn, time]) => [now + time, fn.bind(ctx)]);

	// Flatten debouncees Array
	debouncees = [].concat(...debouncees);
	// Concat all timers
	// @TODO if needed, add _throttlers to the timers list (do the same as _debouncees)
	timers = [...timers, ...debouncees];

	delay += count;

	const timestamp = now + delay;

	for (let i = 0; i < timers.length; i += 2) {
		const timer = timers[i];
		const fn = timers[i + 1];

		// console.log(count, timer - (timestamp + error));
		if (timer <= (timestamp + error)) {
			// console.log('run');
			fn.apply();
			backburner.cancel(fn);
		}
	}
}

function waitForNext() {
	const backburner = run.backburner;

	if (backburner._timers.length !== 0) {
		let nextTimer;
		let nextFn;

		for (let i = 0; i < backburner._timers.length; i += 2) {
			const timer = backburner._timers[i];
			const fn = backburner._timers[i + 1];

			if (!nextTimer || timer < nextTimer) {
				nextTimer = timer;
				nextFn = fn;
			}
		}

		nextFn.apply();
		backburner.cancel(nextFn);
		delay = nextTimer - now;
	}
}

QUnit.moduleStart(() =>
	run.cancelTimers()
);

QUnit.testStart(() => {
	now = getNow();
	delay = 0;
	later = mockLater;
});

QUnit.testDone(() => {
	later = later;
});

/**
 * Wait for a run later event on ember backburner.
 *
 * @method wait
 * @param  {Number} count
 * @for Core.Testing
 */
export default function wait(count) {
	begin();

	if (count) {
		waitFor(count);
	} else {
		waitForNext();
	}

	end();
}
