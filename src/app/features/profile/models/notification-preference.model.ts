export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  {
    id: 'new_features',
    title: 'Nuevas Funcionalidades',
    description: 'Recibe alertas sobre nuevas funciones y actualizaciones de la aplicación',
    enabled: true
  },
  {
    id: 'reservation_reminder',
    title: 'Recordatorio de Reserva',
    description: 'Recibe recordatorios antes de que comience tu tiempo de reserva',
    enabled: false
  },
  {
    id: 'session_ending',
    title: 'Sesión por Finalizar',
    description: 'Recibe alertas cuando tu sesión esté a punto de finalizar',
    enabled: false
  },
  {
    id: 'penalties',
    title: 'Penalizaciones',
    description: 'Recibe notificaciones sobre penalizaciones por incumplimiento de normas',
    enabled: true
  },
  {
    id: 'promotions',
    title: 'Promociones y Novedades',
    description: 'Recibe información sobre promociones especiales y novedades.',
    enabled: false
  }
];
