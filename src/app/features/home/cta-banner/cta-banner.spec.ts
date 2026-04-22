import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CtaBanner } from './cta-banner';
import { RouterTestingModule } from '@angular/router/testing';

describe('CtaBanner', () => {
  let component: CtaBanner;
  let fixture: ComponentFixture<CtaBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaBanner, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
