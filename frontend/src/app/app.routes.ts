import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { LoginComponent } from './components/auth/login/login';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password';
import { Dashboard } from './components/reports/dashboard/dashboard';
import { Home } from './components/home/home';
// CLIENT
import { Getall as ClientGetall } from './components/client/getall/getall';
import { Create as ClientCreate } from './components/client/create/create';
import { Update as ClientUpdate } from './components/client/update/update';
import { Delete as ClientDelete } from './components/client/delete/delete';

// CONTRACT
import { Getall as ContractGetall } from './components/contract/getall/getall';
import { Create as ContractCreate } from './components/contract/create/create';
import { Update as ContractUpdate } from './components/contract/update/update';
import { Delete as ContractDelete } from './components/contract/delete/delete';

// PROPERTY
import { Getall as PropertyGetall } from './components/property/getall/getall';
import { Create as PropertyCreate } from './components/property/create/create';
import { Update as PropertyUpdate } from './components/property/update/update';
import { Delete as PropertyDelete } from './components/property/delete/delete';

import { Getall as OwnerGetall } from './components/owner/getall/getall';
import { Create as OwnerCreate } from './components/owner/create/create';
import { Update as OwnerUpdate } from './components/owner/update/update';

import { Getall as PropertyTypeGetall } from './components/property-type/getall/getall';
import { Create as PropertyTypeCreate } from './components/property-type/create/create';
import { Update as PropertyTypeUpdate } from './components/property-type/update/update';

import { Getall as AmenityGetall } from './components/amenity/getall/getall';
import { Create as AmenityCreate } from './components/amenity/create/create';
import { Update as AmenityUpdate } from './components/amenity/update/update';

import { Getall as PaymentGetall } from './components/payment/getall/getall';
import { Create as PaymentCreate } from './components/payment/create/create';
import { Update as PaymentUpdate } from './components/payment/update/update';

import { Getall as VisitGetall } from './components/visit/getall/getall';
import { Create as VisitCreate } from './components/visit/create/create';
import { Update as VisitUpdate } from './components/visit/update/update';


export const routes: Routes = [



    // AUTENTICACIÓN
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },

    // CLIENTES
    { path: 'client', component: ClientGetall, canActivate: [authGuard] },
    { path: 'client/create', component: ClientCreate, canActivate: [authGuard] },
    { path: 'client/update/:id', component: ClientUpdate, canActivate: [authGuard] },
    { path: 'client/delete/:id', component: ClientDelete, canActivate: [authGuard] },

    // CONTRATOS
    { path: 'contract', component: ContractGetall, canActivate: [authGuard] },
    { path: 'contract/create', component: ContractCreate, canActivate: [authGuard] },
    { path: 'contract/update/:id', component: ContractUpdate, canActivate: [authGuard] },
    { path: 'contract/delete/:id', component: ContractDelete, canActivate: [authGuard] },

    // PROPIEDADES
    { path: 'property', component: PropertyGetall, canActivate: [authGuard] },
    { path: 'property/create', component: PropertyCreate, canActivate: [authGuard] },
    { path: 'property/update/:id', component: PropertyUpdate, canActivate: [authGuard] },
    { path: 'property/delete/:id', component: PropertyDelete, canActivate: [authGuard] },


    { path: 'owner', component: OwnerGetall, canActivate: [authGuard] },
    { path: 'owner/create', component: OwnerCreate, canActivate: [authGuard] },
    { path: 'owner/update/:id', component: OwnerUpdate, canActivate: [authGuard] },
    
    { path: 'property-type', component: PropertyTypeGetall, canActivate: [authGuard] },
    { path: 'property-type/create', component: PropertyTypeCreate, canActivate: [authGuard] },
    { path: 'property-type/update/:id', component: PropertyTypeUpdate, canActivate: [authGuard] },

    { path: 'amenity', component: AmenityGetall, canActivate: [authGuard] },
    { path: 'amenity/create', component: AmenityCreate, canActivate: [authGuard] },
    { path: 'amenity/update/:id', component: AmenityUpdate, canActivate: [authGuard] },

    { path: 'payment', component: PaymentGetall, canActivate: [authGuard] },
    { path: 'payment/create', component: PaymentCreate, canActivate: [authGuard] },
    { path: 'payment/update/:id', component: PaymentUpdate, canActivate: [authGuard] },

   // VISITAS
{ path: 'visit', component: VisitGetall, canActivate: [authGuard] },
{ path: 'visit/create', component: VisitCreate, canActivate: [authGuard] },
{ path: 'visit/update/:id', component: VisitUpdate, canActivate: [authGuard] },

// HOME
{ path: 'home', component: Home, canActivate: [authGuard] },

// REPORTES
{ path: 'reports', component: Dashboard, canActivate: [authGuard] },

// REDIRECCIONES
{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: '**', redirectTo: '/login' }

];