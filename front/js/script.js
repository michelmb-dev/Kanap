import {createElementFactory, fetchApi, generateShowError} from "./utils.js";


/* Selecting the element with the id "items" */
const items = document.querySelector("#items");


/* Fetching the products from the API. */
const products = await fetchApi("http://localhost:3000/api/products", {method: 'GET'});


/**
 * It creates an article element with the image, name and description of the product, then it creates a link to the product
 * page and adds the element "item" to the element "items"
 * @param products - the array of products to display.
 */
const generateProducts = (products) => {
	if (!products) {
		generateShowError(items, "Un problème est survenu, veuillez réessayer ultérieurement. Merci de votre compréhension.")
	}else {
		for (let i = 0; i < products.length; i++) {
			/* Creating an image element with the source and alt text from the products array. */
			const image = createElementFactory("img", {
				"src": products[i].imageUrl,
				"alt": products[i].altTxt,
			});

			/* Creating a h3 element with the class productName and the name of the product. */
			const name = createElementFactory(
				"h3",
				{ "class": "productName" },
				products[i].name
			);

			/* Creating a paragraph element with the class productDescription and the description of the product. */
			const description = createElementFactory(
				"p",
				{
					"class": "productDescription",
				},
				products[i].description
			);

			/* Creating an article element with the image, name and description of the product. */
			const article = createElementFactory(
				"article",
				{},
				image,
				name,
				description
			);

			/* Creating a link to the product page. */
			const item = createElementFactory(
				"a",
				{ "href": `./product.html?id=${products[i]._id}` },
				article
			);

			/* It adds the element "item" to the element "items". */
			items.appendChild(item);
		}
	}
};


/* Calling the function generateProducts with the argument products. */
generateProducts(products);
