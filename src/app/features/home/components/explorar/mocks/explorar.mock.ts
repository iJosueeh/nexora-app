import { ResearchPaper } from '../interfaces/research-paper.model';

export const RESEARCH_PAPERS_MOCK: ResearchPaper[] = [
  {
    id: '1',
    title: 'Optimización de Algoritmos en IA',
    author: 'Juan Pérez',
    faculty: 'Sistemas',
    date: '12 Abr 2024',
    summary: 'Un estudio sobre la eficiencia de redes neuronales en entornos de baja computación.',
    views: 1250
  },
  {
    id: '2',
    title: 'Arquitectura Sostenible en Lima',
    author: 'María Garcia',
    faculty: 'Arquitectura',
    date: '08 Abr 2024',
    summary: 'Propuesta de materiales biodegradables para construcciones urbanas.',
    views: 890
  },
  {
    id: '3',
    title: 'Impacto del Marketing Digital',
    author: 'Carlos Ruiz',
    faculty: 'Marketing',
    date: '05 Abr 2024',
    summary: 'Análisis de tendencias en redes sociales para el sector retail en Perú.',
    views: 2100
  }
];
