import { PulseEntry } from '../interfaces/pulse-entry.model';

export const PULSE_ITEMS_MOCK: PulseEntry[] = [
  {
    id: '1',
    name: 'Dr. Armando Paredes',
    role: 'FACULTAD DE INGENIERÍA',
    content: 'Acabo de publicar los resultados preliminares sobre el uso de grafeno en filtros de agua. ¡Un avance para la sostenibilidad!',
    time: 'hace 2h',
    initials: 'AP',
    avatarBg: '#2ecc71',
    avatarColor: '#fff',
    actionLabel: 'Ver Artículo',
    actionLink: '/explorar'
  },
  {
    id: '2',
    name: 'Ing. Elena Nito',
    role: 'INVESTIGADOR',
    content: 'Buscamos colaboradores para el proyecto de Robótica Autónoma. Interesados en Computer Vision, contactarme.',
    time: 'hace 5h',
    initials: 'EN',
    avatarBg: '#e67e22',
    avatarColor: '#fff',
    actionLabel: 'Colaborar',
    actionLink: '/u/elena.nito'
  }
];
