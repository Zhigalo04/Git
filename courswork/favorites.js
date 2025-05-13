document.addEventListener('DOMContentLoaded', function() {
    const favoritesContainer = document.getElementById('favorites-container');
    if (!favoritesContainer) return;

    // Получаем сохраненные избранные товары
    const favorites = JSON.parse(localStorage.getItem('favoriteCars')) || [];
    
    // Если нет избранных товаров
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="empty-favorites">У вас пока нет избранных автомобилей</p>';
        return;
    }
    
    // Создаем фрагмент документа для оптимизации
    const fragment = document.createDocumentFragment();
    
    // Отображаем избранные товары
    favorites.forEach(car => {
        const carCard = document.createElement('article');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.model}" class="car-image" loading="lazy">
            <div class="car-info">
                <h3 class="car-model">${car.model}</h3>
                <p class="car-specs">${car.specs}</p>
                <p class="car-price">${car.price}</p>
                <button class="favorite-btn active" aria-label="Удалить из избранного">
                    <i class="fas fa-heart"></i> В избранном
                </button>
            </div>
        `;
        fragment.appendChild(carCard);
    });
    
    favoritesContainer.appendChild(fragment);
    
    // Обработчик для кнопок "В избранное" на странице избранного
    favoritesContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('.favorite-btn');
        if (!btn) return;
        
        const carCard = btn.closest('.car-card');
        if (!carCard) return;
        
        const carModel = carCard.querySelector('.car-model')?.textContent;
        if (!carModel) return;
        
        // Удаляем из избранного
        let updatedFavorites = JSON.parse(localStorage.getItem('favoriteCars')) || [];
        updatedFavorites = updatedFavorites.filter(car => car.model !== carModel);
        localStorage.setItem('favoriteCars', JSON.stringify(updatedFavorites));
        
        // Удаляем карточку из DOM
        carCard.remove();
        
        // Если больше нет избранных товаров
        if (updatedFavorites.length === 0) {
            favoritesContainer.innerHTML = '<p class="empty-favorites">У вас пока нет избранных автомобилей</p>';
        }
    });
});