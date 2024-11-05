import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    totalUnreadCount: 0, // 전체 unread 메시지 개수 초기값
  },
  reducers: {
    setTotalUnreadCount: (state, action) => {
      state.totalUnreadCount = action.payload; // 액션을 통해 전달받은 unread 개수로 상태 업데이트
    },
  },
});

export const { setTotalUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;