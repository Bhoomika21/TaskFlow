import React from 'react';

const filters = [
  { key: 'all',       label: '◉ All Tasks' },
  { key: 'pending',   label: '◌ Pending'   },
  { key: 'completed', label: '✓ Completed' },
];

const FilterBar = ({ active, onChange }) => (
  <div className="filter-bar">
    {filters.map(({ key, label }) => (
      <button
        key={key}
        className={`filter-btn ${active === key ? `active-${key}` : ''}`}
        onClick={() => onChange(key)}
      >
        {label}
      </button>
    ))}
  </div>
);

export default FilterBar;
