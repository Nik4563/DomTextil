const images = [
    'Pictures/odeyalo_sintepon.jpg',
    'Pictures/odeyalo_sintepon2.jpg',
    'Pictures/odeyalo_sintepon.jpg',
    'Pictures/odeyalo_sintepon2.jpg'
];

let currentImage = 0;

function setImage(index) {
    currentImage = index;
    document.getElementById('mainImage').src = images[index];

    // Обновляем активную миниатюру
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
document.querySelector('.favorite-btn').addEventListener('click', function () {
    const icon = this.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    this.classList.toggle('active');
});