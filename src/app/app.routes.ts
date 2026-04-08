import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
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
                path: 'auth/microsoft/callback',
                loadComponent: () => import('./features/auth/microsoft-callback/microsoft-callback').then(m => m.MicrosoftCallback)
            }
        ]
    },
    { path: '**', component: NotFound }
];