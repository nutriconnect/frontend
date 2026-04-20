// frontend/components/BMIBadge.tsx
interface BMIBadgeProps {
  bmi: number | null;
  bmi_category: 'underweight' | 'normal' | 'overweight' | 'obese' | null;
  showLabel?: boolean;
}

export function BMIBadge({ bmi, bmi_category, showLabel = true }: BMIBadgeProps) {
  if (bmi === null || bmi_category === null) {
    return (
      <div style={{ fontSize: 12, color: 'var(--nc-stone)' }}>
        BMI: No disponible (falta peso/altura)
      </div>
    );
  }

  const colors = {
    underweight: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Bajo peso' },
    normal: { bg: 'rgba(74,124,89,0.1)', color: '#4a7c59', label: 'Normal' },
    overweight: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Sobrepeso' },
    obese: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: 'Obesidad' },
  };

  const style = colors[bmi_category];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {showLabel && <span style={{ fontSize: 12, color: 'var(--nc-stone)' }}>BMI:</span>}
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)' }}>
        {bmi.toFixed(1)}
      </span>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 12,
        background: style.bg,
        color: style.color,
      }}>
        {style.label}
      </span>
    </div>
  );
}
