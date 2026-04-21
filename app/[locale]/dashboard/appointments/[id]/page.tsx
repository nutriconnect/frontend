'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAppointment } from '@/lib/appointment-notes';
import { useAuth } from '@/lib/auth';
import { AppointmentNotesSection } from '@/components/appointments/AppointmentNotesSection';
import { AppointmentPhotosSection } from '@/components/appointments/AppointmentPhotosSection';
import type { Appointment } from '@/lib/types';

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAppointment(appointmentId);
      setAppointment(data);
    } catch (err) {
      console.error('Failed to load appointment:', err);
      setError('Failed to load appointment details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { background: 'rgba(90,138,64,0.1)', color: 'var(--nc-sage)', border: '1px solid rgba(90,138,64,0.2)' };
      case 'completed':
        return { background: 'rgba(26,51,41,0.08)', color: 'var(--nc-forest)', border: '1px solid rgba(26,51,41,0.15)' };
      case 'cancelled':
        return { background: 'rgba(196,98,45,0.08)', color: 'var(--nc-terra)', border: '1px solid rgba(196,98,45,0.15)' };
      case 'no_show':
        return { background: 'rgba(139,115,85,0.1)', color: 'var(--nc-stone)', border: '1px solid rgba(139,115,85,0.2)' };
      default:
        return { background: 'rgba(139,115,85,0.1)', color: 'var(--nc-stone)', border: '1px solid rgba(139,115,85,0.2)' };
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  if (isLoading) {
    return (
      <div className="dash-content" style={{ padding: 40, color: 'var(--nc-stone)', fontWeight: 300 }}>
        Cargando…
      </div>
    );
  }

  if (error || !appointment || !user) {
    return (
      <div className="dash-content" style={{ padding: 40 }}>
        <div className="dash-section">
          <div className="dash-section-head">
            <div className="dash-section-title">Error</div>
            <div className="dash-section-sub">{error || 'Cita no encontrada'}</div>
          </div>
          <div className="dash-section-body">
            <button
              className="dash-btn-save"
              onClick={() => router.push('/dashboard/appointments')}
            >
              Volver a citas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startDateTime = formatDateTime(appointment.start_time);
  const isNutritionist = user.role === 'nutritionist';
  const photos = appointment.photos || [];
  const statusStyle = getStatusStyle(appointment.status);

  return (
    <>
      <div className="dash-topbar">
        <button
          onClick={() => router.push('/dashboard/appointments')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--nc-stone)',
            cursor: 'pointer',
            fontSize: 20,
            marginRight: 12,
            padding: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div className="dash-topbar-title">{appointment.appointment_type.name}</div>
          <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--nc-stone)', marginTop: 2 }}>
            Detalles de la cita
          </div>
        </div>
        <span
          style={{
            ...statusStyle,
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {appointment.status.replace('_', ' ')}
        </span>
      </div>

      <div className="dash-content">
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: 20 }}>
          <div className="dash-section">
            <div className="dash-section-head">
              <div className="dash-section-title">📅 Fecha y hora</div>
            </div>
            <div className="dash-section-body">
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--nc-ink)', marginBottom: 8 }}>
                {startDateTime.date}
              </p>
              <p style={{ fontSize: 13, color: 'var(--nc-stone)', marginBottom: 4 }}>
                🕐 {startDateTime.time}
              </p>
              <p style={{ fontSize: 13, color: 'var(--nc-stone)' }}>
                Duración: {appointment.appointment_type.duration_minutes} minutos
              </p>
            </div>
          </div>

          <div className="dash-section">
            <div className="dash-section-head">
              <div className="dash-section-title">👥 Participantes</div>
            </div>
            <div className="dash-section-body">
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--nc-ink)' }}>
                  {appointment.nutritionist_name}
                </p>
                <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--nc-stone)' }}>
                  Nutricionista
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--nc-ink)' }}>
                  {appointment.client_name}
                </p>
                <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--nc-stone)' }}>
                  Cliente
                </p>
              </div>
            </div>
          </div>
        </div>

        {appointment.appointment_type.description && (
          <div className="dash-section">
            <div className="dash-section-head">
              <div className="dash-section-title">Sobre esta cita</div>
            </div>
            <div className="dash-section-body">
              <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--nc-ink)', lineHeight: 1.7 }}>
                {appointment.appointment_type.description}
              </p>
              {appointment.appointment_type.video_link && (
                <a
                  href={appointment.appointment_type.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 16,
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #4a7c59 0%, #5a9268 100%)',
                    color: 'white',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  📹 Unirse a videollamada
                </a>
              )}
            </div>
          </div>
        )}

        {isNutritionist && (
          <div className="dash-section">
            <div className="dash-section-head">
              <div className="dash-section-title">Notas de sesión</div>
              <div className="dash-section-sub">Documenta esta cita para referencia y comunicación con el cliente</div>
            </div>
            <div className="dash-section-body">
              <AppointmentNotesSection
                appointmentId={appointmentId}
                initialSharedSummary={appointment.shared_summary}
                initialClinicalNotes={appointment.clinical_notes}
                initialInternalReminders={appointment.internal_reminders}
                onUpdate={loadAppointment}
              />
            </div>
          </div>
        )}

        {!isNutritionist && appointment.shared_summary && (
          <div className="dash-section">
            <div className="dash-section-head">
              <div className="dash-section-title">Resumen de sesión</div>
            </div>
            <div className="dash-section-body">
              <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--nc-ink)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {appointment.shared_summary}
              </p>
            </div>
          </div>
        )}

        <div className="dash-section">
          <div className="dash-section-head">
            <div className="dash-section-title">Fotos de progreso</div>
            <div className="dash-section-sub">Seguimiento visual del progreso a lo largo del tiempo</div>
          </div>
          <div className="dash-section-body">
            <AppointmentPhotosSection
              appointmentId={appointmentId}
              photos={photos}
              currentUserRole={user.role}
              currentUserId={user.id}
              onUpdate={loadAppointment}
            />
          </div>
        </div>

        {appointment.notes && (
          <div className="dash-section">
            <div className="dash-section-head">
              <div className="dash-section-title">Notas antiguas</div>
            </div>
            <div className="dash-section-body">
              <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--nc-stone)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {appointment.notes}
              </p>
            </div>
          </div>
        )}

        {appointment.cancellation_reason && (
          <div className="dash-section" style={{ border: '1px solid var(--nc-terra)' }}>
            <div className="dash-section-head" style={{ background: 'rgba(196,98,45,0.05)' }}>
              <div className="dash-section-title" style={{ color: 'var(--nc-terra)' }}>
                Detalles de cancelación
              </div>
            </div>
            <div className="dash-section-body">
              <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--nc-ink)', lineHeight: 1.7 }}>
                {appointment.cancellation_reason}
              </p>
              {appointment.cancelled_at && (
                <p style={{ fontSize: 12, color: 'var(--nc-stone)', marginTop: 8 }}>
                  Cancelado el {new Date(appointment.cancelled_at).toLocaleString('es-ES')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
