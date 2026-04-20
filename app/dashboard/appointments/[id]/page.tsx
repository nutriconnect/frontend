'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAppointment } from '@/lib/appointment-notes';
import { useAuth } from '@/lib/auth';
import { AppointmentNotesSection } from '@/components/appointments/AppointmentNotesSection';
import { AppointmentPhotosSection } from '@/components/appointments/AppointmentPhotosSection';
import { ArrowLeft, Calendar, Clock, Video, User } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'no_show':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
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
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !appointment || !user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'Appointment not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/appointments')}>
              Back to Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startDateTime = formatDateTime(appointment.start_time);
  const isNutritionist = user.role === 'nutritionist';
  const photos = appointment.photos || [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/appointments')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{appointment.appointment_type.name}</h1>
          <p className="text-muted-foreground">Appointment Details</p>
        </div>
        <Badge className={getStatusColor(appointment.status)}>
          {appointment.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg">{startDateTime.date}</p>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {startDateTime.time}
            </p>
            <p className="text-sm text-muted-foreground">
              Duration: {appointment.appointment_type.duration_minutes} minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">{appointment.nutritionist_name}</p>
              <p className="text-sm text-muted-foreground">Nutritionist</p>
            </div>
            <div>
              <p className="font-medium">{appointment.client_name}</p>
              <p className="text-sm text-muted-foreground">Client</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {appointment.appointment_type.description && (
        <Card>
          <CardHeader>
            <CardTitle>About This Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{appointment.appointment_type.description}</p>
            {appointment.appointment_type.video_link && (
              <div className="mt-4">
                <a
                  href={appointment.appointment_type.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background hover:bg-muted text-sm font-medium transition-colors"
                >
                  <Video className="h-4 w-4" />
                  Join Video Call
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isNutritionist && (
        <Card>
          <CardHeader>
            <CardTitle>Session Notes</CardTitle>
            <CardDescription>Document this appointment for reference and client communication</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentNotesSection
              appointmentId={appointmentId}
              initialSharedSummary={appointment.shared_summary}
              initialClinicalNotes={appointment.clinical_notes}
              initialInternalReminders={appointment.internal_reminders}
              onUpdate={loadAppointment}
            />
          </CardContent>
        </Card>
      )}

      {!isNutritionist && appointment.shared_summary && (
        <Card>
          <CardHeader>
            <CardTitle>Session Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{appointment.shared_summary}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Progress Photos</CardTitle>
          <CardDescription>Track visual progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentPhotosSection
            appointmentId={appointmentId}
            photos={photos}
            currentUserRole={user.role}
            currentUserId={user.id}
            onUpdate={loadAppointment}
          />
        </CardContent>
      </Card>

      {appointment.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Legacy Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {appointment.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {appointment.cancellation_reason && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Cancellation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{appointment.cancellation_reason}</p>
            {appointment.cancelled_at && (
              <p className="text-sm text-muted-foreground mt-2">
                Cancelled on {new Date(appointment.cancelled_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
