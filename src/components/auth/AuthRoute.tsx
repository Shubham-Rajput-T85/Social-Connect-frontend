import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const AuthRoute:React.FC<{children: React.ReactNode}> = (props) => {
    const {user, initialized} = useSelector((state: any) => state.auth);
    
    if (!initialized) {
        return <div>Loading...</div>; // prevent redirect until checked
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (<>
    {props.children};
    </>);
}

export default AuthRoute