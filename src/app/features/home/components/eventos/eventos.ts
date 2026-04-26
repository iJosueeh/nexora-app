import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCard } from './components/event-card/event-card';
import { UniversityEvent } from './interfaces/event.model';

import { EVENTS_MOCK } from './mocks/eventos.mock';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, EventCard],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventosPage {
  readonly categories = signal(['Todos', 'Debate', 'Taller', 'Feria', 'Conferencia']);
  readonly selectedCategory = signal('Todos');

  readonly events = signal<UniversityEvent[]>(EVENTS_MOCK);

  readonly filteredEvents = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'Todos') return this.events();
    return this.events().filter(e => e.category === cat);
  });
}
