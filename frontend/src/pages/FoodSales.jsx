import React, { useMemo, useState } from 'react';
import '../style/food.css';
import '../style/filter.css';

const FOOD_SAMPLE = [
  { id: 1, name: 'Bắp rang bơ', category: 'Đồ ăn', qty: 50, price: 35000 },
  { id: 2, name: 'Coca-Cola', category: 'Đồ uống', qty: 120, price: 25000 },
  { id: 3, name: 'Combo lớn', category: 'Combo', qty: 30, price: 85000 },
];

const CATEGORIES = ['Đồ ăn', 'Đồ uống', 'Combo'];

export default function FoodSales() {
  const [data, setData] = useState(FOOD_SAMPLE);
  const [keyword, setKeyword] = useState('');
  const [filterOpen, setFilterOpen] = useState(true);
  const [category, setCategory] = useState('Tất cả');
  const [status, setStatus] = useState('Tất cả');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100000);

  const [openCreate, setOpenCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [purchaseItem, setPurchaseItem] = useState(null);

  const priceBounds = useMemo(() => {
    const prices = data.map(d => d.price);
    return { min: Math.min(...prices, 0), max: Math.max(...prices, 100000) };
  }, [data]);

  const rows = useMemo(() => {
    return data.filter((r) => {
      const k = r.name.toLowerCase().includes(keyword.toLowerCase().trim());
      const c = category === 'Tất cả' || r.category === category;
      const st = status === 'Tất cả' || (status === 'Còn hàng' ? r.qty > 0 : r.qty === 0);
      const p = r.price >= priceMin && r.price <= priceMax;
      return k && c && st && p;
    });
  }, [data, keyword, category, status, priceMin, priceMax]);

  const openEdit = (item) => { setEditItem(item); setOpenCreate(true); };
  const openNew = () => { setEditItem(null); setOpenCreate(true); };

  const upsertItem = (item) => {
    setData((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item; return next;
      }
      return [{ ...item, id: Date.now() }, ...prev];
    });
    setOpenCreate(false);
  };

  const removeItem = (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    setData((prev) => prev.filter((x) => x.id !== id));
  };

  const purchase = (id, quantity) => {
    setData((prev) => prev.map((x) => x.id === id ? { ...x, qty: Math.max(0, x.qty - quantity) } : x));
    setPurchaseItem(null);
  };

  return (
    <section className="food-sales">
      <header className="ticket__header fade-in">
        <h2>Bán đồ ăn</h2>
        <p>Quản lý sản phẩm bắp nước và combo tại quầy.</p>
      </header>

      <div className="ticket__controls slide-up">
        <div className="left">
          <button className="btn btn-primary" onClick={openNew}>Thêm mới</button>
          <button className="btn" onClick={() => setFilterOpen(v => !v)}>Bộ lọc</button>
        </div>
        <div className="right">
          <input className="search" placeholder="Tìm theo tên đồ ăn..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>

      {filterOpen && (
        <div className="filterbar pop-in">
          <div className="filterbar__grid">
            <label>
              Loại
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Tất cả</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              Trạng thái
              <div className="segmented">
                {['Tất cả','Còn hàng','Hết hàng'].map(s => (
                  <button key={s} type="button" className={`segmented__item ${status === s ? 'is-active' : ''}`} onClick={() => setStatus(s)}>{s}</button>
                ))}
              </div>
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
            {category !== 'Tất cả' && <button className="chip" onClick={() => setCategory('Tất cả')}>Loại: {category} <span className="chip__x">×</span></button>}
            {status !== 'Tất cả' && <button className="chip" onClick={() => setStatus('Tất cả')}>Trạng thái: {status} <span className="chip__x">×</span></button>}
            {(priceMin !== priceBounds.min || priceMax !== priceBounds.max) && (
              <button className="chip" onClick={() => { setPriceMin(priceBounds.min); setPriceMax(priceBounds.max); }}>
                Giá: {priceMin.toLocaleString('vi-VN')} - {priceMax.toLocaleString('vi-VN')} <span className="chip__x">×</span>
              </button>
            )}
            <div className="filterbar__spacer" />
            <div className="filterbar__summary">{rows.length} sản phẩm</div>
          </div>
        </div>
      )}

      <div className="card glass fade-in">
        <div className="table__wrap">
          <table className="table table--foods">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên đồ ăn</th>
                <th>Loại</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="row-animate">
                  <td>{i + 1}</td>
                  <td className="text-left">{r.name}</td>
                  <td>{r.category}</td>
                  <td>{r.qty}</td>
                  <td>{r.price.toLocaleString('vi-VN')}₫</td>
                  <td>
                    <div className="actions">
                      <button className="icon-btn icon-btn--purchase" title="Bán" onClick={() => setPurchaseItem(r)}>
                        <span>🛍️</span>
                      </button>
                      <button className="icon-btn" title="Sửa" onClick={() => openEdit(r)}>
                        <span>✏️</span>
                      </button>
                      <button className="icon-btn icon-btn--danger" title="Xóa" onClick={() => removeItem(r.id)}>
                        <span>🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#6d738f' }}>Không có sản phẩm phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openCreate && (
        <FoodModal
          initial={editItem}
          onClose={() => setOpenCreate(false)}
          onSave={(item) => upsertItem(item)}
        />
      )}

      {purchaseItem && (
        <PurchaseModal
          item={purchaseItem}
          onClose={() => setPurchaseItem(null)}
          onConfirm={(qty) => purchase(purchaseItem.id, qty)}
        />
      )}
    </section>
  );
}

function FoodModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name || '');
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [qty, setQty] = useState(initial?.qty ?? 50);
  const [price, setPrice] = useState(initial?.price ?? 30000);

  const handleSave = () => {
    const item = { id: initial?.id ?? Date.now(), name, category, qty: Number(qty), price: Number(price) };
    onSave && onSave(item);
  };

  return (
    <div className="modal fade-in" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog pop-in">
        <header className="modal__header">
          <h3>{isEdit ? 'Chỉnh sửa thông tin' : 'Thêm mới đồ ăn'}</h3>
          <button className="icon" onClick={onClose} aria-label="Đóng">×</button>
        </header>
        <div className="modal__body">
          <div className="form-grid">
            <label>
              Tên đồ ăn
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Bắp rang bơ" />
            </label>
            <label>
              Loại đồ ăn
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              Số lượng
              <input type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} />
            </label>
            <label>
              Giá (₫)
              <input type="number" min="0" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
          </div>
        </div>
        <footer className="modal__footer">
          <button className="btn" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={handleSave}>{isEdit ? 'Lưu lại' : 'Thêm mới'}</button>
        </footer>
      </div>
    </div>
  );
}

function PurchaseModal({ item, onClose, onConfirm }) {
  const [qty, setQty] = useState(1);
  const total = Math.max(0, Math.min(qty, item.qty)) * item.price;
  const valid = qty > 0 && qty <= item.qty;
  const submit = () => {
    if (!valid) return;
    onConfirm(Math.min(qty, item.qty));
    alert('Xuất phiếu thành công');
  };
  return (
    <div className="modal fade-in" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog pop-in">
        <header className="modal__header">
          <h3>Bán đồ ăn</h3>
          <button className="icon" onClick={onClose} aria-label="Đóng">×</button>
        </header>
        <div className="modal__body">
          <div className="form-grid">
            <label>
              Tên (chọn từ danh sách)
              <input value={item.name} readOnly />
            </label>
            <label>
              Giá
              <input value={`${item.price.toLocaleString('vi-VN')}₫`} readOnly />
            </label>
            <label>
              Số lượng
              <input type="number" min="1" max={item.qty} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            </label>
            <label>
              Tổng số tiền
              <input value={`${total.toLocaleString('vi-VN')}₫`} readOnly />
            </label>
          </div>
        </div>
        <footer className="modal__footer">
          <button className="btn" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" disabled={!valid} onClick={submit}>Xuất phiếu</button>
        </footer>
      </div>
    </div>
  );
}
