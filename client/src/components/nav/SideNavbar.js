import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

import {useTranslation} from 'react-i18next';

import "./SideNavbar.css";

import UserToolsNavbar from "./UserToolsNavbar";
import AdminToolsNavbar from "./AdminToolsNavbar";

import RequireRole from "../auth/RequireRole";

const SideNavbar = () => {
  const {t} = useTranslation(['common']);

  const [sidebar, setSidebar] = useState(true);

  const [_width, setWidth] = useState("25%");

  const styles = {
    sidenav: {
      height: "100%",
      width: _width,
      zIndex: "1",
      top: "0",
      left: "0",
      transition: ".5s ease",
      overflowX: "hidden",
      paddingTop: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      float: "left",
      borderRight: "1px solid #dee2e6",
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1065) {
        setWidth("40%");
      } else {
        setWidth("25%");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={styles.sidenav}>
      <RequireRole
        allowedRoles={[
                          parseInt(process.env.REACT_APP_ADMIN_ROLE),
                          parseInt(process.env.REACT_APP_EDITOR_ROLE)
                      ]}
        elseShow={<UserToolsNavbar />}>
        <Tabs
          transition={false}
          defaultActiveKey={
            window.location.href.indexOf(process.env.REACT_APP_ADMIN_PREFIX) > -1
              ? 'admintools'
              : 'usertools'}
          id="toolsTabs"
          className="mb-3"
          style={{ width: "100%" }}
          fill
        >
          <Tab style={{ width: "100%" }} eventKey="usertools" title={t('user')}>
            <UserToolsNavbar />
          </Tab>
          <Tab style={{ width: "100%" }} eventKey="admintools" title={t('admin')}>
            <AdminToolsNavbar />
          </Tab>
        </Tabs>
      </RequireRole>
    </div>
  );
};

export default SideNavbar;
