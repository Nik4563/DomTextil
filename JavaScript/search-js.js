// ===== СИСТЕМА ПОИСКА ТОВАРОВ =====

// База данных товаров
const productsDatabase = [
    {
        id: 1,
        name: 'Одеяло ВАУ',
        price: 1000,
        oldPrice: 1500,
        image: 'Pictures/odeyalo_sintepon.jpg',
        category: 'Одеяла',
        link: 'product.html'
    },
    {
        id: 2,
        name: 'Одеяло ВАУ Лёгкое',
        price: 430,
        oldPrice: 550,
        image: 'Pictures/odeyalo_sintepon2.jpg',
        category: 'Одеяла',
        link: 'product.html'
    },
    {
        id: 3,
        name: 'Одеяло ВАУ Стандарт',
        price: 380,
        oldPrice: 480,
        image: 'Pictures/odeyalo_sintepon.jpg',
        category: 'Одеяла',
        link: 'product.html'
    },
    {
        id: 4,
        name: 'Одеяло ВАУ Премиум',
        price: 430,
        oldPrice: 520,
        image: 'Pictures/odeyalo_sintepon2.jpg',
        category: 'Одеяла',
        link: 'product.html'
    },
    {
        id: 5,
        name: 'Одеяло ВАУ Эконом',
        price: 330,
        oldPrice: 450,
        image: 'Pictures/odeyalo_sintepon.jpg',
        category: 'Одеяла',
        link: 'product.html'
    },
    {
        id: 6,
        name: 'Подушка Classic',
        price: 450,
        oldPrice: 600,
        image: 'Pictures/odeyalo_sintepon.jpg',
        category: 'Подушки',
        link: 'product.html'
    },
    {
        id: 7,
        name: 'Подушка Comfort',
        price: 550,
        oldPrice: 700,
        image: 'Pictures/odeyalo_sintepon2.jpg',
        category: 'Подушки',
        link: 'product.html'
    },
    {
        id: 8,
        name: 'Комплект белья Classic',
        price: 1200,
        oldPrice: 1500,
        image: 'Pictures/odeyalo_sintepon.jpg',
        category: 'Комплекты постельного белья',
        link: 'product.html'
    },
    {
        id: 9,
        name: 'Плед Soft',
        price: 800,
        oldPrice: 1000,
        image: 'Pictures/odeyalo_sintepon2.jpg',
        category: 'Пледы и покрывала',
        link: 'product.html'
    },
    {
        id: 10,
        name: 'Полотенце махровое',
        price: 250,
        oldPrice: 350,
        image: 'Pictures/odeyalo_sintepon.jpg',
        category: 'Полотенца',
        link: 'product.html'
    }
];

// DOM элементы
let searchInput, searchResults, searchOverlay;

// Инициализация поиска
function initSearch() {
    searchInput = document.querySelector('.search-box input');
    
    if (!searchInput) return;
    
    // Создаём контейнер для результатов
    createSearchResultsContainer();
    
    // Создаём оверлей
    createSearchOverlay();
    
    // Обработчики событий для input
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // При фокусе показываем результаты если есть текст
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            // Закрываем каталог если открыт
            closeCatalogIfOpen();
            showSearchResults();
        }
    });
    
    // Предотвращаем закрытие при клике на input
    searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Закрытие по клику вне поиска (с проверкой)
    document.addEventListener('click', (e) => {
        const searchBox = document.querySelector('.search-box');
        const resultsContainer = document.querySelector('.search-results');
        
        // Проверяем, что клик не по поисковой строке и не по результатам
        const isClickInsideSearch = searchBox && searchBox.contains(e.target);
        const isClickInsideResults = resultsContainer && resultsContainer.contains(e.target);
        
        if (!isClickInsideSearch && !isClickInsideResults) {
            hideSearchResults();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideSearchResults();
            searchInput.blur();
        }
    });
    
    // Слушаем открытие каталога чтобы закрыть поиск
    document.addEventListener('catalogOpened', () => {
        hideSearchResults();
    });
}

function closeCatalogIfOpen() {
    const catalogMenu = document.getElementById('catalogMenu');
    const catalogBtn = document.getElementById('catalogBtn');
    const catalogOverlay = document.querySelector('.catalog-overlay');
    
    if (catalogMenu && catalogMenu.classList.contains('active')) {
        catalogMenu.classList.remove('active');
        if (catalogBtn) catalogBtn.classList.remove('active');
        if (catalogOverlay) catalogOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Создание контейнера результатов поиска
function createSearchResultsContainer() {
    // Проверяем, не создан ли уже
    if (document.querySelector('.search-results')) return;
    
    searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.innerHTML = `
        <div class="search-results-header">
            <span class="search-results-title">Результаты поиска</span>
            <button class="search-results-close" title="Закрыть">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="search-results-list"></div>
        <div class="search-results-footer">
            <a href="catalog-odeyala.html" class="search-view-all">Смотреть все товары</a>
        </div>
    `;
    
    // Вставляем в body, а не в search-box (чтобы избежать проблем с вложенностью)
    searchResults.style.position = 'fixed';
    document.body.appendChild(searchResults);
    
    // Обработчик закрытия
    searchResults.querySelector('.search-results-close').addEventListener('click', (e) => {
        e.stopPropagation();
        hideSearchResults();
    });
    
    // Предотвращаем закрытие при клике на результаты
    searchResults.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Создание оверлея
function createSearchOverlay() {
    if (document.querySelector('.search-overlay')) return;
    
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    document.body.appendChild(searchOverlay);
    
    searchOverlay.addEventListener('click', hideSearchResults);
}

// Debounce функция для оптимизации
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обработка поиска
function handleSearch(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        hideSearchResults();
        return;
    }
    
    const results = searchProducts(query);
    renderSearchResults(results, query);
}

// Поиск товаров (РЕГИСТРО-НЕЗАВИСИМЫЙ)
function searchProducts(query) {
    const lowerQuery = query.toLowerCase(); // Приводим запрос к нижнему регистру
    
    return productsDatabase.filter(product => {
        // Приводим название и категорию к нижнему регистру для сравнения
        const searchText = `${product.name} ${product.category}`.toLowerCase();
        return searchText.includes(lowerQuery);
    }).slice(0, 8); // Максимум 8 результатов
}

// Отрисовка результатов
function renderSearchResults(results, query) {
    const resultsList = searchResults.querySelector('.search-results-list');
    const resultsTitle = searchResults.querySelector('.search-results-title');
    
    if (results.length === 0) {
        resultsList.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>По запросу "${escapeHtml(query)}" ничего не найдено</p>
                <span>Попробуйте изменить запрос</span>
            </div>
        `;
        resultsTitle.textContent = 'Ничего не найдено';
    } else {
        resultsList.innerHTML = results.map(product => `
            <a href="${product.link}" class="search-result-item" onclick="handleResultClick(event)">
                <div class="search-result-image">
                    <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
                </div>
                <div class="search-result-info">
                    <h4 class="search-result-name">${highlightMatch(product.name, query)}</h4>
                    <span class="search-result-category">${escapeHtml(product.category)}</span>
                    <div class="search-result-price-row">
                        <span class="search-result-price">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="search-result-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                </div>
                <div class="search-result-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        `).join('');
        
        const countText = results.length === 1 ? '1 товар' : 
                         results.length < 5 ? `${results.length} товара` : 
                         `${results.length} товаров`;
        resultsTitle.textContent = `Найдено: ${countText}`;
    }
    
    showSearchResults();
    positionSearchResults();
}

// Позиционирование результатов
function positionSearchResults() {
    const isMobile = window.innerWidth <= 768;
    const headerBottom = document.querySelector('.header-bottom');
    
    if (!searchResults) return;
    
    if (isMobile && headerBottom) {
        // На мобильных — фиксированная позиция под шапкой
        const headerHeight = headerBottom.getBoundingClientRect().bottom;
        searchResults.style.top = (headerHeight + 5) + 'px';
    } else {
        // На десктопе — под поисковой строкой
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            const rect = searchBox.getBoundingClientRect();
            searchResults.style.top = (rect.bottom + window.scrollY + 10) + 'px';
            searchResults.style.left = rect.left + 'px';
            searchResults.style.width = rect.width + 'px';
        }
    }
}

// Обработчик клика по результату
function handleResultClick(e) {
    // Разрешаем переход по ссылке
    hideSearchResults();
}

// Показать результаты
function showSearchResults() {
    searchResults.classList.add('active');
    searchOverlay.classList.add('active');
    document.body.classList.add('search-open');
}

// Скрыть результаты
function hideSearchResults() {
    if (searchResults) searchResults.classList.remove('active');
    if (searchOverlay) searchOverlay.classList.remove('active');
    document.body.classList.remove('search-open');
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Подсветка совпадений (РЕГИСТРО-НЕЗАВИСИМАЯ)
function highlightMatch(text, query) {
    // Создаём регистро-независимое регулярное выражение
    const escapedQuery = escapeHtml(query);
    // Флаги: g = global (все совпадения), i = ignore case (игнорировать регистр)
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Обновление позиции при ресайзе
window.addEventListener('resize', () => {
    if (searchResults && searchResults.classList.contains('active')) {
        positionSearchResults();
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initSearch);