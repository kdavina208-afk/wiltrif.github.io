// Database updated with direct image URLs matching your design mockup perfectly
const PRODUCT_CATALOG_DATABASE = [
    { 
        id: 1, 
        name: 'Cargo Pants Vintage', 
        category: 'Celana', 
        price: 120000, 
        img: 'https://raw.githubusercontent.com/kdavina208-afk/wiltrif.github.io/main/images/cargo-pants.jpg', 
        size: '32', 
        color: 'Olive' 
    },
    { 
        id: 2, 
        name: 'Kaos Nike 90s Retro', 
        category: 'Baju', 
        price: 85000, 
        img: 'https://raw.githubusercontent.com/kdavina208-afk/wiltrif.github.io/main/images/nike-tee.jpg', 
        size: 'M', 
        color: 'Hitam Tonasi' 
    },
    { 
        id: 3, 
        name: 'Kacamata Vintage Classic', 
        category: 'Kacamata', 
        price: 75000, 
        img: 'https://raw.githubusercontent.com/kdavina208-afk/wiltrif.github.io/main/images/kacamata.jpg', 
        size: 'All Size', 
        color: 'Tortoise Brown' 
    },
    { 
        id: 4, 
        name: 'Converse All Star 70s', 
        category: 'Sepatu', 
        price: 200000, 
        img: 'https://raw.githubusercontent.com/kdavina208-afk/wiltrif.github.io/main/images/converse.jpg', 
        size: '42', 
        color: 'Hitam' 
    },
    { 
        id: 5, 
        name: 'Jaket Denim Vintage', 
        category: 'Jaket', 
        price: 180000, 
        img: 'https://raw.githubusercontent.com/kdavina208-afk/wiltrif.github.io/main/images/denim-jacket.jpg', 
        size: 'L', 
        color: 'Indigo Blue' 
    },
    { 
        id: 6, 
        name: 'Sweater Rajut Classic', 
        category: 'Sweater', 
        price: 95000, 
        img: 'https://raw.githubusercontent.com/kdavina208-afk/wiltrif.github.io/main/images/sweater.jpg', 
        size: 'XL', 
        color: 'Navy Blue Mix' 
    }
];

let activeCartList = [];
let calculationSubtotal = 0;
let calculationTotalPayment = 0;
let pickedPaymentGateway = "Transfer Bank";

document.addEventListener("DOMContentLoaded", () => {
    renderCatalogCollection(PRODUCT_CATALOG_DATABASE, 'home-products-catalog');
    renderCatalogCollection(PRODUCT_CATALOG_DATABASE, 'main-shop-catalog');
    updateGlobalCartInterface();
});

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const targetedNode = document.getElementById(sectionId);
    if(targetedNode) {
        targetedNode.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function renderCatalogCollection(itemsList, DOMTargetNodeID) {
    const renderingContextNode = document.getElementById(DOMTargetNodeID);
    if(!renderingContextNode) return;

    renderingContextNode.innerHTML = '';
    itemsList.forEach(product => {
        renderingContextNode.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300?text=Image+Missing'">
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
    const countBadge = document.getElementById('cart-count');
    if (countBadge) countBadge.textContent = totalCountSum;

    const listContainerNode = document.getElementById('cart-items-list');
    if(!listContainerNode) return;

    if(activeCartList.length === 0) {
        listContainerNode.innerHTML = `<div class="card-layout-flat text-center"><p>Keranjang belanja kamu masih kosong.</p></div>`;
        document.getElementById('summary-subtotal').textContent = 'Rp 0';
        document.getElementById('summary-total').textContent = 'Rp 0';
        document.getElementById('cart-summary-qty').textContent = '0';
        return;
    }

    listContainerNode.innerHTML = '';
    calculationSubtotal = 0;

    activeCartList.forEach(row => {
        calculationSubtotal += (row.price * row.quantity);
        listContainerNode.innerHTML += `
            <div class="cart-row-item">
                <img src="${row.img}" onerror="this.src='https://placehold.co/100x100?text=No+Image'">
                <div class="cart-item-info">
                    <h4>${row.name}</h4>
                    <p>Ukuran: ${row.size} | Warna: ${row.color}</p>
                    <strong>Rp ${row.price.toLocaleString('id-ID')}</strong>
                </div>
                <div class="qty-pill-box">
                    <button onclick="changeRowQuantity(${row.id}, -1)">-</button>
                    <span>${row.quantity}</span>
                    <button onclick="changeRowQuantity(${row.id}, 1)">+</button>
                </div>
                <button class="btn-remove-row" onclick="changeRowQuantity(${row.id}, -${row.quantity})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    });

    const standardFlatShippingFee = 15000;
    calculationTotalPayment = calculationSubtotal + standardFlatShippingFee;

    document.getElementById('cart-summary-qty').textContent = totalCountSum;
    document.getElementById('summary-subtotal').textContent = `Rp ${calculationSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('summary-total').textContent = `Rp ${calculationTotalPayment.toLocaleString('id-ID')}`;
}

function selectPaymentRadio(htmlLabelElement) {
    document.querySelectorAll('.method-option').forEach(element => element.classList.remove('checked'));
    htmlLabelElement.classList.add('checked');
    
    const contextRadioInputElement = htmlLabelElement.querySelector('input[type="radio"]');
    contextRadioInputElement.checked = true;
    pickedPaymentGateway = contextRadioInputElement.value;
}

function goToPaymentStep() {
    if(activeCartList.length === 0) {
        alert("Tambahkan item baju terlebih dahulu sebelum beralih ke menu pembayaran!");
        return;
    }
    
    document.querySelector('.pay-item-count').textContent = activeCartList.reduce((acc, obj) => acc + obj.quantity, 0);
    document.getElementById('pay-subtotal').textContent = `Rp ${calculationSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('pay-total').textContent = `Rp ${calculationTotalPayment.toLocaleString('id-ID')}`;
    
    showSection('payment');
    initializeCheckoutCountdownTimer(23, 59);
}

function initializeCheckoutCountdownTimer(mins, secs) {
    const UIAnchorDisplayNode = document.getElementById('countdown-timer');
    let convertedTotalSecondsLeft = (mins * 60) + secs;

    if (window.activeStoreIntervalLoop) clearInterval(window.activeStoreIntervalLoop);

    window.activeStoreIntervalLoop = setInterval(() => {
        let printMins = Math.floor(convertedTotalSecondsLeft / 60);
        let printSecs = convertedTotalSecondsLeft % 60;

        printMins = printMins < 10 ? "0" + printMins : printMins;
        printSecs = printSecs < 10 ? "0" + printSecs : printSecs;

        if(UIAnchorDisplayNode) UIAnchorDisplayNode.textContent = `${printMins} : ${printSecs}`;

        if (--convertedTotalSecondsLeft < 0) {
            clearInterval(window.activeStoreIntervalLoop);
            alert("Batas durasi penyelesaian invoice berakhir.");
            showSection('cart');
        }
    }, 1000);
}

function simulatePaymentOutcome(isSuccessfulTransaction) {
    if (window.activeStoreIntervalLoop) clearInterval(window.activeStoreIntervalLoop);

    if(isSuccessfulTransaction) {
        document.getElementById('success-method').textContent = pickedPaymentGateway;
        document.getElementById('success-total').textContent = `Rp ${calculationTotalPayment.toLocaleString('id-ID')}`;
        showSection('payment-success');
    } else {
        showSection('payment-failed');
    }
}

// Opens the exact tracking page dashboard from your mockups
function openTrackingDashboard() {
    const listInjectionTargetNode = document.getElementById('tracking-items-container');
    if(!listInjectionTargetNode) return;

    listInjectionTargetNode.innerHTML = '';
    let piecesCounter = 0;

    activeCartList.forEach(element => {
        piecesCounter += element.quantity;
        listInjectionTargetNode.innerHTML += `
            <div class="cart-row-item" style="border:none; padding:8px 0;">
                <img src="${element.img}" style="width:50px; height:50px; border-radius:6px;" onerror="this.src='https://placehold.co/50x50?text=Item'">
                <div class="cart-item-info">
                    <h4 style="font-size:13px;">${element.name}</h4>
                    <p style="font-size:11px;">Ukuran: ${element.size} | Warna: ${element.color} | Qty: ${element.quantity}</p>
                </div>
                <strong style="font-size:13px;">Rp ${(element.price * element.quantity).toLocaleString('id-ID')}</strong>
            </div>
        `;
    });

    const markdownDiscountCalculated = 10000;
    const computedInvoiceReceiptTotal = calculationTotalPayment - markdownDiscountCalculated;

    document.getElementById('track-qty-lbl').textContent = piecesCounter;
    document.getElementById('track-subtotal').textContent = `Rp ${calculationSubtotal.toLocaleString('id-ID')}`;
    document.getElementById('track-total').textContent = `Rp ${computedInvoiceReceiptTotal.toLocaleString('id-ID')}`;

    showSection('tracking-panel');
}
