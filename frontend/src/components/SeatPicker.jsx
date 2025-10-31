import React, { useMemo } from 'react';

// SeatPicker renders an interactive seat map
// Props:
// - rows: number
// - cols: number
// - aisleAfter: number | null  -> add gap after given column index (1-based)
// - occupied: Set<string>      -> ids like 'A1'
// - selected: Set<string>
// - onToggle: (id: string) => void
export default function SeatPicker({ rows = 8, cols = 12, aisleAfter = 6, occupied = new Set(), selected = new Set(), onToggle }) {
  const map = useMemo(() => {
    return Array.from({ length: rows }).map((_, r) => {
      const rowLabel = String.fromCharCode(65 + r);
      return Array.from({ length: cols }).map((__, c) => {
        const id = `${rowLabel}${c + 1}`;
        return { id, rowLabel, col: c + 1 };
      });
    });
  }, [rows, cols]);

  return (
    <div className="seat">
      <div className="seat__legend">
        <span className="legend legend--available">Trống</span>
        <span className="legend legend--selected">Đang chọn</span>
        <span className="legend legend--occupied">Đã bán</span>
      </div>
      <div className="seat__screen">Màn hình</div>
      <div className="seatmap" style={{ gridTemplateColumns: `repeat(${cols + (aisleAfter ? 1 : 0)}, 1fr)` }}>
        {map.flat().map(({ id, rowLabel, col }) => {
          const isOccupied = occupied.has(id);
          const isSelected = selected.has(id);
          const cls = `seat__item ${isOccupied ? 'seat__item--occupied' : ''} ${isSelected ? 'seat__item--selected' : ''}`;
          const key = id;
          const element = (
            <button
              key={key}
              type="button"
              className={cls}
              onClick={() => !isOccupied && onToggle && onToggle(id)}
              aria-pressed={isSelected}
              disabled={isOccupied}
            >
              {rowLabel}
              <small>{col}</small>
            </button>
          );

          // Insert aisle gap after specified column
          if (aisleAfter && col === aisleAfter) {
            return [
              element,
              <div key={`${key}-gap`} className="seat__gap" aria-hidden="true" />,
            ];
          }
          return element;
        })}
      </div>
    </div>
  );
}

