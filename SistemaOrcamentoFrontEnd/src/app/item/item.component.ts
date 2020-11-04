import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { stringify } from 'querystring';
import { Item } from '../models/item'
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  item: Item;
  itens: Item[];
  itensFiltrados: Item[];
  _filtroLista = '';
  modalRef: BsModalRef;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarItem = '';

  constructor(
    private itemService: ItemService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) { }

  get filtroListas(): string{
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.itensFiltrados = this._filtroLista != '' ? this.filtrarItem(this._filtroLista) : this.itens
  }

  editarItem(item: Item, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.item = Object.assign({}, item);
    this.registerForm.patchValue(this.item);
  }

  salvarAlteracao(template: any){
    if(this.registerForm.valid){

      if (this.modoSalvar === 'post'){

        this.item = Object.assign({}, this.registerForm.value);

        this.itemService.saveItem(this.item).subscribe(
          (novoItem: Item) => {
            console.log(novoItem);
            template.hide();
            this.registerForm.reset();
            this.getItens();
          }, error => {
            console.log(error);
          }
        );
      }
      else{

        this.item = Object.assign({itemId: this.item.itemId}, this.registerForm.value);
        console.log('update');
        this.itemService.updateItem(this.item).subscribe(
          (novoItem: Item) => {
            console.log(novoItem);
            template.hide();
            this.registerForm.reset();
            this.getItens();
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

  novoItem(template: any) {
    this.modoSalvar = 'post';
    console.log(template)
    this.openModal(template);
  }

  filtrarItem(filtrarPor: string): Item[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.itens.filter(
      item => item.descricao.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }


  ngOnInit(): void {
    this.getItens();
    this.validation();
  }

  getItens() {
    console.log('aqui');
    this.itemService.getAllItens().subscribe(
      (_itens: Item[]) => {
        this.itens = _itens;
        console.log(_itens);
      }, error => {
        console.log(error);
        
      });
  }

  excluirCliente(item: Item, template: any) {
    this.openModal(template);
    this.item = item;
    this.bodyDeletarItem = `Tem certeza que deseja excluir o cliente`;
  }
  
  confirmeDelete(template: any) {
    var id = this.item.itemId.toString();
    this.itemService.deleteItem(id).subscribe(
      () => {
          template.hide();
          this.getItens();
        }, error => {
          console.log(error);
        }
    );
  }

}
