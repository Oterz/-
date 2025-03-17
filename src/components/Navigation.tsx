import React, { useState } from 'react';
import ListItemIcon from './icons/ListItemIcon';
import DropListIcon from './icons/DropListIcon';

const menuItems = [
  { label: 'По проекту' },
  { label: 'Объекты' },
  { label: 'РД' },
  { label: 'МТО' },
  { label: 'СМР' },
  { label: 'График' },
  { label: 'МиМ' },
  { label: 'Рабочие' },
  { label: 'Капвложения' },
  { label: 'Бюджет' },
  { label: 'Финансирование' },
  { label: 'Панорамы' },
  { label: 'Камеры' },
  { label: 'Поручения' },
  { label: 'Контрагенты' },
];

const Navigation: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('СМР'); 

  return (
    <aside className="navigation">
    <div className="navigation__project">
        <div className="navigation__project-info">
        <div className="navigation__project-title">Название проекта</div>
        <div className="navigation__project-subtitle">Аббревиатура</div>
    </div>
  <DropListIcon />
</div>

      <nav className="navigation__menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`navigation__item ${
              activeItem === item.label ? 'active' : ''
            }`}
            onClick={() => setActiveItem(item.label)}
          >
            <ListItemIcon />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Navigation;
