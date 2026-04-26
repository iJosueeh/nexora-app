import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorarPage } from './explorar';
import { provideRouter } from '@angular/router';

describe('ExplorarPage', () => {
  let component: ExplorarPage;
  let fixture: ComponentFixture<ExplorarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorarPage],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter papers when category is selected', () => {
    const initialCount = component.filteredPapers().length;
    component.selectCategory('Sistemas');
    expect(component.filteredPapers().length).toBeLessThanOrEqual(initialCount);
    expect(component.filteredPapers().every(p => p.faculty === 'Sistemas')).toBe(true);
  });
});
