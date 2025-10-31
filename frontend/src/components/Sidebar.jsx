import React, { useState } from 'react';

function Sidebar({ activeView, onNavigate }) {
  const [isToolsOpen, setIsToolsOpen] = useState(true);

  const Item = ({ id, children }) => (
    <button
      type="button"
      className={`sidebar__link ${activeView === id ? 'sidebar__link--active' : ''}`}
      onClick={() => onNavigate && onNavigate(id)}
    >
      {children}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src="/logo.png" alt="Logo" />
      </div>

      <nav className="sidebar__nav">
        <Item id="dashboard">Trang chủ</Item>

        <div className="sidebar__dropdown">
          <button
            className="sidebar__dropdown-toggle"
            type="button"
            onClick={() => setIsToolsOpen((v) => !v)}
            aria-expanded={isToolsOpen}
          >
            Công cụ
            <span className="sidebar__dropdown-caret">{isToolsOpen ? '▾' : '▸'}</span>
          </button>

          {isToolsOpen && (
            <div className="sidebar__dropdown-menu">
              <Item id="ticket-sales">Bán vé</Item>
              <Item id="food-sales">Bán đồ ăn</Item>
              <Item id="schedule">Lên lịch chiếu</Item>
            </div>
          )}
        </div>

        <Item id="analytics">Thống kê</Item>
      </nav>
    </aside>
  );
}

export default Sidebar;
