import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { getImagePath } from '../../utils/utils';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  return (
    <div className={styles.container}>
      <h3>신성종합상사</h3>
      <button onClick={toggleDarkMode} className={isDarkMode ? styles.lightmode : styles.darkmode}>
        <img
          src={getImagePath(isDarkMode ? 'btn_icon_lightmode' : 'btn_icon_darkmode')}
          alt='모드'
        />
      </button>
    </div>
  );
};

export default Header;
