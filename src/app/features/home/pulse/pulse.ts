import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface PulseItem {
  id: number;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  content: string;
  actionLabel: string;
  actionLink: string;
  time: string;
}

@Component({
  selector: 'app-pulse',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './pulse.html',
  styleUrl: './pulse.css',
})
export class Pulse {
  pulseItems: PulseItem[] = [
    {
      id: 1,
      name: 'Dr. Elena Vos',
      role: 'Investigadora, Matemáticas',
      initials: 'EV',
      avatarBg: '#1e3a5f',
      avatarColor: '#60a5fa',
      content:
        'Just uploaded the preliminary results on Neuro-Symbiosis ethics. Seeking peer review from the Engineering cohort.',
      actionLabel: 'Peer Review',
      actionLink: '/pulse/1',
      time: '2 hrs',
    },
    {
      id: 2,
      name: 'Julian Thorne',
      role: 'Posgrado, Ing. Civil',
      initials: 'JT',
      avatarBg: '#3b1f5e',
      avatarColor: '#c084fc',
      content:
        'Organizing a workshop for the Smart City Challenge. Any architects interested in modular housing?',
      actionLabel: 'Activarse',
      actionLink: '/pulse/2',
      time: '3 hrs',
    },
    {
      id: 3,
      name: 'Sarah Lin',
      role: 'Investigadora, TIC',
      initials: 'SL',
      avatarBg: '#1f3d2a',
      avatarColor: '#4ade80',
      content:
        'The logic gap in the basic campus automation scripts has been identified. Join the dev-thread for details.',
      actionLabel: 'Dev Thread',
      actionLink: '/pulse/3',
      time: '5 hrs',
    },
  ];
}
