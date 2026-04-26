import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventosPage } from './eventos';

describe('EventosPage', () => {
  let component: EventosPage;
  let fixture: ComponentFixture<EventosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosPage]
    }).compileComponents();

    fixture = TestBed.createComponent(EventosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter events by category', () => {
    component.selectedCategory.set('Debate');
    expect(component.filteredEvents().every(e => e.category === 'Debate')).toBe(true);
  });
});
