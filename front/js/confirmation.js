/* Getting the orderId from the URL. */
const orderId = new URLSearchParams(window.location.search).get("orderId");

/* Getting the element with the id of orderId and setting the innerHTML to the orderId. */
const orderIdMsg = document.getElementById('orderId');
orderIdMsg.innerHTML = orderId;

/* Removing the cart from local storage. */
localStorage.removeItem('cart');
