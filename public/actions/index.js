export const getData = () => {
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
}
