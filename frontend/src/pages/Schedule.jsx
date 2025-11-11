import React, { useState, useMemo, useEffect } from 'react';
import './Schedule.css';

const MOVIES_SAMPLE = [
  { id: 1, name: 'The Midnight Voyage', type: 'Hành động' },
  { id: 2, name: 'Autumn Whisper', type: 'Tình cảm' },
  { id: 3, name: 'Neon City', type: 'Khoa học viễn tưởng' },
];

export default function Schedule() {
  const [shows, setShows] = useState([
    { id: 1, name: 'The Midnight Voyage', type: 'Hành động', time: '2025-10-31T20:15', room: 'R1', quantity: 120, price: 90000 },
    { id: 2, name: 'Autumn Whisper', type: 'Tình cảm', time: '2025-10-31T18:00', room: 'R2', quantity: 90, price: 75000 },
    { id: 3, name: 'Neon City', type: 'Khoa học viễn tưởng', time: '2025-10-31T22:00', room: 'IMAX', quantity: 150, price: 120000 },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [roomFilter, setRoomFilter] = useState('Tất cả');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);

  const filteredShows = useMemo(() => {
    return shows.filter((s) => {
      const matchKeyword = s.name.toLowerCase().includes(keyword.toLowerCase());
      const matchType = typeFilter === 'Tất cả' || s.type === typeFilter;
      const matchRoom = roomFilter === 'Tất cả' || s.room === roomFilter;
      const matchPrice = s.price >= priceMin && s.price <= priceMax;
      return matchKeyword && matchType && matchRoom && matchPrice;
    });
  }, [shows, keyword, typeFilter, roomFilter, priceMin, priceMax]);

  const priceBounds = useMemo(() => {
    const prices = shows.map(s => s.price);
    return { min: Math.min(...prices, 0), max: Math.max(...prices, 200000) };
  }, [shows]);

  useEffect(() => {
    document.body.style.overflow = createOpen || editOpen ? 'hidden' : '';
  }, [createOpen, editOpen]);

  const handleCreate = (item) => setShows(prev => [item, ...prev]);
  const handleEdit = (item) => setShows(prev => prev.map(s => s.id === item.id ? item : s));
  const handleDelete = (id) => setShows(prev => prev.filter(s => s.id !== id));

  return (
    <section className="schedule-page">
      <header>
        <h2>Lịch chiếu</h2>
        <p>Quản lý các suất chiếu phim.</p>
      </header>

      <div className="schedule-controls">
        <div className="left">
          <button className="btn-add" onClick={() => setCreateOpen(true)}>Thêm mới</button>
          <button className="btn-filter" onClick={() => setFilterOpen(v => !v)}>Bộ lọc</button>
        </div>
        <div className="right">
          <input className="search" placeholder="Tìm theo tên phim..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
      </div>

      {filterOpen && (
        <div className="filter-bar">
          <label>
            Loại phim:
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option>Tất cả</option>
              <option>Hành động</option>
              <option>Tình cảm</option>
              <option>Khoa học viễn tưởng</option>
            </select>
          </label>
          <label>
            Phòng chiếu:
            <select value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
              <option>Tất cả</option>
              <option>R1</option>
              <option>R2</option>
              <option>IMAX</option>
            </select>
          </label>
          <label>
            Giá vé:
            <input type="number" value={priceMin} min={priceBounds.min} max={priceMax} onChange={e => setPriceMin(Number(e.target.value))} />
            —
            <input type="number" value={priceMax} min={priceMin} max={priceBounds.max} onChange={e => setPriceMax(Number(e.target.value))} />
          </label>
          <button className="btn-clear" onClick={() => { setKeyword(''); setTypeFilter('Tất cả'); setRoomFilter('Tất cả'); setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); }}>Xóa tất cả</button>
        </div>
      )}

      <table className="schedule-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên phim</th>
            <th>Loại phim</th>
            <th>Thời gian chiếu</th>
            <th>Phòng chiếu</th>
            <th>Số lượng vé</th>
            <th>Giá vé</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredShows.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td className="text-left">{s.name}</td>
              <td>{s.type}</td>
              <td>{new Date(s.time).toLocaleString('vi-VN')}</td>
              <td>{s.room}</td>
              <td>{s.quantity}</td>
              <td>{s.price.toLocaleString('vi-VN')}₫</td>
              <td className="action-buttons">
                <div className="action-wrapper">
                  <button className="btn-edit" onClick={() => { setEditItem(s); setEditOpen(true); }}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(s.id)}>Xoá</button>
                </div>
              </td>
            </tr>
          ))}
          {filteredShows.length === 0 && (
            <tr>
              <td colSpan={8} className="no-data">Không tìm thấy phim phù hợp</td>
            </tr>
          )}
        </tbody>
      </table>

      {createOpen && <ModalForm title="Thêm mới phim" onClose={() => setCreateOpen(false)} onSave={handleCreate} />}
      {editOpen && editItem && <ModalForm title="Sửa phim" item={editItem} onClose={() => setEditOpen(false)} onSave={handleEdit} />}
    </section>
  );
}

function ModalForm({ title, onClose, onSave, item }) {
  const [name, setName] = useState(item?.name || '');
  const [type, setType] = useState(item?.type || 'Hành động');
  const [time, setTime] = useState(item?.time || '');
  const [room, setRoom] = useState(item?.room || 'R1');
  const [quantity, setQuantity] = useState(item?.quantity || 100);
  const [price, setPrice] = useState(item?.price || 90000);

  const handleSave = () => {
    const newItem = { id: item?.id || Date.now(), name, type, time, room, quantity: Number(quantity), price: Number(price) };
    onSave && onSave(newItem);
    onClose && onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>
        <div className="modal-body">
          <label>Tên phim<input value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Loại phim
            <select value={type} onChange={e => setType(e.target.value)}>
              <option>Hành động</option>
              <option>Tình cảm</option>
              <option>Khoa học viễn tưởng</option>
            </select>
          </label>
          <label>Thời gian chiếu<input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} /></label>
          <label>Phòng chiếu<input value={room} onChange={e => setRoom(e.target.value)} /></label>
          <label>Số lượng vé<input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
          <label>Giá vé (₫)<input type="number" min="10000" step="1000" value={price} onChange={e => setPrice(e.target.value)} /></label>
        </div>
        <footer className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="btn-save" onClick={handleSave}>{item ? 'Sửa' : 'Thêm mới'}</button>
        </footer>
      </div>
    </div>
  );
}
