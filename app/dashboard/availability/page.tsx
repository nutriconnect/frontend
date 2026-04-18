'use client';
// frontend/app/dashboard/availability/page.tsx

import { AvailabilityEditor } from '@/components/calendar/AvailabilityEditor';

export default function AvailabilityPage() {
  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Gestionar Disponibilidad</div>
      </div>

      <div className="dash-content">
        <div className="dash-section">
          <div className="dash-section-head">
            <div className="dash-section-title">Gestionar Disponibilidad</div>
            <div className="dash-section-sub">Define cuándo estás disponible para citas. Los clientes solo podrán reservar en estos horarios.</div>
          </div>
          <div className="dash-section-body">
            <AvailabilityEditor />
          </div>
        </div>
      </div>
    </>
  );
}
