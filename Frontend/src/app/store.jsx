import { configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import dataReducer from "../features/dataSlice";
import appointmentsReducer from "../redux/actions/appointmentsActions";

import storage from "redux-persist/lib/storage" //? default : localStorage
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"

const persistConfig = {
    key: "root",
    storage,
    whitelist: ['auth'] // Only persist auth state
}

// Create a separate persist config for auth
const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ['currentUser', 'user', 'userId', 'token', 'userType'] // Only persist these fields
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer.reducer)

const store = configureStore({
    reducer:{
        auth: persistedAuthReducer,
        data: dataReducer,
        appointments: appointmentsReducer
    }, 
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store

