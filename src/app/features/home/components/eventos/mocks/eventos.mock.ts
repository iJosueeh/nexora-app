import { UniversityEvent } from '../interfaces/event.model';

export const EVENTS_MOCK: UniversityEvent[] = [
  {
    id: '1',
    title: 'Debate: IA en la Ética Profesional',
    description: 'Un espacio para discutir los límites morales de la inteligencia artificial en el campo laboral.',
    date: '15 Mayo, 2024',
    location: 'Auditorio Central, Torre A',
    category: 'Debate',
    attendees: 45
  },
  {
    id: '2',
    title: 'Taller de Python para Data Science',
    description: 'Aprende las librerías fundamentales para el análisis de datos académicos.',
    date: '20 Mayo, 2024',
    location: 'Laboratorio L-402',
    category: 'Taller',
    attendees: 30
  },
  {
    id: '3',
    title: 'Feria de Proyectos de Ingeniería',
    description: 'Exposición de los mejores trabajos finales del ciclo 2024-I.',
    date: '25 Mayo, 2024',
    location: 'Patio de Ingeniería',
    category: 'Feria',
    attendees: 120
  }
];
