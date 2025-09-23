
import { authActions } from '../components/store/auth-slice';
import { alertActions } from '../components/store/alert-slice';
import { NavigateFunction } from 'react-router-dom';
import store from '../components/store/store';

export const initFetchInterceptor = (navigate: NavigateFunction) => {
  const originalFetch = window.fetch;

  window.fetch = async function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const response = await originalFetch(input, init);

    if (response.status === 401) {
      store.dispatch(authActions.clearUser());
      store.dispatch(
        alertActions.showAlert({ message: 'Session expired. Please login again.', severity: 'error' })
      );
      navigate('/login', { replace: true });
    }

    return response;
  } as typeof window.fetch; // TS assertion
};
