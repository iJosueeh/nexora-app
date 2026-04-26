import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Collaboration } from './collaboration';
import { RouterTestingModule } from '@angular/router/testing';

describe('Collaboration', () => {
  let component: Collaboration;
  let fixture: ComponentFixture<Collaboration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Collaboration, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Collaboration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
