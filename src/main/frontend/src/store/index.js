import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 기본적으로 localStorage 사용
import { combineReducers } from 'redux'; // combineReducers 가져오기
import userReducer from './userSlice'; // 사용자 Slice 가져오기

// persistConfig 설정
const persistConfig = {
    key: 'root',
    storage,
};

// rootReducer 설정
const rootReducer = combineReducers({
    user: userReducer, // 사용자 리듀서 추가
    // 필요 시 다른 리듀서 추가
});

// persistedReducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
const store = configureStore({
    reducer: persistedReducer,
});

// persistStore 생성
const persistor = persistStore(store);

// store와 persistor 내보내기
export { store, persistor };