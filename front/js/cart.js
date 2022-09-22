import {createElementFactory, fetchApi, generateShowError} from "./utils.js";


/* It's selecting the elements that will be used in the script. */
const cartItems = document.querySelector("#cart__items");
const totalQuantity = document.querySelector("#totalQuantity");
const totalPrice = document.querySelector("#totalPrice");
const submitFormBtn = document.getElementById('order');

/* It's selecting the input field and the error message for the first name. */
const firstNameInput = document.getElementById('firstName');
const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');

/* It's selecting the input field and the error message for the last name. */
const lastNameInput = document.getElementById('lastName');
const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');

/* It's selecting the input field and the error message for the address. */
const addressFormInput = document.getElementById('address');
const addressFormErrorMsg = document.getElementById('addressErrorMsg');

/* It's selecting the input field and the error message for the city. */
const cityFormInput = document.getElementById('city');
const cityFormErrorMsg = document.getElementById('cityErrorMsg');

/* It's selecting the input field and the error message for the email. */
const emailFormInput = document.getElementById('email');
const emailFormErrorMsg = document.getElementById('emailErrorMsg');


/* Fetching the products from the database. */
const productsApi = await fetchApi("http://localhost:3000/api/products/", { method: "GET" });


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

		deleteButton[i].addEventListener('click',  () => {

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

				if(e.target.value < 1){
					e.target.value = 1
				}
				if(e.target.value > 100) {
					e.target.value = 100
				}
				alert('Veuillez saisir une quantité entre 1 et 100.');
			}
			filteredProducts[i].quantity = e.target.value;
			localStorage.setItem("cart", JSON.stringify(filteredProducts));
			totalQuantity.innerHTML = calculateTotalQuantity();
			totalPrice.innerHTML = calculateTotalPrice();
		});
	}
};



/**
 * It's checking if the value of the input elements matches the regular expression
 * @returns The validateOrderForm function is returning the isValid variable.
 */
const validateOrderForm = () => {

	/* It's a regular expression that is used to validate the input fields. */
	const nameRegex = /^[a-zA-Z\s]{3,30}$/;
	const emailRegex = /^(?![._\-])(?!.*\.\.)(?!.*__)(?!.*--)(?!.*\.@)(?!.*-@)(?!.*_@)[\w.-]+@(?![_\-])(?!.*__)(?!.*--)(?!.*_\.)(?!.*-\.)[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/;
	const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
	const cityRegex = /^[A-Za-z\s,-]{5,40}$/;

	let isValid = true;

	/* It's checking if the value of the firstNameInput element matches the nameRegex regular expression. */
	if(!firstNameInput.value.match(nameRegex)) {
		isValid = false;
		firstNameErrorMsg.innerHTML = "Veuillez saisir un nom valide (Entre 3 et 30 caractères).";
	} else {
		firstNameErrorMsg.innerHTML = "";
	}

	/* It's checking if the value of the lastNameInput element matches the nameRegex regular expression. */
	if(!lastNameInput.value.match(nameRegex)) {
		isValid = false;
		lastNameErrorMsg.innerHTML = "Veuillez saisir un nom valide (Entre 3 et 30 caractères).";
	} else {
		lastNameErrorMsg.innerHTML = "";
	}

	/* It's checking if the value of the addressFormInput element matches the addressRegex regular expression. */
	if(!addressFormInput.value.match(addressRegex)) {
		isValid = false;
		addressFormErrorMsg.innerHTML = "Veuillez saisir une adresse valide (ex : 1 av de paris)."
	}else {
		addressFormErrorMsg.innerHTML = "";
	}

	/* It's checking if the value of the cityFormInput element matches the cityRegex regular expression. */
	if(!cityFormInput.value.match(cityRegex)) {
		isValid = false;
		cityFormErrorMsg.innerHTML = "Veuillez saisir le nom d'une ville valide (ex : Paris, Lille ...)."
	}else {
		cityFormErrorMsg.innerHTML = "";
	}

	/* It's checking if the value of the emailFormInput element matches the emailRegex regular expression. */
	if(!emailFormInput.value.match(emailRegex)) {
		isValid = false;
		emailFormErrorMsg.innerHTML = "Veuillez saisir une adresse email valide (ex : example@test.com)."
	} else {
		emailFormInput.innerHTML = "";
	}
	return isValid;
}


/**
 * It prevents the default action of the form submission, and then validates the form. If the form is valid, it will submit
 * the form
 * @param e - the event object
 */
const submitCartOderForm = (e) => {

	/* It's preventing the default action of the form submission. */
	e.preventDefault();

	/* It's checking if the form is valid. */
	if(validateOrderForm()) {

		if(productsInStore.length === 0) {
			return alert('Votre panier est vide, veuillez sélectionner au minimum un produit.');
		}

		let productsId = [];
		for (let i = 0; i < productsInStore.length; i++) {
			productsId.push(productsInStore[i]._id);
		}

		fetchApi('http://localhost:3000/api/products/order',
			{
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contact: {
						firstName: firstNameInput.value,
						lastName: lastNameInput.value,
						address: addressFormInput.value,
						city: cityFormInput.value,
						email: emailFormInput.value.toLowerCase()
					},
					products: productsId,
				})
			})
			.then(data => {
				window.location.href = `../html/confirmation.html?orderId=${data.orderId}`
			});
	}
}


/* It's creating a cart item for each product in the filteredProducts array. */
generateProductsToCart();

/* It's changing the quantity of the product in the cart. */
changeProductQuantityToCart();

/* It's deleting a product from the cart. */
deleteProductToCart();

/* It's adding an event listener to the submitFormBtn element, and when the user clicks on it, it calls the
submitCartOderForm function. */
submitFormBtn.addEventListener('click', e => submitCartOderForm(e));
