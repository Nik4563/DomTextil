// ===== СИСТЕМА ОТЗЫВОВ С ЛАЙКАМИ/ДИЗЛАЙКАМИ =====

const REVIEWS_KEY = 'domtextilya_reviews';
const REVIEWS_VOTES_KEY = 'domtextilya_reviews_votes';

// Начальные данные отзывов
const defaultReviews = [
    {
        id: 1,
        name: 'Анна К.',
        initials: 'АК',
        date: '1 марта 2026',
        rating: 5,
        text: 'Отличное одеяло! Очень мягкое и лёгкое, при этом тёплое. После стирки не потеряло форму, быстро сохнет. Рекомендую!',
        image: 'Pictures/odeyalo_sintepon.jpg',
        likes: 5,
        dislikes: 0
    },
    {
        id: 2,
        name: 'Михаил П.',
        initials: 'МП',
        date: '10 марта 2026',
        rating: 4,
        text: 'Хорошее одеяло за свою цену. Материал приятный на ощупь, швы качественные. Единственный минус — немного тонковато для зимы, но для межсезонья самое то.',
        image: null,
        likes: 3,
        dislikes: 1
    },
    {
        id: 3,
        name: 'Елена С.',
        initials: 'ЕС',
        date: '5 марта 2026',
        rating: 5,
        text: 'Покупала одеяло для сына в общежитие. Он доволен, говорит очень удобное и не вызывает аллергии. Цена со скидкой приятно удивила!',
        image: null,
        likes: 8,
        dislikes: 0
    },
    {
        id: 4,
        name: 'Дмитрий В.',
        initials: 'ДВ',
        date: '15 марта 2026',
        rating: 4,
        text: 'Качество хорошее, но цвет немного отличается от фото. В целом доволен покупкой.',
        image: null,
        likes: 2,
        dislikes: 0
    },
    {
        id: 5,
        name: 'Ольга М.',
        initials: 'ОМ',
        date: '12 марта 2026',
        rating: 5,
        text: 'Уже второе одеяло покупаю в этом магазине. Качество отличное, доставка быстрая. Спасибо!',
        image: null,
        likes: 6,
        dislikes: 0
    },
    {
        id: 6,
        name: 'Сергей К.',
        initials: 'СК',
        date: '8 марта 2026',
        rating: 3,
        text: 'Одеяло нормальное, но ожидал большего за эту цену. Наполнитель мог бы быть плотнее.',
        image: null,
        likes: 1,
        dislikes: 2
    },
    {
        id: 7,
        name: 'Наталья Р.',
        initials: 'НР',
        date: '3 марта 2026',
        rating: 5,
        text: 'Прекрасное одеяло! Дочь аллергик, но на это одеяло никакой реакции. Очень рада что нашла!',
        image: null,
        likes: 4,
        dislikes: 0
    },
    {
        id: 8,
        name: 'Иван П.',
        initials: 'ИП',
        date: '18 марта 2026',
        rating: 4,
        text: 'Хороший товар, быстрая доставка. Минус - упаковка была повреждена, но само одеяло целое.',
        image: null,
        likes: 3,
        dislikes: 1
    },
    {
        id: 9,
        name: 'Марина Л.',
        initials: 'МЛ',
        date: '20 марта 2026',
        rating: 5,
        text: 'Супер! Одеяло лёгкое, но тёплое. Стирка переносит отлично, не скатывается.',
        image: null,
        likes: 7,
        dislikes: 0
    },
    {
        id: 10,
        name: 'Алексей Н.',
        initials: 'АН',
        date: '22 марта 2026',
        rating: 4,
        text: 'Купил для дачи. За такую цену - отличный вариант. Рекомендую.',
        image: null,
        likes: 2,
        dislikes: 0
    },
    {
        id: 11,
        name: 'Татьяна В.',
        initials: 'ТВ',
        date: '25 марта 2026',
        rating: 5,
        text: 'Очень довольна! Мягкое, приятное к телу. Сплю как младенец :)',
        image: null,
        likes: 5,
        dislikes: 0
    },
    {
        id: 12,
        name: 'Павел С.',
        initials: 'ПС',
        date: '27 марта 2026',
        rating: 4,
        text: 'Хорошее соотношение цены и качества. Брал по акции, доволен.',
        image: null,
        likes: 3,
        dislikes: 0
    }
];

// Получить отзывы из localStorage или использовать дефолтные
function getReviews() {
    const stored = localStorage.getItem(REVIEWS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(defaultReviews));
    return defaultReviews;
}

// Сохранить отзывы
function saveReviews(reviews) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// Получить голоса пользователя
function getUserVotes() {
    const stored = localStorage.getItem(REVIEWS_VOTES_KEY);
    return stored ? JSON.parse(stored) : {};
}

// Сохранить голос пользователя
function saveUserVote(reviewId, voteType) {
    const votes = getUserVotes();
    votes[reviewId] = voteType;
    localStorage.setItem(REVIEWS_VOTES_KEY, JSON.stringify(votes));
}

// Рассчитать средний рейтинг
function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
}

// Рассчитать распределение по оценкам
function calculateRatingDistribution(reviews) {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
        if (distribution[review.rating] !== undefined) {
            distribution[review.rating]++;
        }
    });
    return distribution;
}

// Сгенерировать HTML звёзд
function generateStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            html += '<i class="fas fa-star-half-alt"></i>';
        } else {
            html += '<i class="far fa-star"></i>';
        }
    }
    return html;
}

// Отрендерить отзывы
function renderReviews(showAll = false) {
    const reviews = getReviews();
    const reviewsList = document.getElementById('reviewsList');
    const showMoreBtn = document.getElementById('showMoreReviews');
    const userVotes = getUserVotes();
    
    if (!reviewsList) return;
    
    updateReviewStats(reviews);
    
    const displayCount = showAll ? reviews.length : 3;
    const displayReviews = reviews.slice(0, displayCount);
    
    if (showMoreBtn) {
        if (reviews.length <= 3 || showAll) {
            showMoreBtn.style.display = 'none';
        } else {
            showMoreBtn.style.display = 'block';
            showMoreBtn.textContent = showAll ? 'Скрыть отзывы' : 'Показать все отзывы';
        }
    }
    
    reviewsList.innerHTML = displayReviews.map(review => {
        const userVote = userVotes[review.id];
        const likeClass = userVote === 'like' ? 'active' : '';
        const dislikeClass = userVote === 'dislike' ? 'active' : '';
        const likeIcon = userVote === 'like' ? 'fas' : 'far';
        const dislikeIcon = userVote === 'dislike' ? 'fas' : 'far';
        
        return `
            <div class="review-item" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.initials}</div>
                        <div class="reviewer-details">
                            <span class="reviewer-name">${review.name}</span>
                            <span class="review-date">${review.date}</span>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
                ${review.image ? `<div class="review-images"><img src="${review.image}" alt="Фото отзыва"></div>` : ''}
                <div class="review-actions">
                    <button class="review-like like-btn ${likeClass}" data-action="like" data-review-id="${review.id}">
                        <i class="${likeIcon} fa-thumbs-up"></i>
                        <span class="like-count">${review.likes}</span>
                    </button>
                    <button class="review-like dislike-btn ${dislikeClass}" data-action="dislike" data-review-id="${review.id}">
                        <i class="${dislikeIcon} fa-thumbs-down"></i>
                        <span class="dislike-count">${review.dislikes}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    attachReviewHandlers();
}

// Обновить статистику отзывов
function updateReviewStats(reviews) {
    const averageRating = calculateAverageRating(reviews);
    const count = reviews.length;
    const distribution = calculateRatingDistribution(reviews);
    
    // Обновляем в сводке
    const averageRatingEl = document.getElementById('averageRating');
    const summaryStarsEl = document.getElementById('summaryStars');
    const reviewsCountEl = document.getElementById('reviewsCount');
    
    if (averageRatingEl) averageRatingEl.textContent = averageRating;
    if (summaryStarsEl) summaryStarsEl.innerHTML = generateStars(parseFloat(averageRating));
    if (reviewsCountEl) {
        let countText;
        if (count % 10 === 1 && count % 100 !== 11) {
            countText = `${count} отзыв`;
        } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
            countText = `${count} отзыва`;
        } else {
            countText = `${count} отзывов`;
        }
        reviewsCountEl.textContent = countText;
    }
    
    // Обновляем в блоке товара
    const productStarsEl = document.getElementById('productStars');
    const ratingCountEl = document.getElementById('ratingCount');
    
    if (productStarsEl) productStarsEl.innerHTML = generateStars(parseFloat(averageRating));
    if (ratingCountEl) {
        ratingCountEl.textContent = `${averageRating} (${count} отзывов)`;
    }
    
    // Обновляем распределение по звёздам
    updateRatingBars(distribution, count);
}

// Обновить полоски рейтинга
function updateRatingBars(distribution, total) {
    const ratingBarsContainer = document.getElementById('ratingBars');
    if (!ratingBarsContainer) return;
    
    const maxCount = Math.max(...Object.values(distribution));
    
    ratingBarsContainer.innerHTML = Object.entries(distribution)
        .sort((a, b) => b[0] - a[0]) // От 5 до 1
        .map(([rating, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return `
                <div class="rating-bar-row" data-rating="${rating}">
                    <span class="rating-label">${rating} <i class="fas fa-star"></i></span>
                    <div class="rating-progress">
                        <div class="rating-fill" style="width: ${barWidth}%"></div>
                    </div>
                    <span class="rating-count-bar">${count}</span>
                </div>
            `;
        }).join('');
    
    // Добавляем обработчики клика для фильтрации
    ratingBarsContainer.querySelectorAll('.rating-bar-row').forEach(row => {
        row.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            filterReviewsByRating(rating);
        });
    });
}

// Фильтровать отзывы по рейтингу
let currentFilter = null;

function filterReviewsByRating(rating) {
    const reviews = getReviews();
    const reviewsList = document.getElementById('reviewsList');
    const showMoreBtn = document.getElementById('showMoreReviews');
    const userVotes = getUserVotes();
    
    if (!reviewsList) return;
    
    // Если кликнули на тот же фильтр — сбрасываем
    if (currentFilter === rating) {
        currentFilter = null;
        renderReviews(showingAll);
        document.querySelectorAll('.rating-bar-row').forEach(row => {
            row.classList.remove('active');
        });
        return;
    }
    
    currentFilter = rating;
    
    // Подсвечиваем активный фильтр
    document.querySelectorAll('.rating-bar-row').forEach(row => {
        row.classList.toggle('active', parseInt(row.dataset.rating) === rating);
    });
    
    // Фильтруем отзывы
    const filteredReviews = reviews.filter(r => r.rating === rating);
    
    if (showMoreBtn) showMoreBtn.style.display = 'none';
    
    if (filteredReviews.length === 0) {
        reviewsList.innerHTML = '<div class="no-reviews">Нет отзывов с такой оценкой</div>';
        return;
    }
    
    reviewsList.innerHTML = filteredReviews.map(review => {
        const userVote = userVotes[review.id];
        const likeClass = userVote === 'like' ? 'active' : '';
        const dislikeClass = userVote === 'dislike' ? 'active' : '';
        const likeIcon = userVote === 'like' ? 'fas' : 'far';
        const dislikeIcon = userVote === 'dislike' ? 'fas' : 'far';
        
        return `
            <div class="review-item filtered" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.initials}</div>
                        <div class="reviewer-details">
                            <span class="reviewer-name">${review.name}</span>
                            <span class="review-date">${review.date}</span>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
                ${review.image ? `<div class="review-images"><img src="${review.image}" alt="Фото отзыва"></div>` : ''}
                <div class="review-actions">
                    <button class="review-like like-btn ${likeClass}" data-action="like" data-review-id="${review.id}">
                        <i class="${likeIcon} fa-thumbs-up"></i>
                        <span class="like-count">${review.likes}</span>
                    </button>
                    <button class="review-like dislike-btn ${dislikeClass}" data-action="dislike" data-review-id="${review.id}">
                        <i class="${dislikeIcon} fa-thumbs-down"></i>
                        <span class="dislike-count">${review.dislikes}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    attachReviewHandlers();
}

// Обработчик голосования
function handleVote(reviewId, action) {
    const reviews = getReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;
    
    const userVotes = getUserVotes();
    const currentVote = userVotes[reviewId];
    
    if (currentVote === action) {
        if (action === 'like') review.likes--;
        if (action === 'dislike') review.dislikes--;
        delete userVotes[reviewId];
    } else {
        if (currentVote === 'like') review.likes--;
        if (currentVote === 'dislike') review.dislikes--;
        
        if (action === 'like') review.likes++;
        if (action === 'dislike') review.dislikes++;
        userVotes[reviewId] = action;
    }
    
    saveReviews(reviews);
    localStorage.setItem(REVIEWS_VOTES_KEY, JSON.stringify(userVotes));
    
    updateReviewVoteUI(reviewId, userVotes[reviewId], review.likes, review.dislikes);
}

// Обновить UI конкретного отзыва
function updateReviewVoteUI(reviewId, userVote, likes, dislikes) {
    const reviewItem = document.querySelector(`.review-item[data-review-id="${reviewId}"]`);
    if (!reviewItem) return;
    
    const likeBtn = reviewItem.querySelector('.like-btn');
    const dislikeBtn = reviewItem.querySelector('.dislike-btn');
    const likeIcon = likeBtn.querySelector('i');
    const dislikeIcon = dislikeBtn.querySelector('i');
    const likeCount = likeBtn.querySelector('.like-count');
    const dislikeCount = dislikeBtn.querySelector('.dislike-count');
    
    likeBtn.classList.toggle('active', userVote === 'like');
    dislikeBtn.classList.toggle('active', userVote === 'dislike');
    
    likeIcon.className = userVote === 'like' ? 'fas fa-thumbs-up' : 'far fa-thumbs-up';
    dislikeIcon.className = userVote === 'dislike' ? 'fas fa-thumbs-down' : 'far fa-thumbs-down';
    
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
}

// Прикрепить обработчики к отзывам
function attachReviewHandlers() {
    document.querySelectorAll('.like-btn, .dislike-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const reviewId = parseInt(this.dataset.reviewId);
            const action = this.dataset.action;
            handleVote(reviewId, action);
        });
    });
}

let showingAll = false;

function toggleShowAll() {
    showingAll = !showingAll;
    currentFilter = null;
    document.querySelectorAll('.rating-bar-row').forEach(row => {
        row.classList.remove('active');
    });
    renderReviews(showingAll);
}

document.addEventListener('DOMContentLoaded', function() {
    renderReviews(false);
    
    const showMoreBtn = document.getElementById('showMoreReviews');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', toggleShowAll);
    }
});

window.ReviewsSystem = {
    getReviews,
    renderReviews,
    calculateAverageRating,
    calculateRatingDistribution
};