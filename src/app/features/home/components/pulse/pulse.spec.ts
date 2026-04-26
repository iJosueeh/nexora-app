import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PulsePage } from './pulse';
import { provideRouter } from '@angular/router';

describe('PulsePage', () => {
  let component: PulsePage;
  let fixture: ComponentFixture<PulsePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulsePage],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PulsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have pulse items', () => {
    expect(component.pulseItems().length).toBeGreaterThan(0);
  });
});
