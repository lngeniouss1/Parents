// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Обработка перехода на страницу товара
    document.querySelectorAll('.product-link, .quick-view').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('quick-view')) {
                e.preventDefault();
                const productId = this.getAttribute('data-id');
                // Здесь можно реализовать модальное окно быстрого просмотра
                // или сразу перейти на страницу товара
                window.location.href = `product.html?id=${productId}`;
            }
        });
    });

    // Обработка параметров URL для загрузки нужного товара
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        // Здесь можно загружать данные товара по ID
        // Например, через fetch или используя заранее подготовленные данные
        console.log(`Загрузка данных для товара: ${productId}`);
    }

    // Инициализация галереи товара
    function initGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');
        
        if (thumbnails && mainImage) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Удаляем активный класс у всех миниатюр
                    thumbnails.forEach(t => t.classList.remove('active'));
                    
                    // Добавляем активный класс к текущей миниатюре
                    this.classList.add('active');
                    
                    // Меняем основное изображение
                    const newSrc = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                    mainImage.src = newSrc;
                });
            });
        }
    }

    // Инициализация табов
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Скрываем все табы
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Убираем активный класс у всех кнопок
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Показываем выбранный таб
                document.getElementById(tabId).classList.add('active');
                this.classList.add('active');
            });
        });
    }

    // Инициализация выбора цвета
    function initColorSelector() {
        const colorOptions = document.querySelectorAll('.color-option');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                // Здесь можно обновить изображения в зависимости от выбранного цвета
            });
        });
    }

    // Инициализация количества товара
    function initQuantitySelector() {
        const minusBtns = document.querySelectorAll('.quantity-btn.minus');
        const plusBtns = document.querySelectorAll('.quantity-btn.plus');
        const quantityInputs = document.querySelectorAll('.quantity-selector input');
        
        minusBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const input = this.parentNode.querySelector('input');
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });
        });
        
        plusBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const input = this.parentNode.querySelector('input');
                input.value = parseInt(input.value) + 1;
            });
        });
    }

    // Инициализация всех функций
    initGallery();
    initTabs();
    initColorSelector();
    initQuantitySelector();

    // Обработка добавления в корзину
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = urlParams.get('id') || 'stroller-abc-premium';
            const quantity = document.querySelector('.quantity-selector input').value;
            const color = document.querySelector('.color-option.active').getAttribute('data-color');
            
            // Здесь можно добавить логику добавления в корзину
            console.log(`Добавлено в корзину: ${productId}, количество: ${quantity}, цвет: ${color}`);
            
            // Показываем уведомление
            showNotification('Товар добавлен в корзину');
            
            // Обновляем счетчик корзины
            updateCartCount();
        });
    });

    // Функция показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            let count = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = count + 1;
            cartCount.classList.add('pulse');
            
            setTimeout(() => {
                cartCount.classList.remove('pulse');
            }, 500);
        }
    }
});
// Обработка страницы контактов
function initContactsPage() {
    // Обработка формы обратной связи
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            const name = this.elements['name'].value.trim();
            const email = this.elements['email'].value.trim();
            const message = this.elements['message'].value.trim();
            
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            if (!this.elements['agreement'].checked) {
                showNotification('Необходимо согласие на обработку данных', 'error');
                return;
            }
            
            // Здесь должна быть отправка формы на сервер
            // Для демонстрации просто покажем сообщение об успехе
            showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
            this.reset();
        });
    }
    
    // Инициализация FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            answer.classList.toggle('active');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
}

// Показываем уведомление
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.contacts-page')) {
        initContactsPage();
    }
});