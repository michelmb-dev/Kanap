/* It's getting the id of the product from the url. */
import { createElementFactory, fetchApi } from "./utils.js";

/* It's getting the id of the product from the url. */
const productId = new URLSearchParams(window.location.search).get("id");

const productImage = document.querySelector(".item__img");
const productName = document.querySelector("#title");
const productPrice = document.querySelector("#price");
const productDescription = document.querySelector("#description");
const productColors = document.querySelector("#colors");
const quantitySelected = document.querySelector("#quantity");
const submitToCart = document.querySelector("#addToCart");

const product = await fetchApi(
	`http://localhost:3000/api/products/${productId}`,
	"GET"
);

/**
 * We're creating a function that creates an image element, sets the source and alt text, appends the image to the product
 * image div, sets the product name, price, and description, and then creates an option element for each color in the
 * product colors array and appends it to the product colors select element
 */
const generateProduct = () => {
	const image = createElementFactory("img");
	image.src = product.imageUrl;
	image.alt = product.altTxt;
	productImage.appendChild(image);

	productName.innerHTML = product.name;

	productPrice.innerHTML = product.price;

	productDescription.innerHTML = product.description;

	for (let i = 0; i < product.colors.length; i++) {
		const colors = createElementFactory(
			"option",
			{ value: product.colors[i] },
			product.colors[i]
		);

		productColors.appendChild(colors);
	}
};

/* It's creating the product page. */
generateProduct();

const addSelectedProductToCart = (selectedProduct) => {
	/* It's getting the cart from the local storage. */
	let cart = JSON.parse(localStorage.getItem("cart"));
	if (cart === null) {
		cart = [];
		cart.push(selectedProduct);
		localStorage.setItem("cart", JSON.stringify(cart));
	} else if (cart) {
		let productInCart = cart.find(
			(product) =>
				selectedProduct.id === product.id &&
				selectedProduct.color === product.color
		);
		if (productInCart) {
			productInCart.quantity =
				Number(selectedProduct.quantity) + Number(productInCart.quantity);
			localStorage.setItem("cart", JSON.stringify(cart));
		} else {
			cart.push(selectedProduct);
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	}
};

const addToCart = () => {
	/* It's creating an object with the product's information. */
	let selectedProduct = {
		id: productId,
		color: productColors.value,
		quantity: quantitySelected.value,
	};

	if (selectedProduct.color === "") {
		return alert("Veuillez choisir une couleur.");
	} else if (
		selectedProduct.quantity === 0 ||
		selectedProduct.quantity < 1 ||
		selectedProduct.quantity > 100
	) {
		return alert("Veuillez saisir une quantité entre 1 et 100.");
	}
	addSelectedProductToCart(selectedProduct);
	window.location.href = "../html/cart.html";
};

submitToCart.addEventListener("click", addToCart);
