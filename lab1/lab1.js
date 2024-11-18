let numberOfFilms = prompt("Сколько фильмов вы уже смотрели?"); 

let personalMovieDB = {
    count: numberOfFilms,
    movies: {}
};

for (let i = 0; i < 2; i++){
    let movie;
    let rating;

    while(true){
        movie = prompt("Один из последних просмотренных фильмов?");
        if(movie && movie.length <= 50){
            break;
        } else{
            alert("Введите название фильма( < 50 символов)");
        }
    }

    while(true){
        rating = prompt("На сколько оцените его?")
        if(rating && !isNaN(rating) && rating >= 0 && rating <= 10){
            break;
        }else{
            alert("Введите корректные данные (Рейтинг должен быть в пределе от 0 до 10")
        }
    }

    personalMovieDB.movies[movie] = rating;
}

console.log(personalMovieDB)