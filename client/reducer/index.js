export default function reducer(state = [], action) {
    switch(action.type) {
        case "GET_DATA":
        return {
            data: action.data
        };
        case "GET_DATA_PENDING":
        return {
            data: null,
            pending: true
        };
        default:
        return state;
    }
}
