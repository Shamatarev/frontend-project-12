import React from 'react';
import { useTranslation } from 'react-i18next';
import notFoundImagePath from '../../assets/notFound.jpg';
import '../styles/notFound.css';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="containerStyle">
      <img src={notFoundImagePath} alt={t('pageNotFound')} className="img-fluid h-25" />
      <h1>{t('pageNotFound')}</h1>
      <p className="text-muted">
        {t('youCanGo')}
        {' '}
        <a href="/">{t('homePage')}</a>
      </p>
    </div>
  );
};

export default NotFound;
