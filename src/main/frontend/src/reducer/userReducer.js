const initialState = {
    userData: null,
    userPosi: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return { ...state, userData: action.payload };
        case 'SET_USER_POSI':
            return { ...state, userPosi: action.payload };
        default:
            return state;
    }
};

export default userReducer;
