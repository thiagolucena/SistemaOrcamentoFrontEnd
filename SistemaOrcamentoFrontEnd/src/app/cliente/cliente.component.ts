import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { stringify } from 'querystring';
import { Cliente } from '../models/cliente'
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cliente: Cliente;
  clientes: Cliente[];
  clientesFiltrados: Cliente[];
  _filtroLista = '';
  modalRef: BsModalRef;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarCliente = '';

  constructor(
    private clienteService: ClienteService,
    private modalService: BsModalService,
    private fb: FormBuilder
    ) { }

  get filtroListas(): string{
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.clientesFiltrados = this._filtroLista != '' ? this.filtrarCliente(this._filtroLista) : this.clientes
  }

  editarCliente(cliente: Cliente, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.cliente = Object.assign({}, cliente);
    this.registerForm.patchValue(this.cliente);
  }

  salvarAlteracao(template: any){
    if(this.registerForm.valid){

      if (this.modoSalvar === 'post'){

        this.cliente = Object.assign({}, this.registerForm.value);

        this.clienteService.saveCliente(this.cliente).subscribe(
          (novoCliente: Cliente) => {
            console.log(novoCliente);
            template.hide();
            this.registerForm.reset();
            this.getClientes();
          }, error => {
            console.log(error);
          }
        );
      }
      else{

        this.cliente = Object.assign({clienteId: this.cliente.clienteId}, this.registerForm.value);
        console.log('update');
        this.clienteService.updateCliente(this.cliente).subscribe(
          (novoCliente: Cliente) => {
            console.log(novoCliente);
            template.hide();
            this.registerForm.reset();
            this.getClientes();
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

  novoCliente(template: any) {
    this.modoSalvar = 'post';
    console.log(template)
    this.openModal(template);
  }

  filtrarCliente(filtrarPor: string): Cliente[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.clientes.filter(
      cliente => cliente.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }


  ngOnInit(): void {
    this.getClientes();
    this.validation();
  }

  getClientes() {
    console.log('aqui');
    this.clienteService.getAllClientes().subscribe(
      (_clientes: Cliente[]) => {
        this.clientes = _clientes;
        console.log(_clientes);
      }, error => {
        console.log(error);
        
      });
  }

  excluirCliente(cliente: Cliente, template: any) {
    this.openModal(template);
    this.cliente = cliente;
    this.bodyDeletarCliente = `Tem certeza que deseja excluir o cliente`;
  }
  
  confirmeDelete(template: any) {
    var id = this.cliente.clienteId.toString();
    this.clienteService.deleteCliente(id).subscribe(
      () => {
          template.hide();
          this.getClientes();
        }, error => {
          console.log(error);
        }
    );
  }

}
