import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { login_bg, login_icon, login_icon_btn } from "assets";
// import {  } from "react-icons/bs";

import { history } from "_helpers";
import { authActions } from "_store";
import { Button, Card } from "react-bootstrap";
export { Login };

function Login() {
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x.auth.user);
  const authError = useSelector((x) => x.auth.error);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }) {
    return dispatch(authActions.login({ username, password }));
  }

  return (
    <div
      className="min-vh-100 w-100 d-flex align-items-center justify-content-center"
      style={{
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <Card
        className="border-0 shadow-lg"
        style={{
          borderRadius: "20px",
          maxWidth: "600px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Header with Logo/Brand */}
        <Card.Header
          className="text-center py-4 border-0"
          style={{
            background: "linear-gradient(135deg, #04364A 0%, #176B87 100%)",
            color: "white",
          }}
        >
          <div className="mb-2">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                fontSize: "24px",
              }}
            >
              👓
            </div>
            <h3 className="mb-1 fw-bold">Sultan Opticals</h3>
            <p className="mb-0 opacity-75">Optical Management System</p>
          </div>
        </Card.Header>

        <Card.Body className="p-5">
          {/* Demo Credentials */}
          <div
            className="alert border-0 text-center py-3 mb-4"
            style={{
              backgroundColor: "#F0F9FF",
              border: "2px dashed #0EA5E9",
              borderRadius: "12px",
            }}
          >
            <div className="d-flex align-items-center justify-content-center mb-2">
              <span className="me-2">🔑</span>
              <strong className="text-primary">Demo Credentials</strong>
            </div>
            <div className="small text-muted">
              <div className="mb-1">
                <strong>Username:</strong> <code>sultan@gmail.com</code>
              </div>
              <div>
                <strong>Password:</strong> <code>sultan@123</code>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field */}
            <div className="form-group mb-4">
              <label className="form-label text-muted fw-medium mb-2">
                <i className="fa fa-user-o me-2"></i>Username
              </label>
              <input
                placeholder="Enter your username"
                name="username"
                type="text"
                {...register("username")}
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "10px",
                  border: "2px solid #E5E7EB",
                  padding: "12px 16px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#04364A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username?.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group mb-4">
              <label className="form-label text-muted fw-medium mb-2">
                <i className="fa fa-key me-2"></i>Password
              </label>
              <input
                placeholder="Enter your password"
                name="password"
                type="password"
                {...register("password")}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "10px",
                  border: "2px solid #E5E7EB",
                  padding: "12px 16px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#04364A")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              )}
            </div>

            {/* Login Button */}
            <Button
              disabled={isSubmitting}
              className="w-100 py-3 border-0 fw-bold text-white"
              style={{
                background: "linear-gradient(135deg, #04364A 0%, #176B87 100%)",
                borderRadius: "10px",
                fontSize: "16px",
                transition: "all 0.3s ease",
              }}
              type="submit"
              onMouseEnter={(e) =>
                (e.target.style.transform = "translateY(-1px)")
              }
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in me-2"></i>
                  Sign In
                </>
              )}
            </Button>

            {/* Error Message */}
            {authError && (
              <div
                className="alert alert-danger mt-4 mb-0 border-0"
                style={{ borderRadius: "10px" }}
              >
                <i className="fa fa-exclamation-triangle me-2"></i>
                {authError.message}
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-top">
            <small className="text-muted">
              © 2025 Sultan Opticals. All rights reserved.
            </small>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .login-container {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(4, 54, 74, 0.25) !important;
        }

        .btn:hover {
          box-shadow: 0 4px 12px rgba(4, 54, 74, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  loginBg: {
    backgroundImage: `url(${login_bg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  loginCard: {
    filter: "drop-shadow(6px 4px 4px rgba(0, 0, 0, 0.25))",
    background: "rgba(242, 244, 179, 0.5)",
    borderRadius: "31px",
    height: "320px",
    width: "650px",
  },
  loginInput: {
    background: "#D9D9D9",
    width: "434px",
    borderRadius: "0px",
    border: "none",
  },
  _buttonIcon: {
    width: "28px",
    border: "None",
    background: "#D9D9D9",
    color: "black",
  },
  get buttonIcon() {
    return this._buttonIcon;
  },
  set buttonIcon(value) {
    this._buttonIcon = value;
  },
  loginButton: {
    width: "100px",
    height: "40px",
    background: "#00045E",
    borderRadius: "10px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "27px",
    color: "#FFFFFF",
    border: "none",
  },
};
