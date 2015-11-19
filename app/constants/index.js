var keyMirror = function(obj) {
    var ret = {};
    var key;
    if (!(obj instanceof Object && !Array.isArray(obj))) {
        throw new Error('keyMirror(...): Argument must be an object.');
    }
    for (key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        ret[key] = key;
    }
    return ret;
};
const ActionTypes = keyMirror({
    MOVIE_FETCH : null
});

const ServerCacheError = {
    INVALID_INPUT: 11,
    NOT_CONNECTED : 12,
    CACHE_SYS_ERROR: 13,
    INVALID_KEY: 14
    
};

const ClientCacheError = {
    DB_LOAD_ERROR: 21,
    NOT_CONNECTED : 22,
    TRANSACTION_FAILED: 23
};

const IMDB_API_KEY = "541f4bed734234b7ec445338523c49fe";
const IMDB_BASE_URL = "http://api.themoviedb.org/3/";
const IMDB_IMG_BASE_URL = "http://image.tmdb.org/t/p/";

const SERVER_CACHE_EXPIRY = 24 * 60 * 60; //One day
export default {
    ActionTypes, IMDB_API_KEY, IMDB_BASE_URL, IMDB_IMG_BASE_URL,ServerCacheError, SERVER_CACHE_EXPIRY
};
