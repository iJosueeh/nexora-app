import { Component } from '@angular/core';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [],
  standalone: true,
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  testimonials: Testimonial[] = [
    {
      id: 1,
      quote:
        'El Hub de Investigación ha transformado totalmente cómo colaboramos en la Facultad de Ingeniería. Es el puente interdisciplinar que necesitábamos.',
      name: 'Prof. Adrian Sterling',
      role: 'Facultad de Ingeniería, UTP',
      initials: 'AS',
      avatarBg: '#1e3a5f',
      avatarColor: '#60a5fa',
    },
    {
      id: 2,
      quote:
        'Encontrar una comunidad de investigadores con mis mismos intereses era difícil hasta que llegué a Nexora. El nivel de discurso es realmente elevado.',
      name: 'Li Wei',
      role: 'Posgrado, Sistemas UTP',
      initials: 'LW',
      avatarBg: '#3b1f5e',
      avatarColor: '#c084fc',
    },
    {
      id: 3,
      quote:
        'The minimalism of the platform allows me to focus on what matters: the data and the dialogue. Truly a scholar-first experience.',
      name: 'Marcus Thorne',
      role: 'Senior Researcher, Exchange',
      initials: 'MT',
      avatarBg: '#1f3d2a',
      avatarColor: '#4ade80',
    },
  ];
}
