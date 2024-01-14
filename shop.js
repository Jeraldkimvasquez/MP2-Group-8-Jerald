
let cartTotal = 0;
let cart = [];

function addToCart(price, productId, productName, addButton) {
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, price, quantity: 1, name: productName });
    }

    enableQuantityButtons(productId);
    displayCart();
    updateQuantityDisplay(productId, getQuantity(productId));

    // Enable the "Add to Cart" button if quantity is greater than 0
    if (addButton) {
        addButton.disabled = getQuantity(productId) === 0;
    }
}

// Function to remove an item from the cart
function removeItem(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cart = cart.filter(item => item.id !== productId);
        displayCart();
        resetQuantityButtons(productId);
    }
}

function enableQuantityButtons(productId) {
    const decrementButton = document.querySelector(`button[data-product="${productId}"][data-action="decrement"]`);
    const incrementButton = document.querySelector(`button[data-product="${productId}"][data-action="increment"]`);

    if (decrementButton && incrementButton) {
        decrementButton.disabled = false;
        incrementButton.disabled = false;
    }
}

function resetQuantityButtons(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    const decrementButton = document.querySelector(`button[data-product="${productId}"][data-action="decrement"]`);
    const incrementButton = document.querySelector(`button[data-product="${productId}"][data-action="increment"]`);
    const addButton = document.querySelector(`button[data-product="${productId}"][data-action="add-to-cart"]`);

    if (quantityElement) {
        quantityElement.textContent = 0;
    }

    if (decrementButton && incrementButton) {
        decrementButton.disabled = true;
        incrementButton.disabled = true;
    }

    // Enable the "Add to Cart" button if the quantity is 0
    if (addButton) {
        addButton.disabled = getQuantity(productId) > 0;
    }
}

function incrementQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
        displayCart();
        updateQuantityDisplay(productId, cartItem.quantity);
    }
}

function decrementQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && cartItem.quantity > 0) {
        cartItem.quantity -= 1;

        // Remove the product if the quantity is 0
        if (cartItem.quantity === 0) {
            removeItem(productId);
        } else {
            displayCart();
            updateQuantityDisplay(productId, cartItem.quantity);
        }

        // Enable the "Add to Cart" button when the quantity is 0
        const addButton = document.querySelector(`button[data-product="${productId}"][data-action="add-to-cart"]`);
        if (addButton) {
            addButton.disabled = false;
        }
    }
}


function updateQuantityDisplay(productId, quantity) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    if (quantityElement) {
        quantityElement.textContent = quantity;
    }
}

function getQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
}

function getImageUrl(productId) {
    // Provide the appropriate image URL based on the productId
    // You can modify this function according to your image file structure
    // For example, assuming the images are in the same directory with the HTML file and have the same filename as the productId with a .jpg extension:
    return `image/${productId}.jpg`;
}

function processPayment() {
    const paymentInput = document.getElementById('payment');
    const paymentAmount = parseFloat(paymentInput.value);

    const paymentStatus = document.getElementById('payment-status');
    const changeNotification = document.getElementById('change-notification');
   
    

    if (paymentAmount >= cartTotal) {
        const change = paymentAmount - cartTotal;
        paymentStatus.textContent = "Payment successful!";
        changeNotification.textContent = `Your change is: ₱${change.toFixed(2)}`;
      
        resetCart();
    } else { 
        paymentStatus.textContent = "Payment Error!";
        changeNotification.textContent = "You input, Invalid Amount!";
       
    }
      
} 

function resetCart() {
    cartTotal = 0;
    cart = [];
    displayCart();
    document.getElementById('payment').value = ''; // Clear the payment input
}
 
function displayCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    cartItemsElement.innerHTML = cart 
    
        .map(item => `<li style="list-style-type: none; " class="border-bottom" > 
        <img src="${getImageUrl(item.id)}" alt="${item.name}" width="50" height="50">  
        <button class="btn btn-warning rounded-circle" onclick="decrementQuantity('${item.id}')"> - </button>
        <span>${getQuantity(item.id)}</span>
        <button class="btn btn-primary rounded-circle"  onclick="incrementQuantity('${item.id}')"> + </button>  <span class="ml-2">${item.name}</span>    <button class="btn btn-danger rounded-circle float-right" onclick="removeItem('${item.id}')"> <i class=" bi bi-trash"></i> </button>    <label class="float-right mt-2 mx-3">₱${(item.price * getQuantity(item.id)).toFixed(2)}</label>  </li>`)
        .join('');

    cartTotal = cart.reduce((total, item) => total + item.price * getQuantity(item.id), 0);
    cartTotalElement.textContent = `Total: ₱${cartTotal.toFixed(2)}`; 
} 



 
