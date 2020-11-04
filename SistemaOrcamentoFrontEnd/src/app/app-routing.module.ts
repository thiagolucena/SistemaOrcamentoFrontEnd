import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { ItemComponent } from './item/item.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path: 'cliente', component: ClienteComponent},
  {path: 'usuario', component: UsuarioComponent},
  {path: 'item', component: ItemComponent},
  {path: 'orcamento', component: OrcamentoComponent},
  {path: '', component: DashboardComponent},
  {path: '**', component:DashboardComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
