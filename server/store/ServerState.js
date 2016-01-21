import cacheManager from "../cache_manager";
import AppConst from "../constants";
import request from "request";
import logger from "../logger";
import async from "async";

export default class ServerState {
    constructor() {
        this.SEPARTOR = "#_#";
    }
    connect(){
        return cacheManager.connect();
    }

    _getMovieKey(movie) {
        if (movie.id && movie.title) {
            return movie.id + this.SEPARTOR + movie.title.toLowerCase();
        }
        else {
            throw Error("Invalid movie");
        }
    }

    fetchMoviesFromIMDB(pageNum, needToParse) {
        return new Promise((resolve, reject) => {
            var totalPages = 1;
            var cur_year = new Date().getFullYear();
            var url = AppConst.IMDB_BASE_URL +
            "discover/movie?certification_country=US&certification.lte=PG-13" +
            "&api_key=" + AppConst.IMDB_API_KEY +
            "&page=" + pageNum;
            var requestSetting = {
                url : url,
                method: "GET",
                timeout: 20000
            };

            //logger.info("[ServerState:(fetchMoviesFromIMDB)]:url =>" + requestSetting.url);

            request(requestSetting,(err, resp, body) =>{
                if (err) {
                    logger.error("[ServerState: (fetchMoviesFromIMDB) ]:" + err);
                    reject(err);
                }
                else {
                    logger.info("[ServerState: (fetchMoviesFromIMDB) ]: {Fetch Done}");
                    if (needToParse) {
                        let bodyStr = body.toString('utf-8');
                        //console.log(bodyStr);
                        var movieObject = JSON.parse(bodyStr);
                        resolve([movieObject, bodyStr]);
                    }
                    else {
                        let bodyStr = body.toString('utf-8');
                        resolve([{},bodyStr]);
                    }

                }
            });
        });
    }

    _savePageInCache (pageNum, pageStr, pageObject) {
        async.parallel([
            () => {
                let storeObj = {};
                storeObj[pageNum] = pageStr;
                cacheManager.addMap(AppConst.STORAGE_KEY.PAGE, storeObj, AppConst.SERVR_CACHE_EXPIRY).catch((err) => {
                    logger.error("[ServerState: (_savePageInCache) ]: Adding page fails");
                });
            },
            () => {
                var storeMovieObj = {};
                for (let idx in pageObject.results) {
                    var movie = pageObject.results[idx];
                    storeMovieObj[this._getMovieKey(movie)] = JSON.stringify(movie);
                }

                cacheManager.addMap(AppConst.STORAGE_KEY.MOVIE, storeMovieObj,AppConst.SERVR_CACHE_EXPIRY).catch((err) => {
                    logger.error("[ServerState: (_savePageInCache) ]: Movie store fails");
                });
            }
        ], ()=>{})
    }

    page (pageNum) {
        return new Promise((resolve, reject) => {
            cacheManager.getMap(AppConst.STORAGE_KEY.PAGE, [pageNum.toString()]).then((value) => {
                if (value !== null && value[pageNum.toString()] !== null) {
                    var pageObj = JSON.parse(value[pageNum.toString()]);
                    resolve({
                        page : pageObj,
                        cached: true
                    });
                }
                else {
                    this.fetchMoviesFromIMDB(pageNum, true).then((values) => {
                        if (values && values[0].results && values[0].page === pageNum) {
                            async.parallel([
                                () => {
                                    resolve({
                                        page : values[0],
                                        cached: false
                                    });
                                },
                                () => {

                                    this._savePageInCache(pageNum.toString(), values[1], values[0]);
                                }
                            ],()=>{})
                        }
                        else {
                            logger.error("[ServerState: (fetch) ]: Receive Invalid object");
                            console.dir(values[0]);
                            reject(Error("Receive Invalid object"));
                        }
                    }).catch((err) => {
                        reject(err);
                    });

                }

            }).catch((err) => {
                reject(err);
            });
        });
    }

    movie(movieId) {
        return new Promise((resolve, reject) => {
            let pattern = "" + movieId + this.SEPARTOR + "*";
            cacheManager.searchMap(AppConst.STORAGE_KEY.MOVIE, pattern).then((result) => {
                if (result) {
                    var key = Object.keys(result)[0];
                    var movieJSON = result[key];
                    var movieObj = JSON.parse(movieJSON);
                    if (movieObj.id === movieId) {
                        resolve(movieObj);
                    }
                    else {
                        resolve(null);
                    }
                }
                else {
                    resolve(null);
                }
            }).catch((err) => {
                logger.error("[ServerState: (movie) ]: Search Fails");
                reject(err);
            });
        });
    }

    updateMovie(movieId, updateObject) {
        return new Promise((resolve, reject) => {
            this.movie(movieId).then((movie) => {
                if (movie) {
                    for (var key in updateObject) {
                        if (updateObject.hasOwnProperty(key)) {
                            movie[key] = updateObject[key];
                        }
                    }
                    var storeMovieObj = {};
                    storeMovieObj[this._getMovieKey(movie)] = JSON.stringify(movie);
                    cacheManager.addMap(AppConst.STORAGE_KEY.MOVIE, storeMovieObj,AppConst.SERVR_CACHE_EXPIRY).then(() => {
                        resolve(movie);
                    }).catch((err) => {
                        logger.error("[ServerState: (updateMovie) ]: movie save fails");
                        reject(err);
                    });
                }
                else {
                    resolve(null);
                }
            }).catch((err) => {
                logger.error("[ServerState: (updateMovie) ]: movie fetch fails");
                reject(err);
            })
        });
    }

    search(keyword) {
        return new Promise((resolve, reject) => {
            var pattern = "*" + this.SEPARTOR + keyword;
            cacheManager.searchMap(AppConst.STORAGE_KEY.MOVIE, pattern).then((results) => {
                if (results) {
                    var final = {};
                    for (var key in results) {
                        var movie = results[key];
                        final[movie.id] = movie;
                    }
                    resolve(final);
                }
                else {
                    resolve(null);
                }
            }).catch((err) => {
                logger.error("[ServerState: (search) ]: Search Fails");
                reject(err);
            });
        });
    }

    like (movieId) {
        return new Promise((resolve, reject) => {
            this.movie(movieId).then((movie) => {
                if (movie) {
                    var update = {};
                    if (movie.like) {
                        update.like = movie.like + 1;
                    }
                    else {
                        update.like = 1;
                    }
                    this.updateMovie(movieId, update).then((updatedMovie) => {
                        resolve(updatedMovie);
                    }).catch((err) => {
                        logger.error("[ServerState: (like) ]: Movie update fails");
                        reject(err);
                    });
                }
                else {
                    logger.error("[ServerState: (like) ]: Movie not exists");
                    reject(Error("No Movie Exists"));
                }

            }).catch((err) => {
                logger.error("[ServerState: (like) ]: Movie Fetch fails");
                reject(err);
            });
        });
    }

    dislike (movieId) {
        return new Promise((resolve, reject) => {
            this.movie(movieId).then((movie) => {
                if (movie) {
                    var update = {};
                    if (movie.like) {
                        update.dislike = movie.like + 1;
                    }
                    else {
                        update.dislike = 1;
                    }
                    this.updateMovie(movieId, update).then((updatedMovie) => {
                        resolve(updatedMovie);
                    }).catch((err) => {
                        logger.error("[ServerState: (dislike) ]: Movie update fails");
                        reject(err);
                    });
                }
                else {
                    logger.error("[ServerState: (dislike) ]: Movie not exists");
                    reject(Error("No Movie Exists"));
                }

            }).catch((err) => {
                logger.error("[ServerState: (dislike) ]: Movie Fetch fails");
                reject(err);
            });
        });
    }
}
