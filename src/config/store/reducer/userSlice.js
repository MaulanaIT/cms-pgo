import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  showLoadingScreen: false,
  toastMessage: {
    active: false,
    background: null,
    message: null
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setShowLoadingScreen: (state, action) => {
      state.showLoadingScreen = action.payload;
    },
    setToastMessage: (state, action) => {
      const { background } = action.payload;

      switch (background) {
        case 'error':
          action.payload.background = '#DD5858';
          break;
        case 'success':
          action.payload.background = '#18B286';
          break;
        default:
          break;
      }

      state.toastMessage = action.payload;
    },
    clearData: (state) => {
      state.toastMessage = {
        active: false,
        background: null,
        message: null
      };
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.user,
      };
    },
  },
});

export const { clearData, setShowLoadingScreen, setToastMessage } = userSlice.actions;

export default userSlice.reducer;

export const getToastMessage = (state) => {
  return state.user.toastMessage;
}
export const getShowLoadingScreen = (state) => {
  return state.user.showLoadingScreen;
}
