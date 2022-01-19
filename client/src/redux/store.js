import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// import { composeWithDevTools } from "redux-devtools-extension";
// import logger from "redux-logger";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/auth-reducer";

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  // logger,
];

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"],
};

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
  },
  middleware,
  devTools: process.env.NODE_ENV === "development",
});

// export default store;
const persistor = persistStore(store);

const state = {
  store,
  persistor,
};

export default state;
