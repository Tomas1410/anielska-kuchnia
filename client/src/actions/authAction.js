import axios from "axios";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "./types";
import { returnErrors } from "./errorAction";

export const loadUser = () => (dispatch, getState) => {
  //user loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/login/user", tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status, null));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

export const register = ({ name, email, password }) => dispatch => {
  //headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  //request body
  const body = JSON.stringify({ name, email, password })

  axios.post('/rejestracja', body, config)
    .then(res => dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
      dispatch({
        type: REGISTER_FAIL,

      })
    })

};

export const login = ({ email, password }) => dispatch => {
  //headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  //request body
  const body = JSON.stringify({ email, password })

  axios.post('/login', body, config)
    .then(res => dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.data, err.status, 'LOGIN_FAIL'));
      dispatch({
        type: LOGIN_FAIL
      })
    })

};

// Setup config/headers and token
export const tokenConfig = (getState) => {
  //get token from localstorage
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  //If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  }


}
