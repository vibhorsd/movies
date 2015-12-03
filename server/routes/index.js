import bodyParser from "body-parser";
import homeRoute from "./Home";

export default function(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.use(function(req, res, next) {
        GLOBAL.navigator = {
            userAgent: req.headers['user-agent']
        };
        next();
    });
    
    app.get("/", (req, res) => {
        homeRoute(req, res);
    });
    app.get("/fetch", (req, res) => {
        var pageNum = req.param('page_num');
        var page = [];
        res.send(page);
    });
    app.get("/fetch/likes/dislikes", (req, res) => {
        var key = req.param('movie_id');
        var count = {likes: 0, dislikes: 0};
        res.send(count);
    });
    app.get("/update/likes", (req, res) => {
        var key = req.param('movie_id');
        var movie = {id: key, likes: 0};
        res.send(movie);
    });
    app.get("/update/dislikes", (req, res) => {
        var key = req.param('movie_id');
        var movie = {id: key, dislikes: 0};
        res.send(movie);
    });
    app.post("/search_movie", (req, res) => {
        var excludeMovies = req.body.exclude;
        var searchTitle = req.body.keyword.toLowerCase();
        res.send([]);
    });
}
