import { Routes } from '@angular/router';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    { path: '**', component: NotFound }
];