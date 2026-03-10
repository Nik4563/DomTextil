// ===== JavaScript для страницы контактов =====

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const phoneInput = document.getElementById('phone');
    
    // Маска для телефона
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
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверка валидации
        if (!validateForm()) {
            return;
        }
        
        // Сбор данных
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Имитация отправки (здесь должен быть AJAX запрос)
        console.log('Отправка данных:', data);
        
        // Показываем сообщение об успехе
        showSuccessMessage();
        
        // Очистка формы
        form.reset();
    });
    
    // Валидация формы
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                highlightError(field);
            } else {
                removeError(field);
            }
        });
        
        // Проверка email если заполнен
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            highlightError(emailField);
        }
        
        return isValid;
    }
    
    // Подсветка ошибки
    function highlightError(field) {
        field.style.borderColor = '#e31e24';
        field.style.boxShadow = '0 0 0 4px rgba(227, 30, 36, 0.1)';
        
        // Убираем подсветку при вводе
        field.addEventListener('input', function() {
            removeError(field);
        }, { once: true });
    }
    
    // Удаление подсветки ошибки
    function removeError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }
    
    // Проверка email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Показ сообщения об успехе
    function showSuccessMessage() {
        // Удаляем старое сообщение если есть
        const oldMessage = form.querySelector('.success-message');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        // Создаём новое сообщение
        const message = document.createElement('div');
        message.className = 'success-message show';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.';
        
        form.insertBefore(message, form.firstChild);
        
        // Прокручиваем к сообщению
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Удаляем сообщение через 5 секунд
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
});