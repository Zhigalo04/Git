document.addEventListener('DOMContentLoaded', function() {
    // Объект для хранения ссылок на DOM-элементы
    const domElements = {
        accountBtn: document.querySelector('.account-btn'),
        dropdownContent: document.querySelector('.dropdown-content'),
        lightThemeBtn: document.getElementById('lightThemeBtn'),
        darkThemeBtn: document.getElementById('darkThemeBtn'),
        usernameDisplay: document.getElementById('username-display')
    };

    // Функция для перенаправления на главную страницу
    function redirectToHome() {
        window.location.href = 'AutoMarket.html';
    }

    // Функция для обновления меню аккаунта
    function updateAccountMenu() {
        if (!domElements.dropdownContent) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const existingLinks = domElements.dropdownContent.querySelectorAll('a:not([href="favorites.html"])');

        // Удаляем старые кнопки
        existingLinks.forEach(el => el.remove());

        if (currentUser) {
            // Создаем кнопку выхода
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.className = 'logout-btn';
            logoutLink.textContent = 'Выйти';
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                redirectToHome();
            });
            domElements.dropdownContent.prepend(logoutLink);
        } else {
            // Создаем кнопки входа и регистрации
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.textContent = 'Войти';
            domElements.dropdownContent.prepend(loginLink);

            const registerLink = document.createElement('a');
            registerLink.href = 'register.html';
            registerLink.textContent = 'Зарегистрироваться';
            loginLink.insertAdjacentElement('afterend', registerLink);
        }
    }

    // Обновление отображения имени пользователя
    function updateUserDisplay() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (domElements.usernameDisplay) {
            if (currentUser) {
                domElements.usernameDisplay.textContent = currentUser.username;
                domElements.usernameDisplay.style.cssText = 'margin-right: 15px; font-weight: 600;';
            } else {
                domElements.usernameDisplay.textContent = '';
            }
        }
    }

    // Инициализация выпадающего меню
    function initAccountDropdown() {
        if (!domElements.accountBtn || !domElements.dropdownContent) return;

        domElements.accountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            domElements.dropdownContent.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.account-dropdown')) {
                domElements.dropdownContent.classList.remove('show');
            }
        });
    }

    // Работа с избранным
    function handleFavorites() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const carCard = this.closest('.car-card') || document.querySelector('.product-container');
                if (!carCard) return;

                const isActive = this.innerHTML.includes('fas');
                const modelElement = carCard.querySelector('.car-model') || carCard.querySelector('.product-title');
                if (!modelElement) return;

                const model = modelElement.textContent;
                let favorites = JSON.parse(localStorage.getItem('favoriteCars')) || [];

                if (!isActive) {
                    this.innerHTML = '<i class="fas fa-heart"></i> В избранном';
                    
                    const carData = {
                        image: (carCard.querySelector('.car-image')?.src || carCard.querySelector('.main-image')?.src) ?? '',
                        model: model,
                        specs: (carCard.querySelector('.car-specs')?.textContent || 
                               Array.from(carCard.querySelectorAll('.specs-list li')).map(li => li.textContent).join(' | ')) ?? '',
                        price: (carCard.querySelector('.car-price')?.textContent || 
                               carCard.querySelector('.product-price')?.textContent) ?? '',
                        link: window.location.pathname
                    };
                    
                    if (!favorites.some(car => car.model === carData.model)) {
                        favorites.push(carData);
                        localStorage.setItem('favoriteCars', JSON.stringify(favorites));
                    }
                } else {
                    this.innerHTML = '<i class="far fa-heart"></i> В избранное';
                    favorites = favorites.filter(car => car.model !== model);
                    localStorage.setItem('favoriteCars', JSON.stringify(favorites));
                }
            });
        });
        
        // Отметка уже добавленных в избранное
        const favorites = JSON.parse(localStorage.getItem('favoriteCars')) || [];
        document.querySelectorAll('.car-card, .product-container').forEach(card => {
            const modelElement = card.querySelector('.car-model') || card.querySelector('.product-title');
            if (!modelElement) return;
            
            const model = modelElement.textContent;
            const btn = card.querySelector('.favorite-btn');
            
            if (btn && favorites.some(car => car.model === model)) {
                btn.innerHTML = '<i class="fas fa-heart"></i> В избранном';
            }
        });
    }

    // Управление темами
    function initThemeSwitcher() {
        if (!domElements.lightThemeBtn || !domElements.darkThemeBtn) return;
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);

        domElements.lightThemeBtn.addEventListener('click', () => setTheme('light'));
        domElements.darkThemeBtn.addEventListener('click', () => setTheme('dark'));
    }

    function setTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
        
        if (domElements.lightThemeBtn && domElements.darkThemeBtn) {
            domElements.lightThemeBtn.style.fontWeight = theme === 'light' ? 'bold' : 'normal';
            domElements.darkThemeBtn.style.fontWeight = theme === 'dark' ? 'bold' : 'normal';
        }
    }

    // Проверка авторизации и перенаправление
    function checkAuthAndRedirect() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isAuthPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname.includes('register.html');
        
        if (currentUser && isAuthPage) {
            redirectToHome();
        }
    }

    // Инициализация карусели
    function initCarousel() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;

        const images = document.querySelectorAll('.carousel img');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const indicators = document.querySelectorAll('.indicator');
        
        let currentIndex = 0;
        const totalImages = images.length;
        
        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Обновляем индикаторы
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalImages;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        }
        
        // Автоматическое перелистывание каждые 5 секунд
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Обработчики кнопок
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Обработчики для индикаторов
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(slideInterval);
                currentIndex = index;
                updateCarousel();
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
        
        // Остановка автопрокрутки при наведении
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    function loadUserAds() {
        const ads = JSON.parse(localStorage.getItem('carAds')) || [];
        const carsList = document.querySelector('.cars-list');
        
        if (!carsList) return;
        
        ads.forEach(ad => {
            const carCard = document.createElement('article');
            carCard.className = 'car-card';
            
            // Создаем случайный ID для объявления
            const adId = 'ad-' + Math.random().toString(36).substr(2, 9);
            
            carCard.innerHTML = `
                <a href="product_advertisement.html?id=${adId}" class="car-link">
                    <img src="${ad.images[0].url}" alt="${ad.title}" class="car-image">
                    <div class="car-info">
            <h3 class="car-model">${ad.title}</h3>
            <div class="car-specs">
                <p>${ad.year} год выпуска;  </p>
                <p>Двигатель: ${ad.engine};  </p>
                <p>Коробка: ${ad.transmission};  
                </p>
                <p>Пробег: ${ad.mileage} км  </p>
            </div>
            <p class="car-price">${ad.price}</p>
                </a>
                <button class="favorite-btn"><i class="far fa-heart"></i> В избранное</button>
            `;
            
            carsList.appendChild(carCard);
            
            // Сохраняем полные данные объявления под его ID
            localStorage.setItem(`ad_${adId}`, JSON.stringify(ad));
        });
        
        // Инициализируем кнопки избранного для новых карточек
        handleFavorites();
    }

    
function deleteAd(adId) {
    let ads = JSON.parse(localStorage.getItem('carAds')) || [];
    ads = ads.filter(ad => ad.id !== adId);
    localStorage.setItem('carAds', JSON.stringify(ads));
    
    // Также удаляем из localStorage
    localStorage.removeItem(`ad_${adId}`);
    
    // Перезагружаем страницу
    window.location.reload();
}

function initDeleteButtons() {
    document.querySelectorAll('.delete-ad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const adId = this.dataset.adId;
            if (confirm('Вы уверены, что хотите удалить это объявление?')) {
                deleteAd(adId);
            }
        });
    });
}

function loadUserAds() {
    const carsList = document.getElementById('carsListContainer');
    if (!carsList) return;

    // Очищаем контейнер перед загрузкой
    carsList.innerHTML = '';

    // Загружаем пользовательские объявления из localStorage
    const userAds = JSON.parse(localStorage.getItem('carAds')) || [];
    
    // Загружаем стандартные объявления (если есть)
    const defaultAds = [
        // Здесь могут быть ваши стандартные объявления
    ];

    // Объединяем и отображаем все объявления
    [...defaultAds, ...userAds].forEach(ad => {
        // Проверяем и добавляем ID, если его нет
        if (!ad.id) {
            ad.id = 'ad-' + Math.random().toString(36).substr(2, 9);
        }

        const carCard = document.createElement('article');
        carCard.className = 'car-card';
        
        carCard.innerHTML = `
            <a href="${ad.id.startsWith('ad-') ? 'product_advertisement.html?id=' + ad.id : 'product_' + ad.id + '.html'}" class="car-link">
                <img src="${ad.images?.[0]?.url || 'images/default-car.jpg'}" alt="${ad.title}" class="car-image">
                <div class="car-info">
            <h3 class="car-model">${ad.title}</h3>
            <div class="car-specs">
                <p>${ad.year} год выпуска;  </p>
                <p>Двигатель: ${ad.engine};  </p>
                <p>Коробка: ${ad.transmission};  
                </p>
                <p>Пробег: ${ad.mileage} км  </p>
            </div>
            <p class="car-price">${ad.price}</p>

            </a>
            <div class="card-actions">
                <button class="favorite-btn"><i class="far fa-heart"></i> В избранное</button>
                ${JSON.parse(localStorage.getItem('currentUser'))?.username === ad.seller ? 
                    `<button class="delete-ad-btn" data-ad-id="${ad.id}"><i class="fas fa-trash"></i> Удалить</button>` : ''}
            </div>
        `;
        
        carsList.appendChild(carCard);
        
        // Сохраняем полные данные объявления под его ID
        localStorage.setItem(`ad_${ad.id}`, JSON.stringify(ad));
    });

    // Инициализируем кнопки избранного и удаления
    handleFavorites();
    initDeleteButtons();
}

    // Инициализация всех функций
    function init() {
        updateUserDisplay();
        initAccountDropdown();
        updateAccountMenu();
        handleFavorites();
        initThemeSwitcher();
        checkAuthAndRedirect();
        initCarousel(); // Добавляем инициализацию карусели
        loadUserAds();
    }

    init();
});

