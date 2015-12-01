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
