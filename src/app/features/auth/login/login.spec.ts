import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { API_BASE_URL, GRAPHQL_URL } from '../../../core/tokens/api-endpoints.token';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
        { provide: GRAPHQL_URL, useValue: 'http://graphql.test' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
