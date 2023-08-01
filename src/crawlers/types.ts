import { Event } from '../models/event';

export interface Crawler {
	name: string;
	url: string;
	crawl: () => Promise<Event[]>;
}
