import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import sectionsReducer from "./slices/sectionsSlice";
import subsectionsReducer from "./slices/subsectionsSlice";
import documentsReducer from "./slices/documentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sections: sectionsReducer,
    subsections: subsectionsReducer,
    documents: documentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
