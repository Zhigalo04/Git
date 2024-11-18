'use strict';

let personalMovieDB = {
    privat: true, 
    movies: {
        "Опасный друг": 6,
        "Монстры на каникулах": 8,
        "Одноклассники": 9
    }
};

function showMovies() {
    const tableContainer = document.getElementById('movie-table');

    if (personalMovieDB.privat) {
        let tableHTML = '<table border="1"><tr><th>Название фильма</th><th>Оценка</th></tr>';

        for (let movie in personalMovieDB.movies) {
            tableHTML += `<tr><td>${movie}</td><td>${personalMovieDB.movies[movie]}</td></tr>`;
        }

        tableHTML += '</table>';

        tableContainer.innerHTML = tableHTML;
    } else {

        console.log('Доступ к данным закрыт');
    }
}

showMovies();

