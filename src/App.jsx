import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { history } from "_helpers";
import { NavbarComponent, PrivateRoute } from "_components";
import { Login } from "login";
import {
  Patient,
  PatientOutlet,
  RegisterPatient,
  EditPatient,
  PatientPrescription,
} from "patient";
import { Billing } from "billing/Billing";
import { Dashboard } from "home/Dashboard";
import { EditBilling } from "billing/EditBilling";
import { ProductMaster } from "inventory/ProductMaster";
// import { RegisterPatient } from "patient";

export { App };

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();

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
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductMaster />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
}
