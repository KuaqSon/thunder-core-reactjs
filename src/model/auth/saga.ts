import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as userAPI from '../../api/user-api';
import * as Action from './action';
import ActionType from './action-type';
import * as AuthService from '../../services/auth-service';

function* login(payload: any) {
  const { username, password } = payload;
  const { token, refreshToken } = yield call(userAPI.login, username, password);

  if (!token || !refreshToken) {
    return put(Action.loginFailed());
  }

  const user = yield call(userAPI.getUser);

  yield put(Action.loginSucceeded(user));

  AuthService.saveToken(token);
  AuthService.saveRefreshToken(refreshToken);
}

export default function* () {
  yield all([takeEvery(ActionType.LOGIN, login)]);
}
