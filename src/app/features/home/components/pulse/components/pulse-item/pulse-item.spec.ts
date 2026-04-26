import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PulseItem } from './pulse-item';
import { provideRouter } from '@angular/router';

describe('PulseItem', () => {
  let component: PulseItem;
  let fixture: ComponentFixture<PulseItem>;

  const mockItem = {
    id: '1',
    name: 'Test Name',
    role: 'FACULTAD',
    content: 'Test Content',
    time: '2h',
    initials: 'TN',
    avatarBg: '#000',
    avatarColor: '#fff',
    actionLabel: 'Ver',
    actionLink: '/test'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulseItem],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PulseItem);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('item', mockItem);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display item content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(mockItem.content);
  });
});
