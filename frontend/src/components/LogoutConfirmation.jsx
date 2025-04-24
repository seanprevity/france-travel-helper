import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/LogoutConfirmation.css';

const LogoutConfirmation = ({ onConfirm, onCancel }) => {
  const { t } = useLanguage();

  return (
    <div className="logout-overlay">
      <div className="logout-card">
        <h3 className="logout-title">{t('logoutConfirm')}</h3>
        <div className="logout-buttons">
          <button onClick={onCancel} className="logout-cancel">
            {t('cancel')}
          </button>
          <button onClick={onConfirm} className="logout-confirm">
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
