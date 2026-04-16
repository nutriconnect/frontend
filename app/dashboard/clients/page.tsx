// frontend/app/dashboard/clients/page.tsx
'use client';

import { useState } from 'react';
import QuickStatsPanel from '@/components/QuickStatsPanel';
import SearchFilterBar from '@/components/SearchFilterBar';
import ClientCard from '@/components/ClientCard';
import { useQuickStats, useEnhancedClients } from '@/lib/enhanced-clients';

export default function MyClientsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const { stats, isLoading: statsLoading } = useQuickStats();
  const { clients, isLoading: clientsLoading, error } = useEnhancedClients({
    search,
    status,
    sort,
  });

  const hasFilters = search !== '' || status !== '';

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Mis clientes</div>
      </div>
      <div className="dash-content">
        <QuickStatsPanel stats={stats} isLoading={statsLoading} />

        <SearchFilterBar
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortChange={setSort}
          initialSearch={search}
          initialStatus={status}
          initialSort={sort}
        />

        {clientsLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>
            Cargando clientes…
          </div>
        ) : error ? (
          <div style={{
            background: 'white',
            border: '1px solid rgba(205,92,92,0.2)',
            borderRadius: 8,
            padding: 24,
            color: '#cd5c5c',
          }}>
            Error al cargar clientes. Por favor, intenta de nuevo.
          </div>
        ) : clients.length === 0 ? (
          <div style={{
            background: 'white',
            border: '1px solid rgba(139,115,85,0.12)',
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            color: 'var(--nc-stone)',
            fontWeight: 300,
          }}>
            {hasFilters ? (
              <>
                <div style={{ marginBottom: 12 }}>
                  No se encontraron clientes con los filtros aplicados.
                </div>
                <button
                  onClick={() => {
                    setSearch('');
                    setStatus('');
                    setSort('newest');
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--nc-terra)',
                    background: 'rgba(196,98,45,0.08)',
                    border: '1px solid rgba(196,98,45,0.2)',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  Limpiar filtros
                </button>
              </>
            ) : (
              'No tienes clientes aún. Comparte tu perfil público para empezar.'
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {clients.map((client) => (
              <ClientCard key={client.relationship_id} client={client} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
