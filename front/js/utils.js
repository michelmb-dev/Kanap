



/**
 * It fetches a URL and returns the JSON response
 * @param url - The URL to fetch from.
 * @param method - The HTTP method to use, such as GET, POST, PUT, DELETE, etc.
 * @returns The response from the API call.
 */
export const fetchApi = async (url, method) => {
	const response = await fetch(url, { method: method });
	if (!response.ok) {
		throw new Error("Fetch server on " + url + " Status: " + response.status + " " + response.statusText);
	}
	return await response.json();
};


/**
 * It takes an element name, an object of attributes, and an array of children, and returns a DOM element
 * @param element - The element to create.
 * @param attributes - an object containing the attributes to be added to the element
 * @param children - An array of child elements.
 * @returns A function that takes in an element, attributes, and children.
 */
export const createElementFactory = (element, attributes, ...children) => {
	const el = document.createElement(element);

	for (let attributesKey in attributes) {
		el.setAttribute(attributesKey, attributes[attributesKey]);
	}

	children.forEach((child) => {
		if (typeof child === "string") {
			el.appendChild(document.createTextNode(child));
		} else {
			el.appendChild(child);
		}
	});

	return el;
};
