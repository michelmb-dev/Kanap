import {generateShowError} from "./utils.js";


/* Selecting the element with the id orderId. */
const orderIdMsg = document.querySelector('#orderId');


/**
 * It checks if the orderId is present in the URL, if it is, it displays it, if not, it displays an error message
 */
const confirmOrder = () => {
	let urlParams = new URLSearchParams(window.location.search)
	let asOrderId = urlParams.has('orderId');
	let orderId = urlParams.get('orderId')
	if (!asOrderId || orderId === "") {
		generateShowError(orderIdMsg, "Oups ! Nous rencontrons un problème. Votre commande n'a pas été enregistrée, veuillez nous excusez.")
	}else {
		/* Displaying the orderId in the HTML. */
		orderIdMsg.innerHTML = orderId;

		/* Removing the cart from local storage. */
		localStorage.removeItem('cart');
	}
}


/* Calling the function confirmOrder() */
confirmOrder();
