import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { login_bg, login_icon, login_icon_btn } from "assets";

import { history } from "_helpers";
import { authActions } from "_store";
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
      className="d-flex justify-content-center align-items-center"
      style={{ ...styles.loginBg, height: "100vh", overflow: "hidden" }}
    >
      <div style={styles.loginCard}>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <img className="mr-3" src={login_icon} />
          <div
            style={{
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "40px",
              lineHeight: "48px",
            }}
          >
            User Login
          </div>
        </div>
        <div
          style={{
            width: "650px",
            height: "0px",
            left: "418px",
            top: "406px",
            marginTop: "5px",
            border: "1px solid #F2F4B3",
            // transform: "rotate(-0.09deg)",
          }}
        />
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group d-flex justify-content-center mt-5">
              <button
                disabled
                style={styles.buttonIcon}
                class="fa fa-user-o"
              ></button>
              <input
                style={styles.loginInput}
                placeholder="username"
                name="username"
                type="text"
                {...register("username")}
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="form-group d-flex justify-content-center">
              <button
                disabled
                style={styles.buttonIcon}
                class="fa fa-key"
              ></button>
              <input
                style={styles.loginInput}
                placeholder="password"
                name="password"
                type="password"
                {...register("password")}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div className="d-flex justify-content-center">
              <span
                style={{ position: "absolute", margin: "31px 0px 0px 50px" }}
              >
                <img src={login_icon_btn} width={35} height={25} />
              </span>
              <button
                style={styles.loginButton}
                disabled={isSubmitting}
                className="mt-4"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Login
              </button>
            </div>
            {authError && (
              <div className="alert alert-danger mt-3 mb-0">
                {authError.message}
              </div>
            )}
          </form>
        </div>
      </div>
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
    textAlign: "left",
    border: "none",
  },
};
