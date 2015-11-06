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
const IMDB_API_KEY = "541f4bed734234b7ec445338523c49fe";
const IMDB_BASE_URL = "http://api.themoviedb.org/3/";
const IMDB_IMG_BASE_URL = "http://image.tmdb.org/t/p/";
export default {
    ActionTypes, IMDB_API_KEY, IMDB_BASE_URL, IMDB_IMG_BASE_URL
};
