import React, { useState } from 'react';
import GridIcon from './icons/GridIcon';
import BackArrow from './icons/BackArrow';

const navLinks = [
  { label: 'Просмотр', href: '#' },
  { label: 'Управление', href: '#' },
];

const Header: React.FC = () => {
  const [active, setActive] = useState<string>('Просмотр');

  return (
    <header className="header">
      <div className="container header__wrapper">
        <div className="header__logo">
          <GridIcon />
          <BackArrow />
        </div>
        <nav className="header__nav">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`header__link ${active === link.label ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActive(link.label);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
