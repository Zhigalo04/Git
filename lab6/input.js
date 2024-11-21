const targets = document.querySelectorAll('.target');

let selectedElement = null;
let offset = { x: 0, y: 0 };
let initialPosition = { left: 0, top: 0 };
let isPinned = false;

function startDrag(event) {
    if (event.touches && event.touches.length > 1) {
        // Если два пальца на экране - отключаем перетаскивание
        cancelDrag();
        return;
    }

    selectedElement = event.target;
    offset.x = (event.touches ? event.touches[0].clientX : event.clientX) - selectedElement.getBoundingClientRect().left;
    offset.y = (event.touches ? event.touches[0].clientY : event.clientY) - selectedElement.getBoundingClientRect().top;

    initialPosition.left = selectedElement.style.left || '0px';
    initialPosition.top = selectedElement.style.top || '0px';

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);
}

function drag(event) {
    if (selectedElement) {
        selectedElement.style.position = 'absolute';
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        selectedElement.style.left = `${clientX - offset.x}px`;
        selectedElement.style.top = `${clientY - offset.y}px`;
    }
}

function endDrag() {
    if (selectedElement) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);
        selectedElement = null;
    }
}

function pinElement(event) {
    if (event.target.classList.contains('target')) {
        selectedElement = event.target;
        initialPosition.left = selectedElement.style.left || '0px';
        initialPosition.top = selectedElement.style.top || '0px';
        isPinned = true;
        selectedElement.style['background-color'] = 'green';

        document.addEventListener('mousemove', pinnedDrag);
        document.addEventListener('click', unpinElement);
        document.addEventListener('touchmove', pinnedDrag);
        document.addEventListener('touchend', unpinElement);
    }
}

function pinnedDrag(event) {
    if (isPinned && selectedElement) {
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        selectedElement.style.left = `${clientX - offset.x}px`;
        selectedElement.style.top = `${clientY - offset.y}px`;
    }
}

function unpinElement() {
    if (isPinned && selectedElement) {
        isPinned = false;
        selectedElement.style.background = 'red'; // Вернуть цвет объекта
        document.removeEventListener('mousemove', pinnedDrag);
        document.removeEventListener('click', unpinElement);
        document.removeEventListener('touchmove', pinnedDrag);
        document.removeEventListener('touchend', unpinElement);
        selectedElement = null; // Установить в null после использования
    }
}

function cancelDrag() {
    if (selectedElement) {
        selectedElement.style.left = initialPosition.left;
        selectedElement.style.top = initialPosition.top;
        selectedElement.style.background = 'red'; // Вернуть цвет объекта
        selectedElement = null;
    }
}

function init() {
    targets.forEach(target => {
        target.addEventListener('mousedown', startDrag);
        target.addEventListener('touchstart', startDrag);
        target.addEventListener('dblclick', pinElement);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            cancelDrag();
            if (selectedElement) {
                selectedElement.style.background = 'red'; // Вернуть цвет объекта
            }
        }
    });

    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
            unpinElement();
        }
    });
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', init);