const drawingArea = document.getElementById('drawingArea');
const shapeSelector = document.getElementById('shapeSelector');
let isDrawing = false;
let startX, startY;
let currentColor = 'red'; // Установите начальный цвет

// Установка текущего цвета
document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
    });
});

drawingArea.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

drawingArea.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;
    const shape = shapeSelector.value;

    // Удаляем предыдущий временный элемент
    const tempShape = document.getElementById('tempShape');
    if (tempShape) tempShape.remove();

    if (shape === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('id', 'tempShape');
        circle.setAttribute('cx', startX);
        circle.setAttribute('cy', startY);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', currentColor);
        drawingArea.appendChild(circle);
    } else if (shape === 'rectangle') {
        const width = currentX - startX;
        const height = currentY - startY;
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('id', 'tempShape');
        rect.setAttribute('x', Math.min(startX, currentX));
        rect.setAttribute('y', Math.min(startY, currentY));
        rect.setAttribute('width', Math.abs(width));
        rect.setAttribute('height', Math.abs(height));
        rect.setAttribute('fill', currentColor);
        drawingArea.appendChild(rect);
    }
});

drawingArea.addEventListener('mouseup', (event) => {
    if (isDrawing) {
        const shape = shapeSelector.value;
        const currentX = event.offsetX;
        const currentY = event.offsetY;

        if (shape === 'circle') {
            const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute('cx', startX);
            circle.setAttribute('cy', startY);
            circle.setAttribute('r', radius);
            circle.setAttribute('fill', currentColor);
            drawingArea.appendChild(circle);
        } else if (shape === 'rectangle') {
            const width = currentX - startX;
            const height = currentY - startY;
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', Math.min(startX, currentX));
            rect.setAttribute('y', Math.min(startY, currentY));
            rect.setAttribute('width', Math.abs(width));
            rect.setAttribute('height', Math.abs(height));
            rect.setAttribute('fill', currentColor);
            drawingArea.appendChild(rect);
        }
    }
    isDrawing = false;
});

drawingArea.addEventListener('mouseleave', () => {
    isDrawing = false;
});

// Обработчик двойного клика для удаления фигур
drawingArea.addEventListener('dblclick', (e) => {
    const shapes = document.elementsFromPoint(e.clientX, e.clientY);
    const clickedShape = shapes.find(shape => shape.tagName === 'circle' || shape.tagName === 'rect');

    if (clickedShape) {
        const confirmDelete = confirm('Вы действительно хотите удалить эту фигуру?');
        if (confirmDelete) {
            clickedShape.remove();
        }
    }
});