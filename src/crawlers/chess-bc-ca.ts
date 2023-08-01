//
// Sync chess events
//
import fetch from 'node-fetch';
import jsdom from 'jsdom';
import * as chrono from 'chrono-node';
import { Event, eventToString, isValidEvent } from '../models/event';

const URL = 'https://www.chess.bc.ca/events.php'

export async function crawl() {
	// download chess.bc events page
	const response = await fetch(URL);

	// parse events: load JSDOM and query the expected elements
	const dom = new jsdom.JSDOM(await response.text());

	const events: Event[] = [];
	// After "Tournament and Events"
	// find each <p> until the end
	const paragraphs = dom.window.document.querySelectorAll('#bodyTextStuff > p');

	paragraphs.forEach(p => {
		const event = convertParagraphToEvent(p);
		if (!event) {
			console.error('\n\nParse error on: ' + p.textContent)
		} else {
			events.push(event)
		}
	});

	// insert events in a calendar file
	console.log(`>>> ${events.length} event(s) found:`);
	events.forEach(ev => {
		console.log('######');
		console.log(eventToString(ev))
		console.log('Parsed Date: ' + ev.parsedDate);
		console.log( '######\n\n');
	});

	// publish calendar
	// TODO
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