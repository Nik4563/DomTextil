// Выбрать все товары
document.getElementById('selectAll').addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.item-check');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

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