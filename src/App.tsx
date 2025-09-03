import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Navbar from './components/header/Navbar';
import Main from './components/ui/Main';

import Signup from "./components/auth/Signup"
import Login from './components/auth/Login';
import { useDispatch, useSelector } from 'react-redux';
import SnackbarAlert from './components/ui/SnackbarAlert';
import { alertActions } from './components/store/alert-slice';
import AuthRoute from "./components/auth/AuthRoute";
import { useEffect } from 'react';
import { authActions } from './components/store/auth-slice';
import Home from './components/pages/Home';

function App() {  
  const alertState = useSelector((state: any) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          method: "GET",
          credentials: "include", // VERY important for HttpOnly cookies
        });
        console.log(res);

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();
        dispatch(authActions.setUser(data.user));
      } catch (err) {
        dispatch(authActions.clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleOnClose = () => {
    if (alertState.callBack) {
      alertState.callBack();
    }
    dispatch(alertActions.clearAlert());
  }

  return (
    <div className="App">
      <Header>
        <Navbar />
      </Header>
      <Main>
        <SnackbarAlert severity={ alertState.severity } message={ alertState.message } onClose={ handleOnClose } />
        <Routes>
          <Route path='/' element={ <AuthRoute><Home /></AuthRoute> }/>      
          <Route path='/Home' element={ <AuthRoute><Home /></AuthRoute> }/>  
          <Route path='/signup' element={ <Signup /> }/>
          <Route path='/login' element={ <Login/> }/>
          <Route path='/*' element={ <div>Page Not Found</div> }/>
        </Routes>
      </Main>
    </div>
  );
}

export default App;

