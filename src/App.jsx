import "./App.scss";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { history } from "_helpers";
import { PrivateRoute } from "_components";
import { Login } from "login";
import { Customer, PatientEyeDetails } from "customer";
import { Invoices } from "billing/Invoices";
import { Dashboard } from "home/Dashboard";
import { ProductMaster } from "inventory/ProductMaster";
import { login_bg } from "assets";
import PatientBill from "customer/PatientBill";
import { User } from "setting/User";
import NavbarComponent from "_components/Nav";
import CustomerOrders from "customer/CustomerOrders";
import TransactionModal from "billing/TransactionModal";
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
            path="/customers"
            element={
              <PrivateRoute>
                <Customer />
              </PrivateRoute>
            }
          >
            <Route
              path="eyeDetails/:customerId"
              element={
                <PrivateRoute>
                  <PatientEyeDetails />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="bill/:customerId"
              element={
                <PrivateRoute>
                  <PatientBill />
                </PrivateRoute>
              }
            /> */}
          </Route>
          <Route
            path="/customerOrders"
            element={
              <PrivateRoute>
                <CustomerOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Invoices />
              </PrivateRoute>
            }
          />
          {/* <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <TransactionModal />
                </PrivateRoute>
              }
            /> */}
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductMaster />
              </PrivateRoute>
            }
          />
          <Route
            path="users"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer transition={Flip}/>
      </div>
    </div>
  );
}
