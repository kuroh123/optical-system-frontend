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
  RegisterPatient,
  EditPatient,
  PatientPrescription,
} from "patient";
import { useDispatch, useSelector } from "react-redux";
import { patientsActions } from "_store";
import { useEffect } from "react";
import { Prescription } from "prescription/Prescription";
import { ListPrescription } from "prescription/ListPrescription";
import { ViewPrescription } from "prescription/ViewPrescription";
import { Billing } from "billing/Billing";
import { Dashboard } from "home/Dashboard";
import { EditBilling } from "billing/EditBilling";
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
                <Dashboard />
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
            <Route
              index
              element={
                <PrivateRoute>
                  <Patient />
                </PrivateRoute>
              }
            />
            <Route
              path=":patientId"
              element={
                <PrivateRoute>
                  <PatientPrescription />
                </PrivateRoute>
              }
            />
            <Route
              path=":patientId/edit"
              element={
                <PrivateRoute>
                  <EditPatient />
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path="/billing"
            element={
              <PrivateRoute>
                <Billing />
              </PrivateRoute>
            }
          >
            <Route
              path=":billingId"
              element={
                <PrivateRoute>
                  <EditBilling />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
