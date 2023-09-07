import React from 'react';
import { useTranslation } from 'react-i18next';
import notFoundImagePath from '../../assets/notFound.jpg';

const NotFound = () => {
  const { t } = useTranslation();
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Минимальная высота, чтобы контент занимал всю высоту окна просмотра
  };

  return (
    <div style={containerStyle}>
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
