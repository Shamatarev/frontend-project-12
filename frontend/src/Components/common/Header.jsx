/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

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
        <Link to="/" className="navbar-brand">{t('chatLogo')}</Link>
        <AuthButton />
      </div>
    </nav>

  );
};

export default header;
