import { createSlice } from '@reduxjs/toolkit';

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    emailUnreadCountState: 0, // 읽지 않은 메일 개수 초기값
  },
  reducers: {
    setUnreadCount(state, action) {
      state.emailUnreadCountState = action.payload;
    },
    triggerUnreadCountUpdate(state) {
      if (state.emailUnreadCountState > 0) {
        state.emailUnreadCountState -= 1;
      }
    },
  },
});

export const { setUnreadCount, triggerUnreadCountUpdate } = emailSlice.actions;
export default emailSlice.reducer;