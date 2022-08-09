import React from "react";
import {useTranslation} from 'react-i18next';
import SideNavLink from "./sidenav/SideNavLink";

const AdminToolsNavbar = () => {
  const {t} = useTranslation(['common']);

  let adminPrefix = process.env.REACT_APP_ADMIN_PREFIX;

  return (
    <div className="d-grip gap-2">
      <SideNavLink to={adminPrefix+"/classes"} title={t('classes')}/>
      <SideNavLink to={adminPrefix+"/users"} title={t('users')}/>
    </div>
  );
};

export default AdminToolsNavbar;