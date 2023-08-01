export interface Event {
	title: string;
	description: string;
	originalDate: string;
	parsedDate: Date;
}

export const eventToString = (e: Event) => `${e.title}\nDates: ${e.originalDate}\nDescription:\n${e.description}`;

export function isValidEvent(e: Event | Partial<Event> | null | undefined): e is Event {
	if (e === null || e === undefined) {
		return false;
	}

	const hasTitle = (e.title?.length ?? 0) > 0;
	const hasDate = (e.originalDate?.length ?? 0) > 0;
	const hasDescription = (e.description?.length ?? 0) > 0;

	return Boolean(hasTitle && hasDate && hasDescription);
}
