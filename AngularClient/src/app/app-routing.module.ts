import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameComponent } from './game/game.component';
import { TradeComponent } from './trade/trade.component';
import { HomeComponent } from './home/home.component'

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'game', component: GameComponent, canActivate: [AuthGuard]
    },
    {
        path: 'signup', component: SignUpComponent
    },
    {
        path: 'trade', component: TradeComponent, canActivate: [AuthGuard]
    },
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard]
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
    },
    {
        path: '**', component: LoginComponent
    }

];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes, { onSameUrlNavigation: 'reload' }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
