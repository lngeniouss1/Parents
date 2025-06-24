document.addEventListener('DOMContentLoaded', function() {
    // Обработка перехода на страницу товара
    document.querySelectorAll('.product-link, .quick-view').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('quick-view')) {
                e.preventDefault();
                const productId = this.getAttribute('data-id');
                window.location.href = `product.html?id=${productId}`;
            }
        });
    });

    // Обработка параметров URL для загрузки нужного товара
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'stroller-abc-premium'; // Default product ID
    
    if (productId) {
        console.log(`Загрузка данных для товара: ${productId}`);
    }

    // Инициализация галереи товара
    function initGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');
        const zoomBtn = document.querySelector('.zoom-btn');
        
        if (thumbnails && mainImage) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    const newSrc = this.querySelector('img').src;
                    mainImage.src = newSrc;
                    // Open lightbox on thumbnail click
                    openLightbox(this.dataset.large || newSrc);
                });
            });
        }

        if (zoomBtn && mainImage) {
            zoomBtn.addEventListener('click', function() {
                openLightbox(mainImage.src);
            });
        }
    }

    // Lightbox для увеличенного просмотра изображений
    function initLightbox() {
        let lightbox = document.querySelector('.lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="" alt="Увеличенное изображение">
                    <button class="lightbox-close"><i class="fas fa-times"></i></button>
                </div>
            `;
            document.body.appendChild(lightbox);

            const style = document.createElement('style');
            style.textContent = `
                .lightbox {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    z-index: 10001;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .lightbox.show {
                    display: flex;
                    opacity: 1;
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .lightbox-close {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    width: 40px;
                    height: 40px;
                    background: #fff;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    color: #333;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lightbox-close:hover {
                    background: #f0f0f0;
                }
            `;
            document.head.appendChild(style);
        }

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    function openLightbox(imageSrc) {
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = imageSrc;
        lightbox.classList.add('show');
    }

    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        lightbox.classList.remove('show');
    }

    // Инициализация формы отзывов
    function initReviewForm() {
        const reviewForm = document.getElementById('reviewForm');
        const reviewsList = document.querySelector('.reviews-list');
        const reviewsCount = document.querySelector('.reviews-count');
        const averageRating = document.querySelector('.average-rating');
        const totalReviews = document.querySelector('.total-reviews');

        if (!reviewForm || !reviewsList) {
            console.warn('Review form or reviews list not found. Check DOM structure.');
            return;
        }

        // Load existing reviews from localStorage
        let storedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]');
        console.log('Loaded reviews from localStorage:', storedReviews);

        // Append stored reviews
        storedReviews.forEach(review => appendReview(review));

        // Update reviews summary
        updateReviewsSummary(storedReviews);

        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');

            const author = this.querySelector('#review-author').value.trim();
            const rating = parseInt(this.querySelector('#review-rating').value);
            const title = this.querySelector('#review-title').value.trim();
            const text = this.querySelector('#review-text').value.trim();

            console.log('Form data:', { author, rating, title, text });

            if (!author || !title || !text || isNaN(rating)) {
                showNotification('Пожалуйста, заполните все поля корректно', 'error');
                return;
            }

            const review = {
                author,
                rating,
                title,
                text,
                date: new Date().toLocaleDateString('ru-RU')
            };

            // Save to localStorage
            storedReviews.push(review);
            try {
                localStorage.setItem(`reviews_${productId}`, JSON.stringify(storedReviews));
                console.log('Review saved to localStorage:', review);
            } catch (error) {
                console.error('Failed to save review to localStorage:', error);
                showNotification('Ошибка при сохранении отзыва. Проверьте настройки браузера.', 'error');
                return;
            }

            // Append new review
            appendReview(review);

            // Update summary
            updateReviewsSummary(storedReviews);

            // Reset form and notify
            this.reset();
            showNotification('Отзыв успешно добавлен!', 'success');
        });

        function appendReview(review) {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <div class="review-author">${review.author}</div>
                    <div class="review-date">${review.date}</div>
                    <div class="review-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <h3>${review.title}</h3>
                    <p>${review.text}</p>
                </div>
            `;
            reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
        }

        function updateReviewsSummary(reviews) {
            const total = reviews.length;
            const avg = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 4.5;
            if (reviewsCount) reviewsCount.textContent = `(${total + 12} отзывов)`;
            if (averageRating) averageRating.textContent = avg;
            if (totalReviews) totalReviews.textContent = `${total + 12} отзывов`;
            const starsContainer = document.querySelector('.rating-summary .stars');
            if (starsContainer) {
                const fullStars = Math.floor(avg);
                const halfStar = avg % 1 >= 0.5 ? 1 : 0;
                starsContainer.innerHTML = `
                    ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
                    ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    ${'<i class="far fa-star"></i>'.repeat(5 - fullStars - halfStar)}
                `;
            }
        }
    }

    // Инициализация табов
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                tabContents.forEach(content => content.classList.remove('active'));
                tabButtons.forEach(btn => btn.classList.remove('active'));
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

    // Обработка добавления в корзину
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantity = document.querySelector('.quantity-selector input')?.value || 1;
            const color = document.querySelector('.color-option.active')?.getAttribute('data-color') || 'default';
            console.log(`Добавлено в корзину: ${productId}, количество: ${quantity}, цвет: ${color}`);
            showNotification('Товар добавлен в корзину');
            updateCartCount();
        });
    });

    // Функция показа уведомления
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

    // Слайдер на главной странице
    function initSlider() {
        const slider = document.querySelector('.slider');
        if (!slider) return;

        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        const slideInterval = setInterval(nextSlide, 5000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                currentSlide = index;
                showSlide(index);
                setTimeout(() => setInterval(nextSlide, 5000), 10000);
            });
        });

        showSlide(currentSlide);
    }

    // Анимация при скроллинге
    function initScrollAnimation() {
        const elements = document.querySelectorAll('.info-block, .cta');
        if (!elements.length) return;

        function checkScroll() {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.8) {
                    el.classList.add('animate');
                }
            });
        }

        window.addEventListener('scroll', checkScroll);
        checkScroll();
    }

    // Поиск, фильтрация и пагинация в каталоге
    function initCatalog() {
        const searchInput = document.querySelector('#search-input');
        const sortSelect = document.querySelector('#sort-select');
        const categorySelect = document.querySelector('#category-select');
        const productList = document.querySelector('.product-list');
        const productCards = document.querySelectorAll('.product-card');

        if (!searchInput || !sortSelect || !categorySelect || !productList || !productCards.length) {
            console.warn('Один или несколько элементов каталога не найдены. Поиск и фильтрация не инициализированы.');
            return;
        }

        const products = Array.from(productCards).map(card => {
            const priceText = card.querySelector('.current-price')?.textContent || '0 ₽';
            const ratingText = card.querySelector('.rating')?.textContent || '★ 0';
            return {
                element: card,
                title: card.querySelector('.product-link')?.textContent.toLowerCase() || '',
                price: parseFloat(priceText.replace(' ₽', '').replace(' ', '')) || 0,
                rating: parseFloat(ratingText.replace('★ ', '')) || 0,
                category: card.dataset.category || 'all'
            };
        });

        function filterAndSort() {
            const searchText = searchInput.value.toLowerCase().trim();
            const sortValue = sortSelect.value;
            const categoryValue = categorySelect.value;

            console.log('Фильтрация:', { searchText, sortValue, categoryValue });

            let filteredProducts = products.filter(product => 
                product.title.includes(searchText) &&
                (categoryValue === 'all' || product.category === categoryValue)
            );

            filteredProducts.sort((a, b) => {
                console.log('Сортировка по:', sortValue);
                switch (sortValue) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'rating':
                        return b.rating - a.rating;
                    case 'name':
                        return a.title.localeCompare(b.title);
                    default:
                        return 0;
                }
            });

            console.log('Отфильтрованные продукты:', filteredProducts);

            productCards.forEach(card => {
                card.style.display = 'none';
            });
            filteredProducts.forEach(product => {
                product.element.style.display = 'block';
            });

            updatePagination(filteredProducts);
        }

        const itemsPerPage = 3;
        let currentPage = 1;

        function updatePagination(filteredProducts) {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            let pagination = document.querySelector('.pagination');
            
            if (!pagination) {
                pagination = document.createElement('div');
                pagination.className = 'pagination';
                productList.insertAdjacentElement('afterend', pagination);
            }

            pagination.innerHTML = '';

            filteredProducts.forEach((product, index) => {
                product.element.style.display = 
                    index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage 
                    ? 'block' : 'none';
            });

            if (filteredProducts.length > 0) {
                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i;
                    button.classList.add('pagination-btn');
                    if (i === currentPage) button.classList.add('active');
                    button.addEventListener('click', () => {
                        currentPage = i;
                        filterAndSort();
                    });
                    pagination.appendChild(button);
                }
            } else {
                pagination.innerHTML = '<p>Товары не найдены.</p>';
            }

            console.log('Пагинация обновлена:', { totalPages, currentPage });
        }

        searchInput.addEventListener('input', () => {
            currentPage = 1;
            filterAndSort();
        });

        sortSelect.addEventListener('change', () => {
            currentPage = 1;
            console.log('Сортировка изменена:', sortSelect.value);
            filterAndSort();
        });

        categorySelect.addEventListener('change', () => {
            currentPage = 1;
            filterAndSort();
        });

        filterAndSort();
    }

    // Инициализация всех функций
    initLightbox();
    initGallery();
    initTabs();
    initColorSelector();
    initQuantitySelector();
    initSlider();
    initScrollAnimation();
    initCatalog();
    if (document.querySelector('.product-page')) {
        initReviewForm();
    }
});

// Обработка страницы контактов
function initContactsPage() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
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
            
            showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
            this.reset();
        });
    }
    
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

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.contacts-page')) {
        initContactsPage();
    }
});