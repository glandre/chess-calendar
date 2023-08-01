import crawlers from './crawlers';
import { eventToString } from './models/event';

(async function main() {
	for(const crawler of crawlers) {
		console.log(`Searching events on ${crawler.name}...\n(${crawler.url})\n`);

		const events = await crawler.crawl();
		// insert events in a calendar file
		console.log(`${events.length} event(s) found:\n`);
		events.forEach(ev => {
			console.log('######');
			console.log(eventToString(ev));
			console.log( '######\n\n');
		});

		// TODO
		// save the events
	}
})();
