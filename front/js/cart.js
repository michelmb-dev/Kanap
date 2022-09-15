import {createElementFactory, fetchApi, generateShowError} from "./utils.js";

const cartItems = document.querySelector("#cart__items");
const totalQuantity = document.querySelector("#totalQuantity");
const totalPrice = document.querySelector("#totalPrice");

/* Fetching the products from the database. */
const productsApi = await fetchApi("http://localhost:3000/api/products/","GET");

/* Getting the cart from localStorage and parsing it into an array. */
const productsInStore = JSON.parse(localStorage.getItem("cart") || "[]");


/* Creating an empty array to store the filtered products. */
let filteredProducts = [];

/* Filtering through the products in the cart and the products in the database and matching them up. */
productsInStore.forEach((productInStore) => {
	productsApi.forEach((productApi) => {
			if(productInStore._id === productApi._id) {
				filteredProducts.push({
					"_id": productInStore._id,
					"name": productApi.name,
					"imageUrl": productApi.imageUrl,
					"altTxt": productApi.altTxt,
					"price": productApi.price,
					"color": productInStore.color,
					"quantity": productInStore.quantity
				});
			}
	});
});

/**
 * It's creating a cart item for each product in the filteredProducts array
 */
const generateCartItems = () => {
	if (filteredProducts.length === 0) {
			generateShowError(cartItems, "Votre panier et vide.")
	} else {
		for (let i = 0; i < filteredProducts.length; i++) {

			/* It's creating a div with a class of cart__item__img and an img inside it. */
			const cartItemImg = createElementFactory('div', {"class": "cart__item__img"}, createElementFactory('img', {"src": filteredProducts[i].imageUrl, "alt": filteredProducts[i].altTxt}))

			/* It's creating a div with a class of cart__item__content__description and a h2 and two p elements inside it. */
			const cartItemDescription = createElementFactory('div', {"class": "cart__item__content__description"}, createElementFactory('h2', {}, filteredProducts[i].name), createElementFactory('p',{}, filteredProducts[i].color), createElementFactory('p',{}, filteredProducts[i].price + " €"))

			/* It's creating a div with a class of cart__item__content__settings__quantity and a p and an input element inside it. */
			const cartItemSettingQuantity = createElementFactory('div', {"class": "cart__item__content__settings__quantity"}, createElementFactory('p', {}, "Qté : "), createElementFactory('input', {"type": "number", "class": "itemQuantity", "name": "itemQuantity", "min": "1", "max": "100", "value": filteredProducts[i].quantity}));

			/* It's creating a div with a class of cart__item__content__settings__delete and a p element inside it. */
			const cartItemSettingDelete = createElementFactory('div', {"class": "cart__item__content__settings__delete"}, createElementFactory('p', {"class": "deleteItem"}, "Supprimer"))

			/* It's creating a div with a class of cart__item__content__settings and a p and an input element inside it. */
			const cartItemSetting = createElementFactory('div', {"class": "cart__item__content__settings"}, cartItemSettingQuantity, cartItemSettingDelete);

			/* It's creating a div with a class of cart__item__content and a p and an input element inside it. */
			const cartItemContent = createElementFactory('div', {"class":"cart__item__content"}, cartItemDescription, cartItemSetting);

			/* It's creating an article element */
			const article = createElementFactory('article', {"class": "cart__item", "data-id": filteredProducts[i]._id, "data-color": filteredProducts[i].color}, cartItemImg, cartItemContent);

			/* It's appending the article element to the cartItems element. */
			cartItems.appendChild(article);
		}
	}

	/* It's setting the innerHTML of the totalQuantity element to the value of the calculateTotalQuantity function. */
	totalQuantity.innerHTML = calculateTotalQuantity();
	totalPrice.innerHTML = calculateTotalPrice();
};

/**
 * It loops through the filteredProducts array, and adds the quantity of each product to a sum variable
 * @returns The total quantity of all the products in the filteredProducts array.
 */
const calculateTotalQuantity = () => {
	let sum = 0;
	for(let i = 0; i < filteredProducts.length ; i++) {
		sum += Number(filteredProducts[i].quantity);
	}
	return sum.toString();
}

/**
 * It loops through the filteredProducts array, and adds the price of each product to the sum variable
 * @returns The total price of all the products in the filteredProducts array.
 */
const calculateTotalPrice = () => {
	let sum = 0;
	for(let i = 0; i < filteredProducts.length ; i++) {
		sum += (Number(filteredProducts[i].price) * Number(filteredProducts[i].quantity));
	}
	return sum.toString();
}


/* It's creating a cart item for each product in the filteredProducts array */
generateCartItems();


