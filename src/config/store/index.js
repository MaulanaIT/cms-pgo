import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from "next-redux-wrapper";

import storage from './syncStorage';
import reducer from "./reducer/index";

const makeStore = ({ isServer }) => {
  if (isServer) {
    //If it's on server side, create a store
    return configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      })
    });
  } else {
    //If it's on client side, create a store which will persist
    const { persistStore, persistReducer } = require('redux-persist');

    const persistConfig = {
      key: process.env.NEXT_PUBLIC_STORAGE_NAME,
      whitelist: ['auth'],
      storage,
    };

    // Create a new reducer with our existing reducer
    const persistedReducer = persistReducer(persistConfig, reducer);

    // Creating the store again
    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      })
    });

    // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature
    store.__persistor = persistStore(store);

    return store;
  }
}

export const wrapper = createWrapper(makeStore);
