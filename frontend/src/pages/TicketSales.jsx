import React, { useEffect, useMemo, useState } from 'react';
import SeatPicker from '../components/SeatPicker.jsx';
import '../style/ticket.css';
import '../style/filter.css';

const SAMPLE = [
  { id: 1, name: 'The Midnight Voyage', type: 'Hành động', time: '20:15  -  31/10/2025', room: 'R1', quantity: 120, price: 90000, sold: 86, status: 'Đang bán' },
  { id: 2, name: 'Autumn Whisper',       type: 'Tình cảm',   time: '18:00  -  31/10/2025', room: 'R2', quantity: 90,  price: 75000, sold: 90, status: 'Hết chỗ' },
  { id: 3, name: 'Neon City',             type: 'Khoa học viễn tưởng', time: '22:00  -  31/10/2025', room: 'IMAX', quantity: 150, price: 120000, sold: 34, status: 'Đang bán' },
];

const MOVIES = [
  { id: 'm1', name: 'The Midnight Voyage', type: 'Hành động' },
  { id: 'm2', name: 'Autumn Whisper',      type: 'Tình cảm' },
  { id: 'm3', name: 'Neon City',           type: 'Khoa học viễn tưởng' },
];

export default function TicketSales() {
  const [keyword, setKeyword] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [roomFilter, setRoomFilter] = useState('Tất cả');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);

  const [data, setData] = useState(SAMPLE);

  const priceBounds = useMemo(() => {
    const prices = data.map((d) => d.price);
    return { min: Math.min(...prices, 0), max: Math.max(...prices, 200000) };
  }, [data]);

  const roomOptions = useMemo(() => {
    const set = new Set(['Tất cả']);
    data.forEach((d) => set.add(d.room));
    return Array.from(set);
  }, [data]);

  const rows = useMemo(() => {
    return data.filter((r) => {
      const matchKeyword = r.name.toLowerCase().includes(keyword.toLowerCase().trim());
      const matchType = typeFilter === 'Tất cả' || r.type === typeFilter;
      const matchStatus = statusFilter === 'Tất cả' || r.status === statusFilter;
      const matchRoom = roomFilter === 'Tất cả' || r.room === roomFilter;
      const matchPrice = r.price >= priceMin && r.price <= priceMax;
      return matchKeyword && matchType && matchStatus && matchRoom && matchPrice;
    });
  }, [data, keyword, typeFilter, statusFilter, roomFilter, priceMin, priceMax]);

  useEffect(() => {
    document.body.style.overflow = createOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [createOpen]);

  return (
    <section className="ticket-sales">
      <header className="ticket__header fade-in">
        <h2>Bán vé</h2>
        <p>Quản lý các suất chiếu và tiến hành bán vé.</p>
      </header>

      <div className="ticket__controls slide-up">
        <div className="left">
          <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>Thêm mới</button>
          <button className="btn" onClick={() => setFilterOpen((v) => !v)}>Bộ lọc</button>
        </div>
        <div className="right">
          <input className="search" placeholder="Tìm theo tên phim..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>

      {filterOpen && (
        <div className="filterbar pop-in">
          <div className="filterbar__grid">
            <label>
              Loại phim
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option>Tất cả</option>
                <option>Hành động</option>
                <option>Tình cảm</option>
                <option>Khoa học viễn tưởng</option>
              </select>
            </label>

            <label>
              Trạng thái
              <div className="segmented">
                {['Tất cả','Đang bán','Hết chỗ'].map((s) => (
                  <button key={s} type="button" className={`segmented__item ${statusFilter === s ? 'is-active' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>
                ))}
              </div>
            </label>

            <label>
              Phòng chiếu
              <select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
                {roomOptions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>

            <label>
              Khoảng giá (₫)
              <div className="range">
                <div className="range__track">
                  <div className="range__fill" style={{
                    left: `${((Math.min(priceMin, priceMax) - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100}%`,
                    width: `${((Math.abs(priceMax - priceMin)) / (priceBounds.max - priceBounds.min)) * 100}%`
                  }} />
                </div>
                <input type="range" min={priceBounds.min} max={priceBounds.max} value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} />
                <input type="range" min={priceBounds.min} max={priceBounds.max} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} />
              </div>
              <div className="range__inputs">
                <input type="number" value={priceMin} min={priceBounds.min} max={priceMax} onChange={(e) => setPriceMin(Number(e.target.value))} />
                <span>—</span>
                <input type="number" value={priceMax} min={priceMin} max={priceBounds.max} onChange={(e) => setPriceMax(Number(e.target.value))} />
              </div>
            </label>
          </div>

          <div className="filterbar__active">
            {typeFilter !== 'Tất cả' && (
              <button className="chip" onClick={() => setTypeFilter('Tất cả')}>Loại: {typeFilter} <span className="chip__x">×</span></button>
            )}
            {statusFilter !== 'Tất cả' && (
              <button className="chip" onClick={() => setStatusFilter('Tất cả')}>Trạng thái: {statusFilter} <span className="chip__x">×</span></button>
            )}
            {roomFilter !== 'Tất cả' && (
              <button className="chip" onClick={() => setRoomFilter('Tất cả')}>Phòng: {roomFilter} <span className="chip__x">×</span></button>
            )}
            {(priceMin !== priceBounds.min || priceMax !== priceBounds.max) && (
              <button className="chip" onClick={() => { setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); }}>
                Giá: {priceMin.toLocaleString('vi-VN')} - {priceMax.toLocaleString('vi-VN')} <span className="chip__x">×</span>
              </button>
            )}

            <div className="filterbar__spacer" />
            <div className="filterbar__summary">{rows.length} kết quả</div>
            <button className="btn" onClick={() => { setTypeFilter('Tất cả'); setStatusFilter('Tất cả'); setRoomFilter('Tất cả'); setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); setKeyword(''); }}>Xóa tất cả</button>
          </div>
        </div>
      )}

      <div className="card glass fade-in">
        <div className="table__wrap">
          <table className="table table--tickets">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên phim</th>
                <th>Loại phim</th>
                <th>Thời gian chiếu</th>
                <th>Phòng chiếu</th>
                <th>Số lượng vé</th>
                <th>Giá vé</th>
                <th>Đã bán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="row-animate">
                  <td>{i + 1}</td>
                  <td className="text-left"><strong>{r.name}</strong></td>
                  <td>{r.type}</td>
                  <td>{r.time}</td>
                  <td>{r.room}</td>
                  <td>{r.quantity}</td>
                  <td>{r.price.toLocaleString('vi-VN')}₫</td>
                  <td>{r.sold}</td>
                  <td>
                    <span className={`badge ${r.status === 'Hết chỗ' ? 'badge--danger' : 'badge--success'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: '#6d738f' }}>Không tìm thấy suất chiếu phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <div className="modal fade-in" role="dialog" aria-modal="true">
          <div className="modal__backdrop" onClick={() => setCreateOpen(false)} />
          <div className="modal__dialog pop-in">
            <header className="modal__header">
              <h3>Thêm mới vé bán</h3>
              <button className="icon" onClick={() => setCreateOpen(false)} aria-label="Đóng">×</button>
            </header>
            <div className="modal__body">
              <CreateShowtimeForm onClose={() => setCreateOpen(false)} onCreate={(item) => setData((prev) => [item, ...prev])} />
            </div>
            <footer className="modal__footer">
              <button className="btn" onClick={() => setCreateOpen(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={() => document.getElementById('create-showtime-submit')?.click()}>Thêm mới</button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}

function CreateShowtimeForm({ onClose, onCreate }) {
  const [movieId, setMovieId] = useState(MOVIES[0].id);
  const [type, setType] = useState(MOVIES[0].type);
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('R1');
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(90000);
  const [selected, setSelected] = useState(new Set());

  const occupied = useMemo(() => new Set(['B4', 'B5', 'C7', 'D3', 'E10', 'F6']), []);
  const movie = MOVIES.find((m) => m.id === movieId);

  const toggleSeat = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else {
        if (next.size >= Number(quantity)) return next;
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    setSelected((prev) => new Set([...prev].slice(0, Number(quantity))));
  }, [quantity]);

  const handleSave = () => {
    const name = movie?.name || 'Phim mới';
    const item = {
      id: Date.now(),
      name,
      type,
      time: new Date(time).toLocaleString('vi-VN'),
      room,
      quantity: Number(quantity),
      price: Number(price),
      sold: selected.size,
      status: selected.size >= quantity ? 'Hết chỗ' : 'Đang bán',
    };
    onCreate && onCreate(item);
    onClose && onClose();
  };

  return (
    <div className="create-form">
      <div className="form-grid">
        <label>
          Tên phim
          <select value={movieId} onChange={(e) => { const mv = MOVIES.find((m) => m.id === e.target.value); setMovieId(e.target.value); if (mv) setType(mv.type); }}>
            {MOVIES.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
          </select>
        </label>
        <label>
          Loại phim
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Hành động</option>
            <option>Tình cảm</option>
            <option>Khoa học viễn tưởng</option>
          </select>
        </label>
        <label>
          Thời gian chiếu
          <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <label>
          Phòng chiếu
          <input placeholder="R1, R2, IMAX..." value={room} onChange={(e) => setRoom(e.target.value)} />
        </label>
        <label>
          Số lượng vé
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label>
          Giá vé (₫)
          <input type="number" min="10000" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 10, color: '#6d738f' }}>Chọn ghế</div>
        <SeatPicker rows={8} cols={12} aisleAfter={6} occupied={occupied} selected={selected} onToggle={toggleSeat} />
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', color: '#6d738f' }}>
          <span>Đã chọn: {selected.size} ghế</span>
          <span>Tối đa: {quantity} vé</span>
        </div>
      </div>

      <button id="create-showtime-submit" type="button" style={{ display: 'none' }} onClick={handleSave}>submit</button>
    </div>
  );
}
