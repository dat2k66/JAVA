import React, { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Analytics from './pages/Analytics.jsx';
import FoodSales from './pages/FoodSales.jsx';
import TicketSales from './pages/TicketSales.jsx';
import Schedule from './pages/Schedule.jsx';


function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('now');

  const { nowShowingMovies, upcomingMovies } = useMemo(() => ({
    nowShowingMovies: [{
      id: 'now-1',
      image: '/hinh1.jpg',
      title: 'Bịt Mắt Bắt Tai',
      genre: 'Giật gân, Hồi Hộp',
      duration: '92 phút'
    }, {
      id: 'now-2',
      image: '/hinh2.jpg',
      title: 'Thành Phố Thất Lạc',
      genre: 'Hành động, Phiêu lưu',
      duration: '105 phút'
    }, {
      id: 'now-3',
      image: '/hinh3.jpg',
      title: 'Vực Thẳm Vô Hình',
      genre: 'Kinh dị, Tâm lý',
      duration: '98 phút'
    }],
    upcomingMovies: [{
      id: 'upcoming-1',
      image: '/hinh4.jpg',
      title: 'Cải Mả',
      genre: 'Giật gân, Hồi Hộp',
      duration: '92 phút'
    }, {
      id: 'upcoming-2',
      image: '/hinh5.jpg',
      title: 'Kinh Dị Nhật Vị',
      genre: 'Kinh dị, Hồi hộp',
      duration: '104 phút'
    }, {
      id: 'upcoming-3',
      image: '/hinh6.jpg',
      title: 'Phá Đám Sinh Nhật Mẹ',
      genre: 'Hài, Gia đình',
      duration: '101 phút'
    }]
  }), []);

  const moviesToRender = activeTab === 'now' ? nowShowingMovies : upcomingMovies;

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="main-view">
        {activePage === 'dashboard' ? (
          <section className="dashboard">
            <div className="dashboard__hero">
              <img className="dashboard__hero-image" src="/banner.png" alt="Cinema Banner" />
              <div className="dashboard__welcome">
                <p>Xin chào A</p>
                <p>Mừng quay trở lại!</p>
              </div>
            </div>

            <div className="dashboard__stats">
              {[{
                id: 'films',
                title: 'Số lượng phim:',
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
            <div className="than1">
              <button
                type="button"
                className={`than1__tab ${activeTab === 'now' ? 'than1__tab--active' : ''}`}
                onClick={() => setActiveTab('now')}
              >
                PHIM ĐANG CHIẾU
              </button>
              <button
                type="button"
                className={`than1__tab ${activeTab === 'upcoming' ? 'than1__tab--active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                PHIM SẮP CHIẾU
              </button>
            </div>
            <div className="dangchieu">
              {moviesToRender.map((movie) => (
                <div key={movie.id} className="the1">
                  <img src={movie.image} alt={movie.title} />
                  <h1>{movie.title}</h1>
                  <p>Thể loại: {movie.genre}</p>
                  <p>Thời lượng: {movie.duration}</p>
                  <button className="buy" type="button">MUA VÉ</button>
                </div>
              ))}
            </div>
          </section>
        ) : activePage === 'ticketsales' ? (
          <TicketSales />
        ) : activePage === 'foodsales' ? (
          <FoodSales />
        ) : activePage === 'schedule' ? (
          <Schedule />
        ):(
          <Analytics />
        )}
      </main>
    </div>
  );
}

export default App;
