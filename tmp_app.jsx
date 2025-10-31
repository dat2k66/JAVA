import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TicketSales from './pages/TicketSales.jsx';

function App() {
  const [view, setView] = useState('ticket-sales');
  return (
    <div className="app-shell">
      <Sidebar activeView={view} onNavigate={setView} />

      <main className="main-view">
        {view === 'ticket-sales' ? (
          <TicketSales />
        ) : (
          <section className="dashboard">
            <div className="dashboard__hero">
              <img className="dashboard__hero-image" src="/banner.png" alt="Cinema Banner" />
              <div className="dashboard__welcome">
                <p>Xin chào</p>
                <p>Mừng quay trở lại!</p>
              </div>
            </div>

            <div className="dashboard__stats">
              {[{
                id: 'films',
                title: 'Số lượng phim',
                value: '50'
              }, {
                id: 'ticket-count',
                title: 'Tổng số vé đã bán',
                value: '5000'
              }, {
                id: 'revenue',
                title: 'Tổng doanh thu',
                value: '10.00'
              }].map((item) => (
                <article key={item.id} className="stat-card">
                  <header>{item.title}</header>
                  <div className="stat-card__value">{item.value}</div>
                  <button className="stat-card__cta" type="button">Xem chi tiết</button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;


