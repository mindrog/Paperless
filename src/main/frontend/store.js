import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Assuming you have a combined reducer

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // 웹소켓 관련 상태를 직접적으로 Redux에 저장하지 않도록 명시적 경로 추가
                ignoredPaths: ['websocket'],
                ignoredActions: ['websocket/connect', 'websocket/disconnect', 'websocket/sendMessage'],
            },
        }),
});

export default store;
