const images = [
    'Pictures/odeyalo_sintepon.jpg',
    'Pictures/odeyalo_sintepon2.jpg',
    'Pictures/odeyalo_sintepon.jpg',
    'Pictures/odeyalo_sintepon2.jpg'
];

let currentImage = 0;

function setImage(index) {
    currentImage = index;
    const mainImage = document.getElementById('mainImage');
    if (mainImage) mainImage.src = images[index];

    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function changeImage(direction) {
    currentImage = (currentImage + direction + images.length) % images.length;
    setImage(currentImage);
}

// Изменение количества
document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const qtyValue = this.parentElement.querySelector('.qty-value');
        let value = parseInt(qtyValue.textContent);

        if (this.classList.contains('minus') && value > 1) {
            qtyValue.textContent = value - 1;
        } else if (this.classList.contains('plus')) {
            qtyValue.textContent = value + 1;
        }
    });
});

// Избранное
const favoriteBtn = document.querySelector('.favorite-btn');
if (favoriteBtn) {
    favoriteBtn.addEventListener('click', function () {
        const icon = this.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        this.classList.toggle('active');
    });
}

// === ДОБАВЛЕНИЕ В КОРЗИНУ ===
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.Cart === 'undefined') {
        console.warn('Cart не загружен. Проверьте порядок скриптов.');
        return;
    }
    
    // На странице товара
    const addToCartBtn = document.querySelector('.product-actions .add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const product = {
                id: 1,
                name: document.querySelector('.product-name')?.textContent?.trim() || 'Одеяло BAУ',
                price: parseInt(document.querySelector('.product-price')?.textContent?.replace(/\D/g, '')) || 1000,
                oldPrice: parseInt(document.querySelector('.product-old-price')?.textContent?.replace(/\D/g, '')) || null,
                image: document.getElementById('mainImage')?.src || 'Pictures/odeyalo_sintepon.jpg',
                description: 'Зимнее шелковистое одеяло BAУ',
                link: window.location.href
            };
            
            const qtyElement = document.querySelector('.qty-value');
            const quantity = qtyElement ? parseInt(qtyElement.textContent) : 1;
            
            window.Cart.add({...product, quantity: quantity});
            
            this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            this.style.background = '#4caf50';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
                this.style.background = '';
            }, 500);
        });
    }
    
    // На странице каталога
    document.querySelectorAll('.product-card .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            const link = card.querySelector('.product-link');
            
            const product = {
                id: Date.now(),
                name: (card.querySelector('.product-name') || card.querySelector('.product-card-name'))?.textContent?.trim() || 'Товар',
                price: parseInt((card.querySelector('.product-price') || card.querySelector('.product-card-price'))?.textContent?.replace(/\D/g, '')) || 0,
                oldPrice: parseInt((card.querySelector('.product-old-price') || card.querySelector('.product-card-old-price'))?.textContent?.replace(/\D/g, '')) || null,
                image: (card.querySelector('.product-image img') || card.querySelector('.product-card-img img'))?.src || '',
                description: (card.querySelector('.product-description') || card.querySelector('.product-card-desc'))?.textContent?.trim() || '',
                link: (card.querySelector('.product-link') || card.querySelector('.product-card-link'))?.href || 'product.html'
            };
            
            window.Cart.add(product);
            
            this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            this.style.background = '#4caf50';
            setTimeout(() => {
                this.innerHTML = 'В КОРЗИНУ';
                this.style.background = '';
            }, 1500);
        });
    });
});