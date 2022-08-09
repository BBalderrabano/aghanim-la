import useAuth from "../../hooks/useAuth";
import PropTypes from 'prop-types';

const RequireRole = (props) => {
  const { auth } = useAuth();

  return auth?.roles?.find((role) => props.allowedRoles?.includes(role)) ? (
    props?.children
  ) : (
    props?.elseShow ? props.elseShow : <></>
  );
};

RequireRole.propTypes = {
  allowedRoles: PropTypes.array.isRequired
}

export default RequireRole;
