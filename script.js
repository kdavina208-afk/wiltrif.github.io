// Database Mock Database Catalog Setup
const PRODUCTS_DATA = [
    { id: 1, name: 'Jaket Denim Vintage', category: 'Jaket', price: 180000, img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400', size: 'L', color: 'Denim' },
    { id: 2, name: 'Converse All Star 70s', category: 'Sepatu', price: 200000, img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=400', size: '42', color: 'Hitam' },
    { id: 3, name: 'Sweater Rajut Classic', category: 'Sweater', price: 95000, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400', size: 'XL', color: 'Navy' },
    { id: 4, name: 'Cargo Pants Vintage', category: 'Celana', price: 120000, img: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=400', size: '32', color: 'Olive' },
    { id: 5, name: 'Kaos Nike 90s', category: 'Baju', price: 85000, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400', size: 'M', color: 'Hitam' },
    { id: 6, name: 'Kacamata Vintage', category: 'Kacamata', price: 75000, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400', size: 'All Size', color: 'Leopard' }
];

let cart = [];

// Initialize Page Setup on load
document.addEventListener("DOMContentLoaded", () => {
    renderCatalog(PRODUCTS_DATA);
    updateCartUI();
});

// Navigation Controller Switches Visibility State
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(sectionId);
    if(activeSection) {
        activeSection.classList.add('active');
        window.scrollTo(0,0);
    }
    
    // Auto collapse mobile menu drawer after click
    document.getElementById('navMenu').classList.remove('mobile-open');
}

function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('mobile-open');
}

// Render dynamic elements to window
function renderCatalog(items) {
    const catalogContainer = document.getElementById('products-catalog-container');
    if(!catalogContainer) return;
    
    catalogContainer.innerHTML = '';
    items.forEach(product => {
        catalogContainer.innerHTML += `
            <div class="product-item-card">
                <img src="${product.img}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                    <button class="btn-add-item" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
                </div>
            </div>
        `;
    });
}

// Category filter logic
function filterCategory(categoryName) {
    showSection('shop');
    
    // Toggle active state in category button nodes
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if(btn.textContent.toLowerCase() === categoryName.toLowerCase() || (categoryName === 'All' && btn.textContent === 'Semua')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if(categoryName === 'All') {
        renderCatalog(PRODUCTS_DATA);
    } else {
        const filtered = PRODUCTS_DATA.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
        renderCatalog(filtered);
    }
}

// Cart Mechanics & calculations
function addToCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if(existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    alert(`${product.name} berhasil ditambahkan ke keranjang belanja.`);
}

function alterQuantity(id, amount) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += amount;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCartUI();
    }
}

function updateCartUI() {
    // Top counter count badge updating
    const totalItemsCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
    document.getElementById('cart-count').textContent = totalItemsCount;

    // Build lists view
    const listContainer = document.getElementById('cart-items-list');
    if(!listContainer) return;

    if(cart.length === 0) {
        listContainer.innerHTML = '<div class="card"><p>Keranjang belanja kamu masih kosong.</p></div>';
        document.getElementById('summary-subtotal').textContent = 'Rp 0';
        document.getElementById('summary-total').textContent = 'Rp 0';
        return;
    }

    listContainer.innerHTML = '';
    let calculatedSubtotal = 0;

    cart.forEach(item => {
        const costValue = item.price * item.qty;
        calculatedSubtotal += costValue;
        listContainer.innerHTML += `
            <div class="cart-item-row">
                <img src="${item.img}">
                <div class="item-meta">
                    <h4>${item.name}</h4>
                    <p>Ukuran: ${item.size} | Warna: ${item.color}</p>
                    <strong>Rp ${item.price.toLocaleString('id-ID')}</strong>
                </div>
                <div class="qty-controls">
                    <button onclick="alterQuantity(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="alterQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    const shippingCost = 15000;
    document.getElementById('summary-subtotal').textContent = `Rp ${calculatedSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('summary-total').textContent = `Rp ${(calculatedSubtotal + shippingCost).toLocaleString('id-ID')}`;
}

// Payment Checkout Sequence Bridge
function goToPaymentStep() {
    if(cart.length === 0) {
        alert("Keranjang masih kosong! Silakan tambahkan produk terlebih dahulu.");
        return;
    }
    
    // Copy computed text rates safely over to checkout panel
    const subtotalText = document.getElementById('summary-subtotal').textContent;
    const totalText = document.getElementById('summary-total').textContent;
    
    document.getElementById('pay-subtotal').textContent = subtotalText;
    document.getElementById('pay-total').textContent = totalText;
    
    showSection('payment');
    startTimer();
}

// Simple dynamic timer engine
function startTimer() {
    let duration = 24 * 60; 
    const displayElement = document.getElementById('countdown-timer');
    
    const intervalId = setInterval(() => {
        let minutes = Math.floor(duration / 60);
        let seconds = duration % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        displayElement.textContent = minutes + ":" + seconds;

        if (--duration < 0) {
            clearInterval(intervalId);
            displayElement.textContent = "00:00";
        }
    }, 1000);
}

// Simulate Transaction Flow State Router
function simulatePaymentOutcome(isSuccess) {
    if(isSuccess) {
        const orderValueText = document.getElementById('pay-total').textContent;
        document.getElementById('success-total').textContent = orderValueText;
        showSection('payment-success');
    } else {
        showSection('payment-failed');
    }
}

// Final Step: Populating Order Tracking Details Dashboard View
function openTrackingDashboard() {
    const trackingItemsContainer = document.getElementById('tracking-items-container');
    trackingItemsContainer.innerHTML = '';

    cart.forEach(item => {
        trackingItemsContainer.innerHTML += `
            <div class="cart-item-row">
                <img src="${item.img}">
                <div class="item-meta">
                    <h4>${item.name}</h4>
                    <p>Ukuran: ${item.size} | Warna: ${item.color}</p>
                </div>
                <div>
                    <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                    <p class="text-muted">Qty: ${item.qty}</p>
                </div>
            </div>
        `;
    });

    showSection('tracking-panel');
    
    // Empty the user's cart upon tracking generation sequence completion
    cart = [];
    updateCartUI();
}