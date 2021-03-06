import { auth as firebaseAuth } from '../firebase';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const VERIFY_REQUEST = 'VERIFY_REQUEST';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';

const requestLogin = () => ({
  type: LOGIN_REQUEST,
});

const receiveLogin = user => ({
  type: LOGIN_SUCCESS,
  user,
});

const loginError = error => ({
  type: LOGIN_FAILURE,
  error,
});

const requestLogout = () => ({
  type: LOGOUT_REQUEST,
});

const receiveLogout = () => ({
  type: LOGOUT_SUCCESS,
});

const logoutError = () => ({
  type: LOGOUT_FAILURE,
});

const verifyRequest = () => ({
  type: VERIFY_REQUEST,
});

const verifySuccess = () => ({
  type: VERIFY_SUCCESS,
});

export const loginUser = (email, password) => dispatch => {
  dispatch(requestLogin());
  firebaseAuth
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(receiveLogin(user));
    })
    .catch(error => {
      dispatch(loginError(error));
    });
};

export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  firebaseAuth
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch(error => {
      // Do something with the error if you want!
      dispatch(logoutError());
    });
};

export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  firebaseAuth.onAuthStateChanged(user => {
    if (user !== null) {
      dispatch(receiveLogin(user));
    }
    dispatch(verifySuccess());
  });
};
