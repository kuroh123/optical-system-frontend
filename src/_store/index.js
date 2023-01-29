import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./auth.slice";
import { usersReducer } from "./users.slice";
import { patientsReducer } from "./patients.slice";

export * from "./auth.slice";
export * from "./users.slice";
export * from "./patients.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    patients: patientsReducer,
  },
});
