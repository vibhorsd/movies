export default {
    info : {
        version : "0.1",
        prefix: "Redux",
        appName: "Movie-redux"
    },
    servers : {
        "local" : {
            host : "127.0.0.1",
            port : 6379
        },
        "docker" : {
            host : "redis",
            port : "6379"
        },
        "remote" : {
            host : "remote_ip",
            port : "6379"
        }
    },
    db : {
        "development" : 1,
        "test" : 2,
        "production": 3
    }
}
