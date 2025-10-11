import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Main } from './pages/main/main';
import { Editprofile } from './pages/editprofile/editprofile';
import { Creategame } from './pages/creategame/creategame';
import { Gamedetail } from './pages/gamedetail/gamedetail';
import { EditGame } from './pages/edit-game/edit-game';
import { History } from './pages/history/history';
import { HistoryUser } from './pages/history-user/history-user';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'register', component: Register },
    { path: 'main', component: Main },
    { path: 'edit-profile', component: Editprofile },
    { path: 'creategame', component: Creategame },
    { path: 'game-detail/:id', component: Gamedetail },
    { path: 'edit-game/:id', component: EditGame },
    { path: 'history/:userId', component: History },
    { path: 'history-user', component: HistoryUser },
    

];
