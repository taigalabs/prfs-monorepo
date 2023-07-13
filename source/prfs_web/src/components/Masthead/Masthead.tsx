import React from 'react';

import styles from './Masthead.module.css';

const Logo = () => {
  return (
    <div>Prfs</div>
  )
}

const Masthead: React.FC<any> = () => {
  return (
    <div className={styles.wrapper}>
      <Logo />
    </div>
  );
};

export default Masthead;

