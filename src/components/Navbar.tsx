import React, { useState } from 'react';

interface SubMenuItem {
  title: string;
  path: string;
  available: boolean;
}

interface MenuItem {
  title: string;
  path?: string;
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Inicio",
    path: "/"
  },
  {
    title: "Estabilidad",
    submenu: [
      {
        title: "Estabilidad de Cuerpos Sumergidos",
        path: "/stability",
        available: true
      },
      {
        title: "Metacentro y Altura Metacéntrica",
        path: "/metacenter",
        available: false
      },
      {
        title: "Estabilidad Dinámica",
        path: "/dynamic-stability",
        available: false
      }
    ]
  },
  {
    title: "Hidrostática",
    submenu: [
      {
        title: "Principio de Arquímedes",
        path: "/archimedes",
        available: false
      },
      {
        title: "Presión Hidrostática",
        path: "/hydrostatic-pressure",
        available: false
      }
    ]
  },
  {
    title: "Dinámica",
    submenu: [
      {
        title: "Ecuación de Bernoulli",
        path: "/bernoulli",
        available: false
      },
      {
        title: "Flujo en Tuberías",
        path: "/pipe-flow",
        available: false
      }
    ]
  }
];

const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (title: string) => {
    setActiveMenu(title);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="nav-title">Mecánica de Fluidos</h1>
        <div className="nav-links">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="nav-item"
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={item.path || '#'}
                className={`nav-link ${item.submenu ? 'has-submenu' : ''}`}
                onClick={item.submenu ? (e) => e.preventDefault() : undefined}
              >
                {item.title}
                {item.submenu && <span className="dropdown-arrow">▼</span>}
              </a>
              {item.submenu && activeMenu === item.title && (
                <div className="submenu">
                  {item.submenu.map((subItem) => (
                    <a
                      key={subItem.path}
                      href={subItem.available ? subItem.path : '#'}
                      className={`submenu-item ${!subItem.available ? 'disabled' : ''}`}
                      onClick={!subItem.available ? (e) => e.preventDefault() : undefined}
                    >
                      {subItem.title}
                      {!subItem.available && <span className="coming-soon">Próximamente</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 