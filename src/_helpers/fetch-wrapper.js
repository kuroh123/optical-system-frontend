import { store, authActions } from "_store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};

function request(method) {
  return (url, body, msg) => {
    const requestOptions = {
      method,
      headers: authHeader(url),
    };
    if (body) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(url, requestOptions).then((res) => handleResponse(res, msg));
  };
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = authToken();
  const isLoggedIn = !!token;
  const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function authToken() {
  return store.getState().auth.user?.token;
}

function handleResponse(response, msg) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && authToken()) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        const logout = () => store.dispatch(authActions.logout());
        logout();
      }

      const error = (data && data.message) || response.statusText;
      toast.error(data.message, { theme: "colored" });
      return Promise.reject(error);
    }
    toast.success(msg, { theme: "colored" });
    return data;
  });
}
