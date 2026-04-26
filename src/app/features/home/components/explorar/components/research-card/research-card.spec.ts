import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearchCard } from './research-card';

describe('ResearchCard', () => {
  let component: ResearchCard;
  let fixture: ComponentFixture<ResearchCard>;

  const mockPaper = {
    id: '1',
    title: 'Test Paper',
    author: 'Test Author',
    faculty: 'Sistemas',
    date: '2024-01-01',
    summary: 'Test Summary',
    views: 100
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchCard]
    }).compileComponents();

    fixture = TestBed.createComponent(ResearchCard);
    component = fixture.componentInstance;
    
    // Set required input
    fixture.componentRef.setInput('paper', mockPaper);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display paper title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain(mockPaper.title);
  });

  it('should display paper faculty', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span')?.textContent).toContain(mockPaper.faculty);
  });
});
