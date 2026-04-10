'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [city, setCity] = useState(searchParams.get('city') ?? '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') ?? '');
  const [language, setLanguage] = useState(searchParams.get('language') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '');

  const hasFilters = q || city || specialty || language || sort || minPrice || maxPrice;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (city) params.set('city', city);
    if (specialty) params.set('specialty', specialty);
    if (language) params.set('language', language);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    params.set('page', '1'); // reset to first page on new search
    router.push(`/nutritionists?${params.toString()}`);
  }

  function handleClear() {
    setQ('');
    setCity('');
    setSpecialty('');
    setLanguage('');
    setSort('');
    setMinPrice('');
    setMaxPrice('');
    router.push('/nutritionists');
  }

  return (
    <form className="nc-filters" onSubmit={handleSubmit}>
      <input
        className="nc-filter-input wide"
        type="text"
        placeholder="Search by name or keyword…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        className="nc-filter-input medium"
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        className="nc-filter-input medium"
        type="text"
        placeholder="Specialty"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      />
      <input
        className="nc-filter-input medium"
        type="text"
        placeholder="Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
      <select
        className="nc-filter-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="">Newest</option>
        <option value="price_asc">Price: low → high</option>
        <option value="price_desc">Price: high → low</option>
      </select>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          className="nc-filter-input short"
          type="number"
          placeholder="Min €"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: 80 }}
        />
        <span style={{ color: 'var(--nc-stone)', fontSize: 13 }}>–</span>
        <input
          className="nc-filter-input short"
          type="number"
          placeholder="Max €"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: 80 }}
        />
      </div>
      <button type="submit" className="nc-filter-btn">Search</button>
      {hasFilters && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--nc-stone)',
            fontSize: 13,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '0 4px',
          }}
        >
          Clear filters
        </button>
      )}
    </form>
  );
}
