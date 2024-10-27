import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    userPosi: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    setUserPosi: (state, action) => {
      state.userPosi = action.payload;
  },
  },
});

export const { setUserData, setUserPosi } = userSlice.actions;
export default userSlice.reducer;