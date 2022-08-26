import React from "react";
import {useTranslation} from "react-i18next";

import { useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

        <NavDropdown.Item href="/profile">
          <span>{t('profile')}</span>
          <AccountCircleIcon className="float-end"/>
        </NavDropdown.Item>

        <NavDropdown.Divider />

        <NavDropdown.Item
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        >
          <span>{t('logout')}</span>
          <LogoutIcon className="float-end"/>
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
};

export default LoggedInHeader;
