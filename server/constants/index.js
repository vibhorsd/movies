
const IMDB_API_KEY = "541f4bed734234b7ec445338523c49fe";
const IMDB_BASE_URL = "http://api.themoviedb.org/3/";
const IMDB_IMG_BASE_URL = "http://image.tmdb.org/t/p/";
const SERVR_CACHE_EXPIRY = 24 * 60 * 60; //One day

const STORAGE_KEY = {
    PAGE : "PAGE",
    MOVIE : "MOVIE"
};

const ACTIONS = {
    INIT : "INIT",
    CONNECT : "CONNECT",
    FETCH : "FETCH",
    SEARCH: "SEARCH",
    FETCH_LIKES_DISLIKES : "FETCH_LIKES_DISLIKES",
    LIKE : "LIKE",
    DISLIKE : "DISLIKE",
    CLAER_ACTION: "CLAER_ACTION"
};

export default {
    IMDB_API_KEY, IMDB_BASE_URL, IMDB_IMG_BASE_URL, SERVR_CACHE_EXPIRY, STORAGE_KEY, ACTIONS
}
