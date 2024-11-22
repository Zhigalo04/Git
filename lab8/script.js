const canvas = document.getElementById('drawingArea');
const ctx = canvas.getContext('2d');
const shapeSelector = document.getElementById('shapeSelector');
const clearButton = document.getElementById('clearButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
let isDrawing = false;
let startX, startY;
let currentColor = 'red';
const shapes = [];
const lines = [];
let undoneLines = [];

document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
    });
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;

    if (shapeSelector.value === 'pen') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        lines.push({ color: currentColor, points: [{ x: startX, y: startY }] });
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    if (shapeSelector.value === 'pen') {
        const line = lines[lines.length - 1];
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        line.points.push({ x: e.offsetX, y: e.offsetY });
    } else {
        drawAllShapes();
        drawTemporaryShape(startX, startY, e.offsetX, e.offsetY);
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        if (shapeSelector.value !== 'pen') {
            const shape = {
                type: shapeSelector.value,
                color: currentColor,
                startX: startX,
                startY: startY,
                endX: e.offsetX,
                endY: e.offsetY
            };
            shapes.push(shape);
        }
        isDrawing = false;
    }
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

canvas.addEventListener('dblclick', (e) => {
    const clickedShapeIndex = shapes.findIndex(shape => isPointInShape(e.offsetX, e.offsetY, shape));
    if (clickedShapeIndex !== -1) {
        const confirmDelete = confirm('Вы действительно хотите удалить эту фигуру?');
        if (confirmDelete) {
            shapes.splice(clickedShapeIndex, 1); // Удаляем фигуру из массива
            drawAllShapes(); // Перерисовываем все фигуры
        }
    }
});

clearButton.addEventListener('click', () => {
    const confirmClear = confirm('Вы действительно хотите очистить холст?');
    if (confirmClear) {
        shapes.length = 0;
        lines.length = 0;
        undoneLines.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

undoButton.addEventListener('click', () => {
    if (lines.length > 0) {
        undoneLines.push(lines.pop());
        redrawCanvas();
    }
});

redoButton.addEventListener('click', () => {
    if (undoneLines.length > 0) {
        lines.push(undoneLines.pop());
        redrawCanvas();
    }
});

function drawTemporaryShape(startX, startY, currentX, currentY) {
    ctx.beginPath();
    if (shapeSelector.value === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    } else if (shapeSelector.value === 'rectangle') {
        ctx.rect(Math.min(startX, currentX), Math.min(startY, currentY), Math.abs(currentX - startX), Math.abs(currentY - startY));
    } else if (shapeSelector.value === 'oval') {
        const radiusX = Math.abs(currentX - startX) / 2;
        const radiusY = Math.abs(currentY - startY) / 2;
        const centerX = (currentX + startX) / 2;
        const centerY = (currentY + startY) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    }
    ctx.fillStyle = currentColor;
    ctx.fill();
}

function drawAllShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        ctx.beginPath();
        if (shape.type === 'circle') {
            const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2));
            ctx.arc(shape.startX, shape.startY, radius, 0, Math.PI * 2);
        } else if (shape.type === 'rectangle') {
            ctx.rect(Math.min(shape.startX, shape.endX), Math.min(shape.startY, shape.endY), Math.abs(shape.endX - shape.startX), Math.abs(shape.endY - shape.startY));
        } else if (shape.type === 'oval') {
            const radiusX = Math.abs(shape.endX - shape.startX) / 2;
            const radiusY = Math.abs(shape.endY - shape.startY) / 2;
            const centerX = (shape.endX + shape.startX) / 2;
            const centerY = (shape.endY + shape.startY) / 2;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        }
        ctx.fillStyle = shape.color;
        ctx.fill();
    });
}

function isPointInShape(x, y, shape) {
    if (shape.type === 'circle') {
        const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2));
        const distance = Math.sqrt(Math.pow(x - shape.startX, 2) + Math.pow(y - shape.startY, 2));
        return distance <= radius;
    } else if (shape.type === 'rectangle') {
        return x >= Math.min(shape.startX, shape.endX) &&
               x <= Math.max(shape.startX, shape.endX) &&
               y >= Math.min(shape.startY, shape.endY) &&
               y <= Math.max(shape.startY, shape.endY);
    } else if (shape.type === 'oval') {
        const radiusX = Math.abs(shape.endX - shape.startX) / 2;
        const radiusY = Math.abs(shape.endY - shape.startY) / 2;
        const centerX = (shape.endX + shape.startX) / 2;
        const centerY = (shape.endY + shape.startY) / 2;
        const distanceX = (x - centerX) ** 2 / (radiusX ** 2);
        const distanceY = (y - centerY) ** 2 / (radiusY ** 2);
        return (distanceX + distanceY) <= 1;
    }
    return false;
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();
    lines.forEach(line => {
        ctx.strokeStyle = line.color;
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        line.points.forEach(point => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    });
}