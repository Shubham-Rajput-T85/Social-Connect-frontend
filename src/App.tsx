import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Navbar from './components/header/Navbar';
import Main from './components/ui/Main';
import Signup from "./components/auth/Signup";
import Login from './components/auth/Login';
import { useDispatch, useSelector } from 'react-redux';
import SnackbarAlert from './components/ui/SnackbarAlert';
import { alertActions } from './components/store/alert-slice';
import AuthRoute from "./components/auth/AuthRoute";
import { useEffect } from 'react';
import { authActions } from './components/store/auth-slice';
import Home from './components/pages/Home/Home';
import { Box, Paper } from '@mui/material';
import Sidebar from './components/ui/Sidebar';
import Page from './components/ui/Page';
import ProfilePage from './components/pages/profile/ProfilePage';
import { connectSocket, getSocket, initSocket, registerUser } from './socket';
import { initFetchInterceptor } from './api/fetchInterceptor';
import { onlineUsersActions } from './components/store/onlineUsers-slice';
import MessageChatLayout from './components/pages/message/MessageChatLayout';

initSocket();

function App() {
  const alertState = useSelector((state: any) => state.alert);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initFetchInterceptor(navigate);
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const res = await fetch("http://localhost:8080/auth/me", {
          method: "GET",
          credentials: "include", // VERY important for HttpOnly cookies
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();

        if (data.user && data.user._id) {
          connectSocket();
          registerUser();
        }

        dispatch(authActions.setUser(data.user));
      } catch (err) {
        dispatch(authActions.clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();

    // Fetch initial list
    socket.emit("getOnlineUsers", (onlineUserIds: string[]) => {
      dispatch(onlineUsersActions.setOnlineUsers(onlineUserIds));
    });

    // Listen for user online/offline events
    socket.on("userOnline", ({ userId }) => {
      dispatch(onlineUsersActions.addOnlineUser(userId));
    });

    socket.on("userOffline", ({ userId }) => {
      dispatch(onlineUsersActions.removeOnlineUser(userId));
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [dispatch]);

  const handleOnClose = () => {
    if (alertState.callBack) {
      alertState.callBack();
    }
    dispatch(alertActions.clearAlert());
  }

  const showHeader = !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="App">
      {showHeader && (
        <Header>
          <Navbar />
        </Header>
      )}

      <Main>
        <SnackbarAlert severity={alertState.severity} message={alertState.message} onClose={handleOnClose} />
        <Routes>
          {/* Public Routes */}
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />

          {/* Protected Routes */}
          <Route path='/'
            element={
              <Page>
                <AuthRoute>
                  <Home />
                </AuthRoute>
              </Page>
            }
          />

          {/* Redirect /Home → / */}
          <Route path='/home' element={
            <AuthRoute>
              <Navigate to="/" />
            </AuthRoute>
          } />

          <Route
            path="/profile/*"
            element={
              <Page>
                <AuthRoute>
                  <ProfilePage />
                </AuthRoute>
              </Page>
            }
          />

          <Route
            path="/message/*"
            element={
              <Page>
                <AuthRoute>
                  <MessageChatLayout />
                </AuthRoute>
              </Page>
            }
          />

          {/* Catch-all route */}
          <Route path='/*' element={
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 4fr",
                gap: 2,
                padding: 2,
                height: "100%"
              }}
            >
              <Sidebar />
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%" }}>Page not found</Paper>
              </Box>
            </Box>
          } />
        </Routes>
      </Main>
    </div>
  )
}

export default App;
