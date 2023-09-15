/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  Navbar, Button, Nav, NavDropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from '../../routes';
import { useAuth } from '../../contexts/AuthProvider';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const { changeLanguage, resolvedLanguage } = i18n;

  const handleChangeLanguage = (lng) => {
    localStorage.setItem('userLanguage', lng);
    changeLanguage(lng);
  };
  return (
    <NavDropdown title={t('language')}>
      {i18n.languages
        .filter((lng) => lng !== resolvedLanguage)
        .map((lng) => (
          <NavDropdown.Item key={lng} onClick={() => handleChangeLanguage(lng)}>
            {i18n.getFixedT(lng)('language')}
          </NavDropdown.Item>
        ))}
    </NavDropdown>
  );
};

const header = () => {
  const { t } = useTranslation();
  const AuthButton = () => {
    const auth = useAuth();

    return (
      auth.loggedIn
        ? <Button onClick={auth.logOut} type="button" className="btn btn-primary">{t('exit')}</Button>
        : null
    );
  };

  return (

    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Navbar.Brand as={Link} to={routes.rootPage}>
          {t('chatLogo')}
        </Navbar.Brand>
        <Nav className="ml-auto">
          <LanguageSelector />
          <AuthButton />
        </Nav>
      </div>
    </nav>

  );
};

export default header;
