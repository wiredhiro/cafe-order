// ドリンクメニューデータ
const drinks = [
    { id: 1, name: 'コーヒー', price: 350 },
    { id: 2, name: 'カフェラテ', price: 400 },
    { id: 3, name: 'カプチーノ', price: 420 },
    { id: 4, name: 'エスプレッソ', price: 300 },
    { id: 5, name: '紅茶', price: 330 },
    { id: 6, name: '抹茶ラテ', price: 450 },
    { id: 7, name: 'アイスティー', price: 350 },
    { id: 8, name: 'オレンジジュース', price: 380 },
    { id: 9, name: 'レモネード', price: 380 },
    { id: 10, name: 'ミルクシェイク', price: 480 }
];

// カートデータ
let cart = [];

// DOM要素
const drinkGrid = document.getElementById('drinkGrid');
const cartElement = document.getElementById('cart');
const totalPriceElement = document.getElementById('totalPrice');
const orderBtn = document.getElementById('orderBtn');
const confirmModal = document.getElementById('confirmModal');
const successModal = document.getElementById('successModal');
const modalOrderSummary = document.getElementById('modalOrderSummary');
const modalTotal = document.getElementById('modalTotal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const closeBtn = document.getElementById('closeBtn');
const orderNumber = document.getElementById('orderNumber');

// 初期化
function init() {
    renderDrinks();
    renderCart();
    setupEventListeners();
}

// ドリンクメニューを表示
function renderDrinks() {
    drinkGrid.innerHTML = '';
    drinks.forEach(drink => {
        const drinkCard = document.createElement('div');
        drinkCard.className = 'drink-card';
        drinkCard.innerHTML = `
            <div class="drink-name">${drink.name}</div>
            <div class="drink-price">¥${drink.price}</div>
        `;
        drinkCard.addEventListener('click', () => addToCart(drink));
        drinkGrid.appendChild(drinkCard);
    });
}

// カートに追加
function addToCart(drink) {
    const existingItem = cart.find(item => item.id === drink.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...drink,
            quantity: 1
        });
    }

    renderCart();
    updateTotal();
}

// カートから削除
function removeFromCart(drinkId) {
    cart = cart.filter(item => item.id !== drinkId);
    renderCart();
    updateTotal();
}

// 数量変更
function updateQuantity(drinkId, change) {
    const item = cart.find(item => item.id === drinkId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(drinkId);
        } else {
            renderCart();
            updateTotal();
        }
    }
}

// カートを表示
function renderCart() {
    if (cart.length === 0) {
        cartElement.innerHTML = '<p class="empty-cart">カートは空です</p>';
        orderBtn.disabled = true;
        return;
    }

    cartElement.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div>¥${item.price} × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">削除</button>
            </div>
        `;
        cartElement.appendChild(cartItem);
    });

    orderBtn.disabled = false;
}

// 合計金額を更新
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `¥${total}`;
}

// 注文確認モーダルを表示
function showConfirmModal() {
    modalOrderSummary.innerHTML = '';

    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'modal-order-item';
        orderItem.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>¥${item.price * item.quantity}</span>
        `;
        modalOrderSummary.appendChild(orderItem);
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotal.textContent = `合計: ¥${total}`;

    confirmModal.classList.add('active');
}

// モーダルを閉じる
function closeModal(modal) {
    modal.classList.remove('active');
}

// 注文を確定
function confirmOrder() {
    closeModal(confirmModal);

    // 注文番号を生成（ランダムな4桁の数字）
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    orderNumber.textContent = `#${orderNum}`;

    // カートをクリア
    cart = [];
    renderCart();
    updateTotal();

    // 成功モーダルを表示
    successModal.classList.add('active');
}

// イベントリスナーの設定
function setupEventListeners() {
    orderBtn.addEventListener('click', showConfirmModal);
    cancelBtn.addEventListener('click', () => closeModal(confirmModal));
    confirmBtn.addEventListener('click', confirmOrder);
    closeBtn.addEventListener('click', () => closeModal(successModal));

    // モーダルの外側をクリックしたら閉じる
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeModal(confirmModal);
        }
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal(successModal);
        }
    });
}

// アプリケーション開始
init();
