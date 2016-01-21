
export const ACTIONS = {
    INIT : "INIT",
    FETCH: "FETCH",
    FETCH_LIKE_DISLIKE : "FETCH_LIKE_DISLIKE",
    REMOTE_FETCH_PENDING : "REMOTE_FETCH_PENDING",
    LIKE : "LIKE",
    DISLIKE : "DISLIKE"
}


export const getData = (data) => {
    return {
        type: "GET_DATA",
        data: data
    };
}

export const notifyPending = () => {
    return {
        type: "GET_DATA_PENDING"
    };
}
export const getRemoteData = () => {
    return dispatch => {
        dispatch(notifyPending());
        setTimeout(() => {
            var num = Math.ceil(Math.random() * 1000);
            dispatch(getData(num));
        }, 5000);
    }
}
