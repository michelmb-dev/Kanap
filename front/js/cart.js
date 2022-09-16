import {createElementFactory, fetchApi, generateShowError} from "./utils.js";


/* It's selecting the elements that will be used in the script. */
const cartItems = document.querySelector("#cart__items");
const totalQuantity = document.querySelector("#totalQuantity");
const totalPrice = document.querySelector("#totalPrice");


/* Fetching the products from the database. */
const productsApi = await fetchApi("http://localhost:3000/api/products/","GET");


/* Getting the cart from localStorage and parsing it into an array. */
let productsInStore = JSON.parse(localStorage.getItem("cart") || "[]");


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
const generateProductsToCart = () => {

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


/**
 * It's deleting the product from the cart.
 */
const deleteProductToCart = () => {

	/* It's selecting all the elements with a class of deleteItem. */
	const deleteButton = document.querySelectorAll(".deleteItem");

	/* It's looping through the filteredProducts array. */
	for (let i = 0; i < filteredProducts.length; i++) {

		deleteButton[i].addEventListener('click',  (e) => {

			/* It's asking the user if he wants to delete the product. */
			if(!confirm('Voulez-vous vraiment supprimer cet article ?')){
				return;
			}
			/* It's filtering through the productsInStore array and removing the product that has the same id and color as the
			product that was clicked. */
			let updateProductInStore = productsInStore.filter(product => product._id !== productsInStore[i]._id || product.color !== productsInStore[i].color);

			/* Update the cart in localStorage to the productsInStore array. */
			localStorage.setItem("cart", JSON.stringify(updateProductInStore));

			/* It's removing the price and quantity of the product that was deleted from the total price and quantity. */
			totalPrice.innerHTML -= Number(filteredProducts[i].price * filteredProducts[i].quantity) .toString();
			totalQuantity.innerHTML -= Number(filteredProducts[i].quantity).toString();

			/* It's removing the product from the cart. */
			cartItems.children[i].remove();

			/* It's updating the productsInStore array with the new cart. */
			productsInStore = JSON.parse(localStorage.getItem('cart') || "[]");

			/* It's checking if the cart is empty, and if it is, it's displaying a message to the user. */
			if(productsInStore.length === 0) {
				generateShowError(cartItems, "Votre panier est vide.")
			}

		});
	}
};


/**
 * It adds an event listener to each input field in the cart, and when the value of the input field changes, it updates the
 * quantity of the product in the cart
 */
const changeProductQuantityToCart = () => {
	const inputQuantity = document.querySelectorAll(".itemQuantity");
	for (let i = 0; i < filteredProducts.length; i++) {
		inputQuantity[i].addEventListener('change', (e) => {
			if (e.target.value < 1 || e.target.value > 100) {
				alert('Veuillez saisir une quantité entre 1 et 100.');
				return;
			}
			filteredProducts[i].quantity = e.target.value;
			localStorage.setItem("cart", JSON.stringify(filteredProducts));
			totalQuantity.innerHTML = calculateTotalQuantity();
			totalPrice.innerHTML = calculateTotalPrice();
		});
	}
};


/* It's creating a cart item for each product in the filteredProducts array. */
generateProductsToCart();

/* It's changing the quantity of the product in the cart. */
changeProductQuantityToCart();

/* It's deleting a product from the cart. */
deleteProductToCart();
