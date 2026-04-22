import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedPage } from './pages/feed-page/feed-page';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { API_BASE_URL, GRAPHQL_URL } from '@app/core/tokens/api-endpoints.token';
import { ToastrModule } from 'ngx-toastr';

describe('FeedPage Component', () => {
  let component: FeedPage;
  let fixture: ComponentFixture<FeedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedPage, RouterTestingModule, ApolloTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: API_BASE_URL, useValue: 'http://api.test' },
        { provide: GRAPHQL_URL, useValue: 'http://graphql.test' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedPage);
    component = fixture.componentInstance;
  });

  it('should create the feed-page component', () => {
    expect(component).toBeTruthy();
  });

  it('should have sidebars and main content area', () => {
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('app-feed-sidebar');
    const trends = fixture.nativeElement.querySelector('app-feed-trends');
    const container = fixture.nativeElement.querySelector('app-feed-container');
    
    expect(sidebar).toBeTruthy();
    expect(trends).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it('should display feed elements', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nexora');
    expect(compiled.textContent).toContain('Inicio');
  });

  it('should render app-feed-sidebar component', () => {
    fixture.detectChanges();
    const sidebarComponent = fixture.nativeElement.querySelector('app-feed-sidebar');
    expect(sidebarComponent).toBeTruthy();
  });

  it('should render app-feed-trends component', () => {
    fixture.detectChanges();
    const trendsComponent = fixture.nativeElement.querySelector('app-feed-trends');
    expect(trendsComponent).toBeTruthy();
  });

  it('should render app-feed-container component', () => {
    fixture.detectChanges();
    const containerComponent = fixture.nativeElement.querySelector('app-feed-container');
    expect(containerComponent).toBeTruthy();
  });
});
