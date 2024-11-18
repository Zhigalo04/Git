const targets = document.querySelectorAll('.target');

let selectedElement = null;
let offset = { x: 0, y: 0 };
let initialPosition = { left: 0, top: 0 };
let isPinned = false;

function startDrag(event) {
    selectedElement = event.target;
    offset.x = event.clientX - selectedElement.getBoundingClientRect().left;
    offset.y = event.clientY - selectedElement.getBoundingClientRect().top;

    initialPosition.left = selectedElement.style.left || '0px';
    initialPosition.top = selectedElement.style.top || '0px';

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
}

function drag(event) {
    if (selectedElement) {
        selectedElement.style.position = 'absolute';
        selectedElement.style.left = `${event.clientX - offset.x}px`;
        selectedElement.style.top = `${event.clientY - offset.y}px`;
    }
}

function endDrag() {
    if (selectedElement) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        selectedElement = null;
    }
}

function pinElement(event) {
    if (event.target.classList.contains('target')) {
        selectedElement = event.target;
        initialPosition.left = selectedElement.style.left || '0px';
        initialPosition.top = selectedElement.style.top || '0px';
        isPinned = true;

        selectedElement.style.color = 'green'; 
        document.addEventListener('mousemove', pinnedDrag);
        document.addEventListener('click', unpinElement);
    }
}

function pinnedDrag(event) {
    if (isPinned && selectedElement) {
        selectedElement.style.position = 'absolute';
        selectedElement.style.left = `${event.clientX - offset.x}px`;
        selectedElement.style.top = `${event.clientY - offset.y}px`;
    }
}

function unpinElement() {
    if (isPinned) {
        isPinned = false;
        selectedElement.style.color = 'red'; // Вернуть цвет
        document.removeEventListener('mousemove', pinnedDrag);
        document.removeEventListener('click', unpinElement);
        selectedElement = null;
    }
}

function cancelDrag() {
    if (selectedElement) {
        selectedElement.style.left = initialPosition.left;
        selectedElement.style.top = initialPosition.top;
        selectedElement = null;
    }
}

targets.forEach(target => {
    target.addEventListener('mousedown', startDrag);
    target.addEventListener('dblclick', pinElement);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        cancelDrag();
    }
});