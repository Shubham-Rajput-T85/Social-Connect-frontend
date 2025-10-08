import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../ui/Loader';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized } = useSelector((state: any) => state.auth);

  if (!initialized) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <Loader />
      </Box>
    );
  }

  if (user?._id) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
