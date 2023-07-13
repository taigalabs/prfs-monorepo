import React from 'react';

import styles from './Masthead.module.css';
import { I18nContext } from '@/contexts';

const Logo = ({
  label,
}) => {
  return (
    <div>{label}</div>
  )
}

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <Logo label={i18n.logo_label} />
    </div>
  );
};

export default Masthead;

