

let cart = [];

function addToCart(itemName, itemPrice, options = null) {
    const existingItem = cart.find(item => item.name === itemName && JSON.stringify(item.options) === JSON.stringify(options));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const newItem = { name: itemName, price: itemPrice, quantity: 1, options: options };
        cart.push(newItem);
    }
    updateCartCount();
    saveCart();
    showNotification(`${itemName} foi adicionado ao carrinho.`);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity}) ${item.options ? JSON.stringify(item.options) : ''}</span>
            <span>R$${(item.price * item.quantity).toFixed(2)}</span>
            <button id="button-remove-cart" onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    cartTotalContainer.innerText = `Total: R$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    displayCart();
    updateCartCount();
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('cart-notification');
    notification.innerText = message;
    notification.style.display = 'block';
    notification.style.backgroundColor = isError ? 'red' : 'green';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    if (document.getElementById('cart-items')) {
        displayCart();
    }
});

function showFruitOptions() {
    document.getElementById('fruit-options').classList.remove('hidden');
}

function addCupWithFruits() {
    const selectedFruits = [];
    document.querySelectorAll('#fruit-options .fruit-option input[type="checkbox"]:checked').forEach((checkbox) => {
        selectedFruits.push(checkbox.value);
    });
    if (selectedFruits.length !== 3) {
        showNotification('Por favor, selecione 3 frutas.', true);
        return;
    }
    const chocolateType = document.getElementById('chocolate').value;
    const itemOptions = {
        frutas: selectedFruits,
        chocolate: chocolateType
    };
    addToCart('Copo de Chocolate com Frutas', 30.00, itemOptions);
    document.getElementById('fruit-options').classList.add('hidden');
    checkbox.value = '';
}


function formatOptions(options) {
    let formattedOptions = '';
    if (options && options.frutas && options.frutas.length > 0) {
        formattedOptions += 'Frutas: ';
        formattedOptions += options.frutas.join(', ');
    }
    if (options && options.chocolate) {
        if (formattedOptions !== '') {
            formattedOptions += ' | ';
        }
        formattedOptions += 'Chocolate: ' + options.chocolate;
    }
    return formattedOptions;
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        const formattedOptions = formatOptions(item.options);
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>${formattedOptions}</span>
            <span>R$${(item.price * item.quantity).toFixed(2)}</span>
            <button id="button-remove-cart" onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    cartTotalContainer.innerText = `Total: R$${total.toFixed(2)}`;
}



function toggleNavMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('open');
}

const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', toggleNavMenu);


function isMobile() {
    return window.innerWidth < 768;
}


if (isMobile()) {
    document.addEventListener('click', (event) => {
        const navMenu = document.getElementById('nav-menu');
        
        if (!event.target.closest('#nav-menu') && !event.target.closest('#nav-toggle')) {
            navMenu.classList.remove('open');
        }
    });
}