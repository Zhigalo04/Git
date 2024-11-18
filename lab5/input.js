// Получаем все элементы с классом target
const targets = document.querySelectorAll('.target');

let selectedElement = null;
let offset = { x: 0, y: 0 };
let initialPosition = { left: 0, top: 0 };
let isPinned = false;

// Функция, чтобы начать перетаскивание
function startDrag(event) {
    selectedElement = event.target;
    offset.x = event.clientX - selectedElement.getBoundingClientRect().left;
    offset.y = event.clientY - selectedElement.getBoundingClientRect().top;

    // Запоминаем начальную позицию
    initialPosition.left = selectedElement.style.left || '0px';
    initialPosition.top = selectedElement.style.top || '0px';

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
}

// Функция, чтобы перетаскивать элемент
function drag(event) {
    if (selectedElement) {
        selectedElement.style.position = 'absolute';
        selectedElement.style.left = `${event.clientX - offset.x}px`;
        selectedElement.style.top = `${event.clientY - offset.y}px`;
    }
}

// Функция, чтобы закончить перетаскивание
function endDrag() {
    if (selectedElement) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        selectedElement = null;
    }
}

// Функция, чтобы приклеить элемент к мыши
function pinElement(event) {
    if (event.target.classList.contains('target')) {
        selectedElement = event.target;
        initialPosition.left = selectedElement.style.left || '0px';
        initialPosition.top = selectedElement.style.top || '0px';
        isPinned = true;

        // Изменение цвета
        selectedElement.style.color = 'white'; 
        document.addEventListener('mousemove', pinnedDrag);
        document.addEventListener('click', unpinElement);
    }
}

// Функция, чтобы перетаскивать приклеенный элемент
function pinnedDrag(event) {
    if (isPinned && selectedElement) {
        selectedElement.style.position = 'absolute';
        selectedElement.style.left = `${event.clientX - offset.x}px`;
        selectedElement.style.top = `${event.clientY - offset.y}px`;
    }
}

// Функция, чтобы открепить элемент
function unpinElement() {
    if (isPinned) {
        isPinned = false;
        selectedElement.style.color = 'red'; // Вернуть цвет
        document.removeEventListener('mousemove', pinnedDrag);
        document.removeEventListener('click', unpinElement);
        selectedElement = null;
    }
}

// Функция для возврата элемента на исходную позицию
function cancelDrag() {
    if (selectedElement) {
        selectedElement.style.left = initialPosition.left;
        selectedElement.style.top = initialPosition.top;
        selectedElement = null;
    }
}

// Обработчики событий для элементов
targets.forEach(target => {
    target.addEventListener('mousedown', startDrag);
    target.addEventListener('dblclick', pinElement);
});

// Обработчик события для клавиши Esc
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        cancelDrag();
    }
});