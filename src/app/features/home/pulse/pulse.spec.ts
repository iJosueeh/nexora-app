import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pulse } from './pulse';

describe('Pulse', () => {
  let component: Pulse;
  let fixture: ComponentFixture<Pulse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pulse],
    }).compileComponents();

    fixture = TestBed.createComponent(Pulse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
