// Catalog initialization loaded via permanent design fallback assets
const PRODUCT_CATALOG_DATABASE = [
    { id: 1, name: 'Cargo Pants Vintage', category: 'Celana', price: 120000, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80', size: '32', color: 'Olive' },
    { id: 2, name: 'Kaos Nike 90s Retro', category: 'Baju', price: 85000, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80', size: 'M', color: 'Hitam Tonasi' },
    { id: 3, name: 'Kacamata Vintage Classic', category: 'Kacamata', price: 75000, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80', size: 'All Size', color: 'Tortoise Brown' },
    { id: 4, name: 'Converse All Star 70s', category: 'Sepatu', price: 200000, img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=500&q=80', size: '42', color: 'Hitam' },
    { id: 5, name: 'Jaket Denim Vintage', category: 'Jaket', price: 180000, img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80', size: 'L', color: 'Indigo Blue' },
    { id: 6, name: 'Sweater Rajut Classic', category: 'Sweater', price: 95000, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80', size: 'XL', color: 'Navy Blue' }
];

let activeCartList = [];
let calculationSubtotal = 0;
let calculationTotalPayment = 0;

// Dynamic Courier States
let selectedCourierRate = 15000;
let selectedCourierName = "JNE Express (REG)";
let selectedCourierETA = "2 - 3 Hari Pengiriman";

// Default Payment set to COD as requested
let pickedPaymentGateway = "Cash On Delivery (COD)";

document.addEventListener("DOMContentLoaded", () => {
    renderCatalogCollection(PRODUCT_CATALOG_DATABASE, 'home-products-catalog');
    renderCatalogCollection(PRODUCT_CATALOG_DATABASE, 'main-shop-catalog');
    updateGlobalCartInterface();
});

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const targetedNode = document.getElementById(sectionId);
    if(targetedNode) targetedNode.classList.add('active');
}

function renderCatalogCollection(itemsList, DOMTargetNodeID) {
    const renderingContextNode = document.getElementById(DOMTargetNodeID);
    if(!renderingContextNode) return;

    renderingContextNode.innerHTML = '';
    itemsList.forEach(product => {
        renderingContextNode.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>Rp ${product.price.toLocaleString('id-ID')}</p>
                <button class="btn-add-cart" onclick="pushItemToCartSystem(${product.id})">Tambah ke Keranjang</button>
            </div>
        `;
    });
}

function filterCategory(categoryTag) {
    showSection('shop');
    document.querySelectorAll('.filter-btn').forEach(button => {
        if(button.textContent.toLowerCase() === categoryTag.toLowerCase() || (categoryTag === 'All' && button.textContent === 'Semua')) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    if(categoryTag === 'All') {
        renderCatalogCollection(PRODUCT_CATALOG_DATABASE, 'main-shop-catalog');
    } else {
        const filteredArray = PRODUCT_CATALOG_DATABASE.filter(item => item.category.toLowerCase() === categoryTag.toLowerCase());
        renderCatalogCollection(filteredArray, 'main-shop-catalog');
    }
}

function pushItemToCartSystem(productId) {
    const discoveredProduct = PRODUCT_CATALOG_DATABASE.find(p => p.id === productId);
    const itemInCartAlready = activeCartList.find(item => item.id === productId);

    if(itemInCartAlready) {
        itemInCartAlready.quantity++;
    } else {
        activeCartList.push({ ...discoveredProduct, quantity: 1 });
    }
    updateGlobalCartInterface();
}

function changeRowQuantity(productId, alterationValue) {
    const designatedCartItem = activeCartList.find(item => item.id === productId);
    if(designatedCartItem) {
        designatedCartItem.quantity += alterationValue;
        if(designatedCartItem.quantity <= 0) {
            activeCartList = activeCartList.filter(item => item.id !== productId);
        }
        updateGlobalCartInterface();
    }
}

function updateGlobalCartInterface() {
    const totalCountSum = activeCartList.reduce((acc, obj) => acc + obj.quantity, 0);
    document.getElementById('cart-count').textContent = totalCountSum;

    const listContainerNode = document.getElementById('cart-items-list');
    if(!listContainerNode) return;

    if(activeCartList.length === 0) {
        listContainerNode.innerHTML = `<div class="card-layout-flat text-center" style="padding: 20px;"><p>Keranjang belanja kamu masih kosong.</p></div>`;
        document.getElementById('summary-subtotal').textContent = 'Rp 0';
        document.getElementById('cart-summary-qty').textContent = '0';
        return;
    }

    listContainerNode.innerHTML = '';
    calculationSubtotal = 0;

    activeCartList.forEach(row => {
        calculationSubtotal += (row.price * row.quantity);
        listContainerNode.innerHTML += `
            <div class="cart-row-item">
                <img src="${row.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                <div class="cart-item-info">
                    <h4>${row.name}</h4>
                    <strong>Rp ${row.price.toLocaleString('id-ID')}</strong>
                </div>
                <div class="qty-pill-box">
                    <button onclick="changeRowQuantity(${row.id}, -1)">-</button>
                    <span>${row.quantity}</span>
                    <button onclick="changeRowQuantity(${row.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById('cart-summary-qty').textContent = totalCountSum;
    document.getElementById('summary-subtotal').textContent = `Rp ${calculationSubtotal.toLocaleString('id-ID')}`;
}

function goToShippingStep() {
    if(activeCartList.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }
    showSection('shipping-step');
}

// Handles Real-Time Delivery Estimates dynamically
function selectShippingCourier(courierName, shippingCost, estimatedDays) {
    selectedCourierName = courierName;
    selectedCourierRate = shippingCost;
    selectedCourierETA = `${estimatedDays} Hari Pengiriman`;

    document.querySelectorAll('.shipping-options-group .method-option').forEach(el => el.classList.remove('checked'));
    
    if(courierName.includes('JNE')) document.getElementById('courier-jne').classList.add('checked');
    if(courierName.includes('J&T')) document.getElementById('courier-jnt').classList.add('checked');
    if(courierName.includes('SiCepat')) document.getElementById('courier-sicepat').classList.add('checked');
    if(courierName.includes('Pos')) document.getElementById('courier-pos').classList.add('checked');

    document.getElementById('ship-step-courier').textContent = courierName;
    document.getElementById('ship-step-ongkir').textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
}

function goToPaymentStep() {
    calculationTotalPayment = calculationSubtotal + selectedCourierRate;
    
    document.getElementById('pay-subtotal').textContent = `Rp ${calculationSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('pay-ongkir').textContent = `Rp ${selectedCourierRate.toLocaleString('id-ID')}`;
    document.getElementById('pay-total').textContent = `Rp ${calculationTotalPayment.toLocaleString('id-ID')}`;
    
    showSection('payment');
}

function selectPaymentRadio(htmlLabelElement, methodLabelString) {
    document.querySelectorAll('.payment-group .method-option').forEach(element => element.classList.remove('checked'));
    htmlLabelElement.classList.add('checked');
    
    const radioInput = htmlLabelElement.querySelector('input[type="radio"]');
    if(radioInput) radioInput.checked = true;
    
    pickedPaymentGateway = methodLabelString;
}

function simulatePaymentOutcome(isSuccess) {
    if(isSuccess) {
        document.getElementById('success-method').textContent = pickedPaymentGateway;
        document.getElementById('success-total').textContent = `Rp ${calculationTotalPayment.toLocaleString('id-ID')}`;
        showSection('payment-success');
    }
}

function openTrackingDashboard() {
    const trackingContainer = document.getElementById('tracking-items-container');
    if(!trackingContainer) return;

    trackingContainer.innerHTML = '';
    activeCartList.forEach(item => {
        trackingContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
                <span>${item.name} <strong>(x${item.quantity})</strong></span>
                <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
        `;
    });

    document.getElementById('track-total').textContent = `Rp ${calculationTotalPayment.toLocaleString('id-ID')}`;
    document.getElementById('track-courier-name').textContent = selectedCourierName;
    document.getElementById('track-eta-days').textContent = selectedCourierETA;
    
    // Updates instructions for COD vs online processing
    const descNode = document.getElementById('track-eta-desc');
    if(pickedPaymentGateway.includes('COD')) {
        descNode.textContent = "Silakan siapkan uang pas tunai untuk diserahkan ke kurir saat barang tiba.";
    } else {
        descNode.textContent = "Pembayaran lunas. Paket Anda langsung diserahkan ke kurir.";
    }

    showSection('tracking-panel');
}
