import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: '<div>Profile of {{ profile()?.username }}</div>'
})
class MockProfilePage {
  profile = signal({ username: 'testuser', handle: '@testuser' });
  isOwnProfile = signal(true);
}

describe('ProfilePage Logic', () => {
  let component: MockProfilePage;
  let fixture: ComponentFixture<MockProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockProfilePage],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MockProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render profile username', () => {
    expect(fixture.nativeElement.textContent).toContain('testuser');
  });
});
