import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCard } from './event-card';
import { UniversityEvent } from '../../interfaces/event.model';

describe('EventCard', () => {
  let component: EventCard;
  let fixture: ComponentFixture<EventCard>;

  const mockEvent: UniversityEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    date: '2024-01-01',
    location: 'Test Location',
    category: 'Debate',
    attendees: 10
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCard]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCard);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('event', mockEvent);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain(mockEvent.title);
  });
});
