import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pulse } from './pulse';
import { RouterTestingModule } from '@angular/router/testing';

describe('Pulse', () => {
  let component: Pulse;
  let fixture: ComponentFixture<Pulse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pulse, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Pulse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
