import UserController from '../controllers/UserController';

export const actionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',

  RESETPASS: 'RESETPASS',
  RESETPASS_REQUEST: 'RESETPASS_REQUEST',
  RESETPASS_ERROR: 'RESETPASS_ERROR',
  RESETPASS_SUCCESS: 'RESETPASS_SUCCESS',

  CHANGEPASS: 'CHANGEPASS',
  CHANGEPASS_REQUEST: 'CHANGEPASS_REQUEST',
  CHANGEPASS_ERROR: 'CHANGEPASS_ERROR',
  CHANGEPASS_SUCCESS: 'CHANGEPASS_SUCCESS',

  EDIT: 'EDIT',

  REMOVE_USER: 'REMOVE_USER',
};

const loginRequest = () => ({
  type: actionTypes.LOGIN_REQUEST,
});

const loginError = error => ({
  type: actionTypes.LOGIN_ERROR,
  error,
});

const loginSuccess = user => ({
  type: actionTypes.LOGIN_SUCCESS,
  user,
});

const resetPassRequest = () => ({
  type: actionTypes.RESETPASS_REQUEST,
});

const resetPassError = error => ({
  type: actionTypes.RESETPASS_ERROR,
  error,
});

const resetPassSuccess = user => ({
  type: actionTypes.RESETPASS_SUCCESS,
  user,
});

const changePassRequest = () => ({
  type: actionTypes.CHANGEPASS_REQUEST,
});

const changePassError = error => ({
  type: actionTypes.CHANGEPASS_ERROR,
  error,
});

const changePassSuccess = user => ({
  type: actionTypes.CHANGEPASS_SUCCESS,
  user,
});

const editRequest = () => ({
  type: actionTypes.EDIT,
});

const logoutRequest = () => ({
  type: actionTypes.LOGOUT,
});

const removeUser = user => ({
  type: actionTypes.REMOVE_USER,
  user: null,
});

export const login = (email, password, token_firebase) => async dispatch => {
  dispatch(loginRequest());
  try {
    const user = await UserController.login(email, password, token_firebase);
    dispatch(loginSuccess(user.Data));
    console.log('userrrrr', user);
    // alert("JSON.stringify(user)");
  } catch (error) {
    alert(error);
    dispatch(loginError(error));
  }
};

export const reset = (newPass, conPass, email) => async dispatch => {
  dispatch(resetPassRequest());
  try {
    const user = await UserController.resetPassword(newPass, conPass, email);
    console.log(user);

    alert('Please Back to Login');
    dispatch(resetPassSuccess(user.Data));
    dispatch(logout());
  } catch (error) {
    console.log(error);

    dispatch(resetPassError(error));
  }
};

export const logout = () => async dispatch => {
  UserController.logout();
  dispatch(logoutRequest());
  // dispatch(logout());
  dispatch(removeUser());
};

export const saveProfile = data => async dispatch => {
  const res = await UserController.saveProfile(data);
  alert(res.Pesan);
  dispatch(editRequest());
};

export const changePass = (email, pass, conpass) => async dispatch => {
  dispatch(changePassRequest());
  try {
    const res = await UserController.changePassword(email, pass, conpass);
    alert(res.Pesan);
    dispatch(changePassSuccess(res.Data));
  } catch (error) {
    dispatch(changePassError(error));
  }
};
