


/**
 * It returns a promise that resolves to a JSON object
 * @param url - The URL to fetch.
 * @param options - This is an object that contains the request method, headers, and body.
 * @returns A promise that will resolve to a JSON object.
 */
export const fetchApi = (url, options) => {
	return new Promise((res, rej) => {
		fetch(url, options)
			.then(response => {
				if (response.ok) {
					res(response.json());
				}
			}).catch(error => rej(error));
	}).catch(error => console.error(error));
};

/**
 * It takes a parent element and a message, creates an h3 element with the message, and appends it to the parent element
 * @param parentElement - The element that the error message will be appended to.
 * @param message - The message to display
 * @returns A function that takes in a parentElement and a message and returns the parentElement with the message appended
 * to it.
 */
export const generateShowError = (parentElement, message) =>	{
	const el = createElementFactory('h3', {"style": "text-align: center; max-width: 420px; margin: 20px auto"}, message)
	return parentElement.appendChild(el);
}

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
