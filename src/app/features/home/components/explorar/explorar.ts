import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchCard } from './components/research-card/research-card';
import { ResearchPaper } from './interfaces/research-paper.model';
import { RESEARCH_PAPERS_MOCK } from './mocks/explorar.mock';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, ResearchCard],
  templateUrl: './explorar.html',
  styleUrl: './explorar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorarPage {
  readonly categories = signal(['Todos', 'Sistemas', 'Software', 'Industrial', 'Arquitectura', 'Administración', 'Marketing']);
  readonly selectedCategory = signal('Todos');

  readonly papers = signal<ResearchPaper[]>(RESEARCH_PAPERS_MOCK);

  readonly filteredPapers = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'Todos') return this.papers();
    return this.papers().filter(p => p.faculty === cat);
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
