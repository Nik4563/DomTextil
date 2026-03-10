// ===== КОРЗИНА С LOCALSTORAGE =====

const CART_KEY = 'domtextilya_cart';

// Получить корзину
function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Сохранить корзину
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

// Добавить товар
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity || 1;
    } else {
        cart.push({
            ...product,
            quantity: product.quantity || 1,
            checked: true
        });
    }
    
    saveCart(cart);
    showNotification('Товар добавлен в корзину!');
}

// Удалить товар
function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
}

// Изменить количество
function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart(cart);
        renderCart();
    }
}

// Переключить выбор
function toggleItemCheck(productId) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.checked = !item.checked;
        saveCart(cart);
        updateSummary();
    }
}

// Выбрать все
function toggleAll(checked) {
    const cart = getCart().map(item => ({ ...item, checked }));
    saveCart(cart);
    renderCart();
}

// Очистить корзину
function clearCart() {
    if (confirm('Очистить корзину?')) {
        localStorage.removeItem(CART_KEY);
        renderCart();
    }
}

// Получить выбранные
function getSelectedItems() {
    return getCart().filter(item => item.checked);
}

// Рассчитать итоги
function calculateTotals() {
    const selected = getSelectedItems();
    const totalItems = selected.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = selected.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const oldTotal = selected.reduce((sum, item) => {
        const oldPrice = item.oldPrice || item.price;
        return sum + (oldPrice * item.quantity);
    }, 0);
    const discount = oldTotal - subtotal;
    
    return { totalItems, subtotal, discount, oldTotal };
}

// Формат цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// Обновить UI в шапке
function updateCartUI() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = formatPrice(totalPrice);
    }
}

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Отрисовать корзину
function renderCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItems = document.getElementById('cartItems');
    
    if (!cartItems) return; // Не на странице корзины
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-id="${item.id}">
            <label class="item-checkbox">
                <input type="checkbox" class="item-check" ${item.checked ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <div class="item-image">
                <a href="${item.link || 'product.html'}">
                    <img src="${item.image}" alt="${item.name}">
                </a>
            </div>
            <div class="item-info">
                <a href="${item.link || 'product.html'}">
                    <h3 class="item-name">${item.name}</h3>
                    <div class="item-price-block">
                        <span class="item-price">${formatPrice(item.price)}</span>
                        ${item.oldPrice ? `<span class="item-old-price">${formatPrice(item.oldPrice)}</span>` : ''}
                    </div>
                    <p class="item-description">${item.description || ''}</p>
                </a>
            </div>
            <div class="item-quantity">
                <button class="qty-btn minus" data-action="minus"><i class="fas fa-minus"></i></button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn plus" data-action="plus"><i class="fas fa-plus"></i></button>
            </div>
            <div class="item-total">
                <span class="total-price">${formatPrice(item.price * item.quantity)}</span>
            </div>
            <button class="remove-btn" data-action="remove" title="Удалить">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Обработчики
    cartItems.querySelectorAll('.item-check').forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => toggleItemCheck(cart[index].id));
    });
    
    cartItems.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.cart-item');
            const id = parseInt(item.dataset.id);
            const action = btn.dataset.action;
            updateQuantity(id, action === 'plus' ? 1 : -1);
        });
    });
    
    cartItems.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.cart-item');
            const id = parseInt(item.dataset.id);
            removeFromCart(id);
        });
    });
    
    updateSummary();
}

// Обновить итоги
function updateSummary() {
    const { totalItems, subtotal, discount } = calculateTotals();
    
    const totalItemsEl = document.getElementById('totalItems');
    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    
    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    
    const finalTotalEl = document.getElementById('finalTotal');
    if (finalTotalEl) finalTotalEl.textContent = formatPrice(subtotal);
    
    const checkoutSummaryEl = document.getElementById('checkoutSummary');
    if (checkoutSummaryEl) checkoutSummaryEl.textContent = `${totalItems} шт. ${formatPrice(subtotal)}`;
    
    const discountRow = document.getElementById('discountRow');
    if (discountRow) {
        if (discount > 0) {
            discountRow.style.display = 'flex';
            const discountAmount = document.getElementById('discountAmount');
            if (discountAmount) discountAmount.textContent = `-${formatPrice(discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
}

// === ГЛОБАЛЬНЫЙ API ===
window.Cart = {
    add: addToCart,
    get: getCart,
    remove: removeFromCart,
    updateQuantity: updateQuantity,
    clear: clearCart,
    updateUI: updateCartUI
};

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Только для страницы корзины
    const selectAll = document.getElementById('selectAll');
    const clearCartBtn = document.getElementById('clearCart');
    const cartItems = document.getElementById('cartItems');
    
    if (cartItems) {
        renderCart();
        
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                toggleAll(this.checked);
            });
        }
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
    }
});