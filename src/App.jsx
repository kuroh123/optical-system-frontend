import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { history } from "_helpers";
import { NavbarComponent, PrivateRoute } from "_components";
import { Home } from "home";
import { Login } from "login";
import {
  Patient,
  PatientOutlet,
  PatientRequest,
  RegisterPatient,
} from "patient";
import { useDispatch, useSelector } from "react-redux";
import { patientsActions } from "_store";
import { useEffect } from "react";
// import { RegisterPatient } from "patient";

export { App };

function App() {
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();
  // const { user } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(patientsActions.getAll());
  // }, [user]);

  return (
    <div className="app-container bg-light">
      <NavbarComponent />
      <div className="container pt-4 pb-4">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PrivateRoute>
                <RegisterPatient />
              </PrivateRoute>
            }
          />
          <Route
            path="/patient"
            element={
              <PrivateRoute>
                <PatientOutlet />
              </PrivateRoute>
            }
          >
            <Route index element={<Patient />} />
            <Route path=":id" element={<PatientRequest />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
