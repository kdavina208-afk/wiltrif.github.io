// Expanded 12-Item Database with Accurate Images
const PRODUCTS_DATA = [
    { id: 1, name: 'Jaket Denim Vintage', category: 'Jaket', price: 180000, img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=500', size: 'L', color: 'Denim' },
    { id: 2, name: 'Converse All Star 70s', category: 'Sepatu', price: 200000, img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=500', size: '42', color: 'Hitam' },
    { id: 3, name: 'Sweater Rajut Classic', category: 'Sweater', price: 95000, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=500', size: 'XL', color: 'Navy' },
    { id: 4, name: 'Cargo Pants Vintage', category: 'Celana', price: 120000, img: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=500', size: '32', color: 'Olive' },
    { id: 5, name: 'Kaos Nike 90s Retro', category: 'Baju', price: 85000, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500', size: 'M', color: 'Hitam' },
    { id: 6, name: 'Kacamata Vintage Oval', category: 'Kacamata', price: 75000, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500', size: 'All Size', color: 'Leopard' },
    { id: 7, name: 'Jaket Varsity Corduroy', category: 'Jaket', price: 210000, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=500', size: 'XL', color: 'Hijau Tua' },
    { id: 8, name: 'Docmart Leather Boots 1460', category: 'Sepatu', price: 350000, img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=500', size: '41', color: 'Maroon' },
    { id: 9, name: 'Sweater Oversize Crewneck', category: 'Sweater', price: 110000, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500', size: 'L', color: 'Abu-Abu' },
    { id: 10, name: 'Celana Levi 501 Vintage', category: 'Celana', price: 195000, img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500', size: '30', color: 'Light Blue' },
    { id: 11, name: 'Flannel Shirt Retro', category: 'Baju', price: 90000, img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=500', size: 'L', color: 'Merah Hitam' },
    { id: 12, name: 'Kacamata Retro Steampunk', category: 'Kacamata', price: 80000, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500', size: 'All Size', color: 'Emas' }
];

let cart = [];
let checkoutSubtotal = 0;
let checkoutTotal = 0;
let selectedPaymentMethod = "QRIS";

// System Initialization
document.addEventListener("DOMContentLoaded", () => {
    renderCatalogItems(PRODUCTS_DATA);
    updateCartUI();
});

// Main Section Routing Management
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if(targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Automatically close the mobile navigation menu drawer
    document.getElementById('navMenu').classList.remove('mobile-open');
}

function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('mobile-open');
}

// Render Grid Catalog
function renderCatalogItems(products) {
    const catalogContainer = document.getElementById('products-catalog-container');
    if(!catalogContainer) return;

    catalogContainer.innerHTML = '';
    products.forEach(item => {
        catalogContainer.innerHTML += `
            <div class="product-item-card animate-fade-in">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <div class="product-info">
                    <h4>${item.name}</h4>
                    <p class="product-price">Rp ${item.price.toLocaleString('id-ID')}</p>
                    <button class="btn-add-item" onclick="addItemToCart(${item.id})"><i class="fas fa-shopping-basket"></i> Tambah</button>
                </div>
            </div>
        `;
    });
}

// Category Query Filtering System
function filterCategory(category) {
    showSection('shop');
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if(btn.textContent.toLowerCase() === category.toLowerCase() || (category === 'All' && btn.textContent === 'Semua')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if(category === 'All') {
        renderCatalogItems(PRODUCTS_DATA);
    } else {
        const filtered = PRODUCTS_DATA.filter(p => p.category.toLowerCase() === category.toLowerCase());
        renderCatalogItems(filtered);
    }
}

// Cart Management Systems
function addItemToCart(id) {
    const product = PRODUCTS_DATA.find(p => p.id === id);
    const existingCartItem = cart.find(item => item.id === id);

    if(existingCartItem) {
        existingCartItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function adjustCartQty(id, modifier) {
    const targetItem = cart.find(item => item.id === id);
    if(targetItem) {
        targetItem.qty += modifier;
        if(targetItem.qty <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        updateCartUI();
    }
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, current) => sum + current.qty, 0);
    document.getElementById('cart-count').textContent = totalQty;

    const listNode = document.getElementById('cart-items-list');
    if(!listNode) return;

    if(cart.length === 0) {
        listNode.innerHTML = `
            <div class="card" style="text-align:center; padding: 40px 20px;">
                <i class="fas fa-shopping-bag" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                <p style="font-weight: 600; color: #888;">Keranjang belanja Anda kosong.</p>
            </div>`;
        document.getElementById('summary-subtotal').textContent = 'Rp 0';
        document.getElementById('summary-total').textContent = 'Rp 0';
        return;
    }

    listNode.innerHTML = '';
    checkoutSubtotal = 0;

    cart.forEach(item => {
        const rowCost = item.price * item.qty;
        checkoutSubtotal += rowCost;
        listNode.innerHTML += `
            <div class="cart-item-row">
                <img src="${item.img}">
                <div class="item-meta">
                    <h4>${item.name}</h4>
                    <p>Ukuran: ${item.size} | Warna: ${item.color}</p>
                    <strong>Rp ${item.price.toLocaleString('id-ID')}</strong>
                </div>
                <div class="qty-controls">
                    <button onclick="adjustCartQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="adjustCartQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    const shippingFee = 15000;
    checkoutTotal = checkoutSubtotal + shippingFee;

    document.getElementById('summary-subtotal').textContent = `Rp ${checkoutSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('summary-total').textContent = `Rp ${checkoutTotal.toLocaleString('id-ID')}`;
}

// Payment Selection Styling Handler
function selectPaymentRadio(element) {
    document.querySelectorAll('.method-option').forEach(opt => opt.classList.remove('checked'));
    element.classList.add('checked');
    
    const radioInput = element.querySelector('input[type="radio"]');
    radioInput.checked = true;
    selectedPaymentMethod = radioInput.value;
}

// Proceed to Checkout Step
function goToPaymentStep() {
    if(cart.length === 0) {
        alert("Keranjang Anda masih kosong!");
        return;
    }
    
    document.getElementById('pay-subtotal').textContent = `Rp ${checkoutSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('pay-total').textContent = `Rp ${checkoutTotal.toLocaleString('id-ID')}`;
    
    showSection('payment');
    launchCountdownTimer(23, 59);
}

// Dynamic Expiry Checkout Timer Countdown
function launchCountdownTimer(minutes, seconds) {
    const timerDisplay = document.getElementById('countdown-timer');
    let totalSeconds = (minutes * 60) + seconds;

    // Clear previous running countdown loops
    if (window.activeCheckoutInterval) clearInterval(window.activeCheckoutInterval);

    window.activeCheckoutInterval = setInterval(() => {
        let currentMinutes = Math.floor(totalSeconds / 60);
        let currentSeconds = totalSeconds % 60;

        currentMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
        currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;

        timerDisplay.textContent = `${currentMinutes}:${currentSeconds}`;

        if (--totalSeconds < 0) {
            clearInterval(window.activeCheckoutInterval);
            timerDisplay.textContent = "00:00";
            alert("Sesi transaksi Anda telah kedaluwarsa. Silakan ulangi checkout.");
            showSection('cart');
        }
    }, 1000);
}

// Gateway Transaction Simulator Route Switcher
function simulatePaymentOutcome(successState) {
    if (window.activeCheckoutInterval) clearInterval(window.activeCheckoutInterval);

    if(successState) {
        document.getElementById('success-payment-method').textContent = selectedPaymentMethod;
        document.getElementById('success-total').textContent = `Rp ${checkoutTotal.toLocaleString('id-ID')}`;
        showSection('payment-success');
    } else {
        showSection('payment-failed');
    }
}

// Order Tracking Management System
function openTrackingDashboard() {
    const container = document.getElementById('tracking-items-container');
    container.innerHTML = '';

    cart.forEach(item => {
        container.innerHTML += `
            <div class="cart-item-row" style="border:none; padding:10px 0; margin:0; border-bottom:1px solid #eee;">
                <img src="${item.img}" style="width:60px; height:60px;">
                <div class="item-meta">
                    <h4 style="font-size:14px;">${item.name}</h4>
                    <p style="font-size:12px;">Ukuran: ${item.size} | Warna: ${item.color}</p>
                    <small class="text-muted">Jumlah: ${item.qty}x</small>
                </div>
                <div style="text-align:right; font-weight:700; font-size:14px;">
                    Rp ${(item.price * item.qty).toLocaleString('id-ID')}
                </div>
            </div>
        `;
    });

    const discountAmount = 10000; 
    const operationalFinalTotal = checkoutTotal - discountAmount;

    document.getElementById('track-subtotal').textContent = `Rp ${checkoutSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('track-total').textContent = `Rp ${operationalFinalTotal.toLocaleString('id-ID')}`;

    showSection('tracking-panel');

    // Flush active state cart contents upon generating delivery invoice sheet
    cart = [];
    updateCartUI();
}
