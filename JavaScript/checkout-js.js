
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем ВЫБРАННЫЕ товары из корзины
    loadOrderItems();
    
    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                
                formattedValue = '+7';
                
                if (value.length > 0) {
                    formattedValue += ' (' + value.substring(0, 3);
                }
                if (value.length >= 3) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                if (value.length >= 6) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                if (value.length >= 8) {
                    formattedValue += '-' + value.substring(8, 10);
                }
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Обработка отправки формы
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            // Собираем данные заказа ТОЛЬКО из выбранных товаров
            const orderData = collectOrderData();
            
            // Проверяем, есть ли выбранные товары
            if (orderData.items.length === 0) {
                alert('Пожалуйста, выберите товары для заказа');
                window.location.href = 'cart.html';
                return;
            }
            
            // Имитация отправки на сервер
            console.log('Отправка заказа:', orderData);
            
            // Удаляем только выбранные товары из корзины
            removeOrderedItems();
            
            // Показываем уведомление об успешном заказе
            showOrderSuccess(orderData.orderNumber);
            
            // Обновляем шапку
            if (typeof updateCartUI === 'function') {
                updateCartUI();
            }
        });
    }
});

// Загрузка ВЫБРАННЫХ товаров из корзины
function loadOrderItems() {
    const cart = getCart();
    const selectedItems = cart.filter(item => item.checked);
    
    const orderItemsList = document.querySelector('.order-items-list');
    const orderTotalDesktop = document.querySelector('.order-total-desktop');
    const orderSummaryMobile = document.querySelector('.order-summary-mobile');
    
    // Если нет выбранных товаров, перенаправляем на страницу корзины
    if (selectedItems.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Рендерим только выбранные товары
    if (orderItemsList) {
        orderItemsList.innerHTML = selectedItems.map(item => `
            <div class="order-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <p class="item-category">${item.description || 'Товар'}</p>
                </div>
                <div class="item-quantity">${item.quantity} шт.</div>
                <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
        `).join('');
    }
    
    // Рассчитываем итоги ТОЛЬКО по выбранным товарам
    const totals = calculateOrderTotals(selectedItems);
    
    // Обновляем суммы на десктопе
    if (orderTotalDesktop) {
        orderTotalDesktop.innerHTML = `
            <div class="summary-row">
                <span>Товары (${totals.totalItems} шт.)</span>
                <span>${formatPrice(totals.subtotal)}</span>
            </div>
            ${totals.discount > 0 ? `
            <div class="summary-row discount">
                <span>Скидка</span>
                <span>-${formatPrice(totals.discount)}</span>
            </div>
            ` : ''}
            <div class="summary-row total">
                <span>Итого к оплате</span>
                <span>${formatPrice(totals.total)}</span>
            </div>
        `;
    }
    
    // Обновляем суммы на мобильном
    if (orderSummaryMobile) {
        orderSummaryMobile.innerHTML = `
            <div class="summary-row">
                <span>Товары (${totals.totalItems} шт.)</span>
                <span>${formatPrice(totals.subtotal)}</span>
            </div>
            ${totals.discount > 0 ? `
            <div class="summary-row discount">
                <span>Скидка</span>
                <span>-${formatPrice(totals.discount)}</span>
            </div>
            ` : ''}
            <div class="summary-row total">
                <span>Итого к оплате</span>
                <span>${formatPrice(totals.total)}</span>
            </div>
        `;
    }
    
    // Обновляем шапку — показываем общее количество ВСЕХ товаров в корзине
    const allTotals = calculateOrderTotals(cart);
    updateHeaderTotals(allTotals.total, allTotals.totalItems);
}

// Получить корзину
function getCart() {
    const cart = localStorage.getItem('domtextilya_cart');
    return cart ? JSON.parse(cart) : [];
}

// Рассчитать итоги заказа (принимает массив товаров)
function calculateOrderTotals(items) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const oldTotal = items.reduce((sum, item) => {
        const oldPrice = item.oldPrice || item.price;
        return sum + (oldPrice * item.quantity);
    }, 0);
    const discount = oldTotal - subtotal;
    
    return {
        totalItems,
        subtotal,
        discount,
        total: subtotal
    };
}

// Формат цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// Обновить суммы в шапке
function updateHeaderTotals(total, count) {
    const cartBadge = document.getElementById('cartBadge');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (cartTotal) {
        cartTotal.textContent = formatPrice(total);
    }
}

// Удалить только заказанные товары из корзины
function removeOrderedItems() {
    const cart = getCart();
    // Оставляем только НЕ выбранные товары
    const remainingItems = cart.filter(item => !item.checked);
    
    if (remainingItems.length > 0) {
        localStorage.setItem('domtextilya_cart', JSON.stringify(remainingItems));
    } else {
        localStorage.removeItem('domtextilya_cart');
    }
}

// Валидация формы
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('#checkoutForm [required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightError(field);
        } else {
            removeError(field);
        }
    });
    
    // Проверка телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput && phoneInput.value) {
        const phoneDigits = phoneInput.value.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            isValid = false;
            highlightError(phoneInput);
        }
    }
    
    return isValid;
}

// Подсветка ошибки
function highlightError(field) {
    field.style.borderBottomColor = '#e31e24';
    field.style.boxShadow = '0 2px 0 0 rgba(227, 30, 36, 0.3)';
    
    field.addEventListener('input', function() {
        removeError(field);
    }, { once: true });
}

// Удаление подсветки ошибки
function removeError(field) {
    field.style.borderBottomColor = '';
    field.style.boxShadow = '';
}

// Собрать данные заказа — ТОЛЬКО выбранные товары
function collectOrderData() {
    const cart = getCart();
    const selectedItems = cart.filter(item => item.checked);
    const formData = new FormData(document.getElementById('checkoutForm'));
    const orderNumber = generateOrderNumber();
    
    return {
        customer: {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            street: formData.get('street'),
            house: formData.get('house')
        },
        payment: formData.get('payment'),
        items: selectedItems,
        totals: calculateOrderTotals(selectedItems),
        orderDate: new Date().toISOString(),
        orderNumber: orderNumber
    };
}

// Генерация номера заказа
function generateOrderNumber() {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return 'DT-' + date.getFullYear() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + '-' + random;
}

// Показать уведомление об успешном заказе
function showOrderSuccess(orderNumber) {
    const contentContainer = document.querySelector('.content-container');
    
    // Скрываем форму и состав заказа
    const checkoutLayout = document.querySelector('.checkout-layout');
    if (checkoutLayout) {
        checkoutLayout.style.display = 'none';
    }
    
    // Скрываем заголовок
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.style.display = 'none';
    }
    
    // Обновляем хлебные крошки
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (breadcrumbs) {
        breadcrumbs.innerHTML = `
            <a href="index.html">Главная</a>
            <span class="separator">/</span>
            <span class="current">Заказ принят</span>
        `;
    }
    
    // Создаем уведомление
    const successBlock = document.createElement('div');
    successBlock.className = 'order-success-block';
    successBlock.innerHTML = `
        <div class="success-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 class="success-title">Заказ успешно оформлен!</h2>
        <p class="success-number">Номер вашего заказа: <strong>${orderNumber}</strong></p>
        <p class="success-text">
            Спасибо за покупку! Мы свяжемся с вами в ближайшее время для подтверждения заказа.
        </p>
        <div class="success-actions">
            <a href="catalog-odeyala.html" class="success-btn primary">
                <i class="fas fa-shopping-bag"></i>
                Продолжить покупки
            </a>
            <a href="index.html" class="success-btn secondary">
                <i class="fas fa-home"></i>
                На главную
            </a>
        </div>
    `;
    
    contentContainer.appendChild(successBlock);
    
    // Плавное появление
    setTimeout(() => {
        successBlock.classList.add('show');
    }, 100);
}