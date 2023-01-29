import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

// create slice

const name = "patients";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const patientsActions = { ...slice.actions, ...extraActions };
export const patientsReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    patients: {},
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/patients`;

  return {
    getAll: getAll(),
  };

  function getAll() {
    return createAsyncThunk(
      `${name}/getAll`,
      async () => await fetchWrapper.get(baseUrl)
    );
  }
}

function createExtraReducers() {
  return {
    ...getAll(),
  };

  function getAll() {
    var { pending, fulfilled, rejected } = extraActions.getAll;
    return {
      [pending]: (state) => {
        state.patients = { loading: true };
      },
      [fulfilled]: (state, action) => {
        state.patients = action.payload;
      },
      [rejected]: (state, action) => {
        state.patients = { error: action.error };
      },
    };
  }
}
