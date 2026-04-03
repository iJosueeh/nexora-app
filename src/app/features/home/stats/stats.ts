import { Component } from '@angular/core';

interface Stat {
  id: number;
  value: string;
  label: string;
  highlight: boolean;
}

@Component({
  selector: 'app-stats',
  imports: [],
  standalone: true,
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  stats: Stat[] = [
    { id: 1, value: '5k+', label: 'Estudiantes Activos', highlight: false },
    { id: 2, value: '1.2k+', label: 'Proyectos de Investigación', highlight: true },
    { id: 3, value: '50+', label: 'Comunidades Especializadas', highlight: false },
  ];
}
