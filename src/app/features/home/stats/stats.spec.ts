import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stats } from './stats';
import { RouterTestingModule } from '@angular/router/testing';

describe('Stats', () => {
  let component: Stats;
  let fixture: ComponentFixture<Stats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stats, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Stats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
