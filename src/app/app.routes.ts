import { Routes } from '@angular/router';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./features/home/home').then(m => m.Home)
            },
            {
                path: 'feed',
                loadComponent: () => import('./features/feed/feed-page').then(m => m.FeedPage)
                // canActivate: [authGuard]  // Deshabilitado para testing
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./layout/auth-layout/auth-layout').then(m => m.AuthLayout),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
            },
            {
                path: 'reset-password',
                loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword)
            }
        ]
    },
    { path: '**', component: NotFound }
];