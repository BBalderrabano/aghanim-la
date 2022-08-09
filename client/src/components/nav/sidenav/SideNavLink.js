import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";

const SideNavLink = ({ to, title, ...rest }) => {
  let location = useLocation();
  let isActive = location.pathname === to;

  return (
    <Link to={to} {...rest}>
      <Button style={{width: "90%", marginBottom: "10px"}} variant="primary" size="lg" active={isActive}>
        {title}
      </Button>
    </Link>
  );
};

export default SideNavLink;
