const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const cartTotal = document.getElementById('cart-total');
const searchInput = document.getElementById('search'); // Assuming there is an input with this ID
let cart = [];
let productsList = []; // Array to hold fetched products

async function fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    productsList = await response.json(); // Store fetched products in a variable
    displayProducts(productsList);
}

function displayProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="100">
            <h3>${product.title}</h3>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

function addToCart(productId) {
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        productInCart.quantity++;
    } else {
        fetch(`https://fakestoreapi.com/products/${productId}`) // Added quotes
            .then(response => response.json())
            .then(product => {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                renderCart();
            });
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function updateQuantity(productId, amount) {
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        productInCart.quantity += amount;
        if (productInCart.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
}

function renderCart() {
    cartContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="50">
            <p>${item.title}</p>
            <p>₹${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });
    cartTotal.innerText = `Total: ₹${total.toFixed(2)}`; // Added currency symbol for clarity
}

searchInput.addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = productsList.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts); // Use displayProducts directly for filtered results
});

// Initial fetch of products
fetchProducts();