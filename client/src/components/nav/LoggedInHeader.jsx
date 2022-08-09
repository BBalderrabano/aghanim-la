import React from "react";
import {useTranslation} from "react-i18next";

import { useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import useAuth from '../../hooks/useAuth';

import { logout } from "../../api/user";

const LoggedInHeader = () => {
  const {t} = useTranslation(['common']);

  const { auth, setAuth } = useAuth();

  const navigation = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    logout()
      .then((res) => {
        setAuth(null);

        navigation("/login", { replace: true });
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <NavDropdown title={auth.user} id="collasible-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        >
          {t('logout')}
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
};

export default LoggedInHeader;
