import React from "react";
import {useTranslation} from 'react-i18next';
import { Container, Navbar, Nav } from "react-bootstrap";

import LoggedInHeader from "./LoggedInHeader";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const {t} = useTranslation(['common']);

  const { auth } = useAuth();

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/">Aghanim</Navbar.Brand>

        <Nav className="mr-auto">
          {!auth?.user ? (
            <>
              <Nav.Link href="/login">{t('login')}</Nav.Link>
              <Nav.Link href="/signup">{t('signup')}</Nav.Link>
            </>
          ) : (
            <LoggedInHeader/>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
