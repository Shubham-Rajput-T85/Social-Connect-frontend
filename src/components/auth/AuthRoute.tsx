import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import Loader from '../ui/Loader';
import { Box } from '@mui/material';

const AuthRoute:React.FC<{children: React.ReactNode}> = (props) => {
    const {user, initialized} = useSelector((state: any) => state.auth);
    
    if (!initialized) {
        return (<Box
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
      </Box> ); // prevent redirect until checked
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (<>
    {props.children};
    </>);
}

export default AuthRoute