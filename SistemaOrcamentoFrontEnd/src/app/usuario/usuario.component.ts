import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { stringify } from 'querystring';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario: Usuario;
  usuarios: Usuario[];
  usuariosFiltrados: Usuario[];
  _filtroLista = '';
  modalRef: BsModalRef;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarUsuario = '';

  constructor(
    private usuarioService: UsuarioService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) { }

  get filtroListas(): string{
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.usuariosFiltrados = this._filtroLista != '' ? this.filtrarUsuario(this._filtroLista) : this.usuarios
  }

  editarUsuario(usuario: Usuario, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.usuario = Object.assign({}, usuario);
    this.registerForm.patchValue(this.usuario);
  }

  salvarAlteracao(template: any){
    if(this.registerForm.valid){

      if (this.modoSalvar === 'post'){

        this.usuario = Object.assign({}, this.registerForm.value);

        this.usuarioService.saveUsuario(this.usuario).subscribe(
          (novoUsuario: Usuario) => {
            console.log(novoUsuario);
            template.hide();
            this.registerForm.reset();
            this.getUsuarios();
          }, error => {
            console.log(error);
          }
        );
      }
      else{

        this.usuario = Object.assign({usuarioId: this.usuario.usuarioId}, this.registerForm.value);
        console.log('update');
        this.usuarioService.updateUsuario(this.usuario).subscribe(
          (novoUsuario: Usuario) => {
            console.log(novoUsuario);
            template.hide();
            this.registerForm.reset();
            this.getUsuarios();
          }, error => {
            console.log(error);
          }
        );

      }



    }

  }

  validation(){
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      endereco: ['', Validators.required]
    });
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  novoUsuario(template: any) {
    this.modoSalvar = 'post';
    console.log(template)
    this.openModal(template);
  }

  filtrarUsuario(filtrarPor: string): Usuario[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.usuarios.filter(
      usuario => usuario.login.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }


  ngOnInit(): void {
    this.getUsuarios();
    this.validation();
  }

  getUsuarios() {
    console.log('aqui');
    this.usuarioService.getAllUsuarios().subscribe(
      (_usuarios: Usuario[]) => {
        this.usuarios = _usuarios;
        console.log(_usuarios);
      }, error => {
        console.log(error);
        
      });
  }

  excluirUsuarios(usuario: Usuario, template: any) {
    this.openModal(template);
    this.usuario = usuario;
    this.bodyDeletarUsuario = `Tem certeza que deseja excluir o usuario`;
  }
  
  confirmeDelete(template: any) {
    var id = this.usuario.usuarioId.toString();
    this.usuarioService.deleteUsuario(id).subscribe(
      () => {
          template.hide();
          this.getUsuarios();
        }, error => {
          console.log(error);
        }
    );
  }


}
