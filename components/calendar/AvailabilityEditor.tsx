// frontend/components/calendar/AvailabilityEditor.tsx
'use client';

import { useState } from 'react';
import { useAvailabilityRules, createAvailabilityRule, deleteAvailabilityRule } from '@/lib/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function AvailabilityEditor() {
  const { rules, isLoading, mutate } = useAvailabilityRules();
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createAvailabilityRule({ day_of_week: dayOfWeek, start_time: startTime, end_time: endTime });
      setStartTime('09:00');
      setEndTime('13:00');
      await mutate();
    } catch (err: any) {
      setError(err.message || 'Error al crear disponibilidad');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAvailabilityRule(id);
      await mutate();
    } catch (err: any) {
      console.error('Failed to delete availability rule:', err);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  // Group rules by day
  const rulesByDay = rules.reduce((acc, rule) => {
    if (!acc[rule.day_of_week]) acc[rule.day_of_week] = [];
    acc[rule.day_of_week].push(rule);
    return acc;
  }, {} as Record<number, typeof rules>);

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold">Añadir Disponibilidad</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="day">Día</Label>
            <Select value={dayOfWeek.toString()} onValueChange={(v) => setDayOfWeek(parseInt(v))}>
              <SelectTrigger id="day">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="start">Desde</Label>
            <Input
              id="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="end">Hasta</Label>
            <Input
              id="end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Añadir</Button>
      </form>

      <div className="space-y-4">
        <h3 className="font-semibold">Disponibilidad Actual</h3>
        {DAYS.map((day, i) => {
          const dayRules = rulesByDay[i] || [];
          if (dayRules.length === 0) return null;
          return (
            <div key={i} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{day}</h4>
              <div className="space-y-2">
                {dayRules.map((rule) => (
                  <div key={rule.id} className="flex justify-between items-center text-sm">
                    <span>
                      {rule.start_time.substring(0, 5)} - {rule.end_time.substring(0, 5)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {rules.length === 0 && (
          <p className="text-muted-foreground text-sm">No has configurado tu disponibilidad aún.</p>
        )}
      </div>
    </div>
  );
}
