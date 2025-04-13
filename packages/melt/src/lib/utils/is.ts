import { SvelteSet } from "svelte/reactivity";

export function isHtmlElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isElement(element: unknown): element is Element {
	return element instanceof Element;
}

export function isNode(element: unknown): element is Node {
	return element instanceof Node;
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isGetter(value: unknown): value is () => unknown {
	return isFunction(value) && value.length === 0;
}

export function isSvelteSet(value: unknown): value is SvelteSet<unknown> {
	return value instanceof SvelteSet;
}

export function isIterable(value: unknown): value is Iterable<unknown> {
	return value !== null && typeof value === "object" && Symbol.iterator in value;
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return value !== null && typeof value === "object";
}

export function isHtmlInputElement(element: unknown): element is HTMLInputElement {
	return element instanceof HTMLInputElement;
}

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isTouch(event: PointerEvent): boolean {
	return event.pointerType === "touch";
}
