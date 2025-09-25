
import { authActions } from '../components/store/auth-slice';
import { alertActions } from '../components/store/alert-slice';
import { NavigateFunction } from 'react-router-dom';
import store from '../components/store/store';
import { getSocket } from '../socket';

export const initFetchInterceptor = (navigate: NavigateFunction) => {
  const originalFetch = window.fetch;

  window.fetch = async function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const response = await originalFetch(input, init);

    if (response.status === 401) {
      const state = store.getState();
      const currentUser: any = state.auth.user;

      if (currentUser?._id) {
        console.log("called at token expiration:",currentUser._id);
        const socket = getSocket();
        if (socket && socket.connected) {
          socket.emit("logout", currentUser._id);
        }
      }

      store.dispatch(authActions.clearUser());
      store.dispatch(
        alertActions.showAlert({ message: 'Session expired. Please login again.', severity: 'error' })
      );
      navigate('/login', { replace: true });
    }

    return response;
  } as typeof window.fetch; // TS assertion
};
