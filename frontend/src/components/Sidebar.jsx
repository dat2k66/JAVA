import React, { useState } from 'react';

function Sidebar({ activePage, onNavigate }) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toggleTools = () => {
    setIsToolsOpen((prev) => !prev);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src="/logo.png" alt="Logo" />
      </div>


      <nav className="sidebar__nav">
        <button
          type="button"
          className={`sidebar__link ${activePage === 'dashboard' ? 'sidebar__link--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Trang chủ
        </button>

        <div className="sidebar__dropdown">
          <button
            className="sidebar__dropdown-toggle"
            type="button"
            onClick={toggleTools}
            aria-expanded={isToolsOpen}
          >
            Công cụ
            <span className="sidebar__dropdown-caret">{isToolsOpen ? '▴' : '▾'}</span>
          </button>

          {isToolsOpen && (
            <div className="sidebar__dropdown-menu">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('schedule'); }}>
                Lên lịch chiếu
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('ticketsales'); }}>
                Bán vé
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('foodsales'); }}>
                Bán đồ ăn
              </a>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`sidebar__link ${activePage === 'analytics' ? 'sidebar__link--active' : ''}`}
          onClick={() => onNavigate('analytics')}
        >
          Thống kê
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
