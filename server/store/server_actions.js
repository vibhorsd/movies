
import AppConst from "../constants";
const ACTIONS = AppConst.ACTIONS;


export const actionId = () => {
    return "" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

export const init = () => {
    return {
        type : AppConst.INIT
    };
};



export const connect = () => {
    return {
        type : ACTIONS.CONNECT,
        id : actionId()
    };
};

export const fetch = (pageNum) => {
    return {
        type : ACTIONS.FETCH,
        pageNum: pageNum,
        id : actionId()
    }
}
