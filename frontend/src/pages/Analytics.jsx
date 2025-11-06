import React, { useMemo } from 'react';
import './analytics.css';

function formatNumber(value) {
  return value.toLocaleString('vi-VN');
}

export default function Analytics() {
  const { metrics, warehouseChart, revenueChart } = useMemo(() => ({
    metrics: [{
      id: 'films',
      label: 'Số lượng phim',
      value: formatNumber(58),
      hint: 'Đang phát hành'
    }, {
      id: 'tickets',
      label: 'Số lượng vé đã bán',
      value: formatNumber(5_480),
      hint: 'Trong 30 ngày gần nhất'
    }, {
      id: 'fnb',
      label: 'Số lượng đồ ăn & nước đã bán',
      value: formatNumber(2_341),
      hint: 'Tại quầy concession'
    }],
    warehouseChart: {
      title: 'Biểu đồ cột thể hiện số lượng phim trong kho',
      caption: 'Thống kê theo thể loại trong hệ thống rạp',
      bars: [
        { id: 'action', label: 'Hành động', value: 18 },
        { id: 'romance', label: 'Tình cảm', value: 9 },
        { id: 'horror', label: 'Kinh dị', value: 7 },
        { id: 'comedy', label: 'Hài hước', value: 11 },
        { id: 'scifi', label: 'Khoa học VT', value: 13 }
      ]
    },
    revenueChart: {
      title: 'Biểu đồ cột thể hiện tổng doanh thu bán đồ ăn và bán vé',
      caption: 'Đơn vị: triệu đồng, theo từng tuần trong tháng',
      bars: [
        { id: 'week1', label: 'Tuần 1', value: 96 },
        { id: 'week2', label: 'Tuần 2', value: 112 },
        { id: 'week3', label: 'Tuần 3', value: 134 },
        { id: 'week4', label: 'Tuần 4', value: 121 }
      ]
    }
  }), []);

  const renderBarChart = (dataset) => {
    const maxValue = Math.max(...dataset.bars.map((bar) => bar.value));
    return (
      <div className="analytics__chart">
        {dataset.bars.map((bar) => (
          <div key={bar.id} className="analytics__chart-bar">
            <div
              className="analytics__chart-barFill"
              style={{ height: `${(bar.value / maxValue) * 100}%` }}
            >
              <span className="analytics__chart-barGlow" />
            </div>
            <span className="analytics__chart-value">{bar.value}</span>
            <span className="analytics__chart-label">{bar.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="analytics analytics--light">
      <header className="analytics__titlebar">
        <div className="analytics__titlebar-text">
          <span className="analytics__eyebrow">Bảng điều khiển</span>
          <h1>Thống kê</h1>
          <p>Theo dõi hiệu suất bán vé, doanh thu và tồn kho một cách trực quan.</p>
        </div>
        <div className="analytics__titlebar-controls">
          <select className="analytics__select" aria-label="Chọn khoảng thời gian">
            <option>Tháng này</option>
            <option>Quý này</option>
            <option>Năm nay</option>
          </select>
          <button type="button" className="analytics__primaryBtn">Xuất báo cáo</button>
        </div>
      </header>

      <section className="analytics__section analytics__section--outlined">
        <div className="analytics__sectionHeader">
          <h2>Tổng quan</h2>
          <div className="analytics__toolbar">
            <button type="button" className="analytics__chip analytics__chip--active">Toàn hệ thống</button>
            <button type="button" className="analytics__chip">Chi nhánh 1</button>
            <button type="button" className="analytics__chip">Chi nhánh 2</button>
            <button type="button" className="analytics__ghostBtn">Bộ lọc nâng cao</button>
          </div>
        </div>
        <div className="analytics__metricsRow">
          {metrics.map((metric) => (
            <article key={metric.id} className="analytics__metricCard">
              <div className="analytics__metricInner">
                <h3>{metric.label}</h3>
                <p className="analytics__metricValue">{metric.value}</p>
                <span className="analytics__metricHint">{metric.hint}</span>
              </div>
              <span className="analytics__metricAccent" />
            </article>
          ))}
        </div>
      </section>

      <section className="analytics__section analytics__section--outlined">
        <div className="analytics__sectionHeader">
          <h2>Biểu đồ</h2>
          <div className="analytics__toolbar">
            <button type="button" className="analytics__ghostBtn">Bộ lọc</button>
          </div>
        </div>
        <div className="analytics__chartsRow">
          <article className="analytics__chartCard">
            <header className="analytics__chartHeader">
              <h3>{warehouseChart.title}</h3>
              <p>{warehouseChart.caption}</p>
            </header>
            {renderBarChart(warehouseChart)}
            <footer className="analytics__chartFooter">Cập nhật 5 phút trước</footer>
          </article>

          <article className="analytics__chartCard">
            <header className="analytics__chartHeader">
              <h3>{revenueChart.title}</h3>
              <p>{revenueChart.caption}</p>
            </header>
            {renderBarChart(revenueChart)}
            <footer className="analytics__chartFooter">Đang so sánh với kỳ trước</footer>
          </article>
        </div>
      </section>
    </section>
  );
}
