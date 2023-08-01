//
// Sync chess events
//
import fetch from 'node-fetch';
import jsdom from 'jsdom';
import * as chrono from 'chrono-node';
import { Event, isValidEvent } from '../models/event';
import { Crawler } from './types';

const URL = 'https://www.chess.bc.ca/events.php'

export const crawler: Crawler = {
	name: 'BC Chess Federation Events Page',
	url: URL,
	async crawl() {
		const events: Event[] = [];

		// download chess.bc events page
		const response = await fetch(URL);

		// parse events: load JSDOM and query the expected elements
		const dom = new jsdom.JSDOM(await response.text());

		

		const paragraphs = dom.window.document.querySelectorAll('#bodyTextStuff > p');

		paragraphs.forEach(p => {
			const event = convertParagraphToEvent(p);
			if (!event) {
				console.error('\n\nParse error on: ' + p.textContent)
			} else {
				events.push(event)
			}
		});

		return events;
	}
}

function convertParagraphToEvent(paragraph: Node): Event | null {
	const event: Partial<Event> = {};

	const fragments = paragraph.textContent?.split('\n') || [];

	if (fragments.length < 2) {
		return null;
	}

	event.title = fragments.shift();
	event.description = fragments.join('\n');
	event.originalDate = findOriginalDate(paragraph);
	event.parsedDate = chrono.parseDate(event.originalDate || '');

	if (!isValidEvent(event)) {
		return null;
	}

	return event;
}

function findOriginalDate(paragraph: Node): string | undefined {
	const fragments = paragraph.textContent?.split('\n') || [];

	for (const f of fragments) {

	    if (f.trim().toLowerCase().startsWith('date')) {
	        const index = f.toLowerCase().indexOf(':')
	        return f.substring(index + 1).trim();
	    }

	}

	return undefined;
}