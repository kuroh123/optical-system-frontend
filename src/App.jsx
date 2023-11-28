import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { history } from "_helpers";
import { NavbarComponent, PrivateRoute } from "_components";
import { Login } from "login";
import { Customer, PatientEyeDetails, CustomerOutlet } from "customer";
import { Billing } from "billing/Billing";
import { Dashboard } from "home/Dashboard";
import { EditBilling } from "billing/EditBilling";
import { ProductMaster } from "inventory/ProductMaster";
import Setting from "setting/Setting";
import { login_bg } from "assets";
import PatientBill from "customer/PatientBill";
import { User } from "setting/User";
// import { RegisterPatient } from "patient";

export { App };

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className="app-container bg-light">
      <NavbarComponent />
      <div style={{}}>
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
            path="/customer"
            element={
              <PrivateRoute>
                <CustomerOutlet />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <PrivateRoute>
                  <Customer />
                </PrivateRoute>
              }
            />
            <Route
              path="eyeDetails/:patientId"
              element={
                <PrivateRoute>
                  <PatientEyeDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="bill/:patientId"
              element={
                <PrivateRoute>
                  <PatientBill />
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
          <Route path="/setting" element={<Outlet />}>
            <Route
              path="users"
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
}
