/*export const getData = () => {
return {
type: "GET_DATA",
payload: {
promise: new Promise((resolve, reject) => {
setTimeout(() => {
resolve(456);
}, 5000);
}),
data: null
}
}
}

export const initData = () => {
return {
type: "INIT_DATA",
payload: 123
}
}*/

export const initData = () => {
    return {
        type : "INIT_DATA",
        data : 123
    }
}

export const getDataFinal = () => {
    return {
        type : "GET_DATA",
        data: 792
    }
}

export const pending = () => {
    return {
        type : "GET_DATA_PENDING"
    }
};

export const getData = () => {
    return dispatch => {
        dispatch(pending());
        setTimeout(()=>{
            dispatch(getDataFinal());
        }, 5000);
    }
};
