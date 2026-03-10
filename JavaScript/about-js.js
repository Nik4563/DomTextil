const galleryImages = [
    {
        src: 'Pictures/shveika.jpg',
        description: 'Современное производство компании "ДомТекстиля" — здесь работает наша команда профессионалов'
    },
    {
        src: 'Pictures/mnogoigolka.jpg',
        description: 'Производственный цех — современное оборудование для пошива текстиля'
    },
    {
        src: 'Pictures/odnoigolka.jpg',
        description: 'Одноигольная машина — тщательный контроль каждого изделия'
    },
    {
        src: 'Pictures/sklad.jpg',
        description: 'Склад готовой продукции — всегда в наличии большой ассортимент'
    }
];

let currentGalleryIndex = 0;
let galleryInterval;

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    startAutoSlide();
    
    // Остановка автоперелистывания при наведении
    const galleryMain = document.querySelector('.gallery-main');
    if (galleryMain) {
        galleryMain.addEventListener('mouseenter', () => clearInterval(galleryInterval));
        galleryMain.addEventListener('mouseleave', startAutoSlide);
    }
});

function initGallery() {
    const thumbnailsContainer = document.getElementById('galleryThumbnails');
    const dotsContainer = document.getElementById('galleryDots');
    
    galleryImages.forEach((image, index) => {
        // Миниатюра
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb' + (index === 0 ? ' active' : '');
        thumb.onclick = () => setGalleryImage(index);
        
        const thumbImg = document.createElement('img');
        thumbImg.src = image.src;
        thumbImg.alt = 'Фото ' + (index + 1);
        
        thumb.appendChild(thumbImg);
        thumbnailsContainer.appendChild(thumb);
        
        // Точка-индикатор
        const dot = document.createElement('div');
        dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => setGalleryImage(index);
        dotsContainer.appendChild(dot);
    });
}

function setGalleryImage(index) {
    currentGalleryIndex = index;
    updateGallery();
}

function changeGalleryImage(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    updateGallery();
}

function updateGallery() {
    const mainImage = document.getElementById('galleryImage');
    const description = document.getElementById('galleryDescription');
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    const dots = document.querySelectorAll('.gallery-dot');
    
    // Обновляем основное изображение с анимацией
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = galleryImages[currentGalleryIndex].src;
        mainImage.style.opacity = '1';
    }, 200);
    
    // Обновляем описание
    if (description) {
        description.style.opacity = '0';
        setTimeout(() => {
            description.textContent = galleryImages[currentGalleryIndex].description;
            description.style.opacity = '1';
        }, 200);
    }
    
    // Обновляем активные миниатюры
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentGalleryIndex);
    });
    
    // Обновляем точки
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGalleryIndex);
    });
}

// Автоматическое перелистывание
function startAutoSlide() {
    // Очищаем предыдущий интервал, если есть
    if (galleryInterval) {
        clearInterval(galleryInterval);
    }
    galleryInterval = setInterval(() => {
        changeGalleryImage(1);
    }, 5000);
}