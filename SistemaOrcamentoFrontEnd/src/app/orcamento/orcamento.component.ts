import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { stringify } from 'querystring';
import { Orcamento } from '../models/orcamento';
import { OrcamentoService } from '../services/orcamento.service';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.css']
})
export class OrcamentoComponent implements OnInit {

  orcamento: Orcamento;
  orcamentos: Orcamento[];
  orcamentosFiltrados: Orcamento[];
  _filtroLista = '';
  modalRef: BsModalRef;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarOrcamento = '';

  constructor(
    private orcamentoService: OrcamentoService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) { }

  get filtroListas(): string{
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.orcamentosFiltrados = this._filtroLista != '' ? this.filtrarOrcamento(this._filtroLista) : this.orcamentos
  }

  editarOrcamento(orcamento: Orcamento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.orcamento = Object.assign({}, orcamento);
    this.registerForm.patchValue(this.orcamento);
  }

  salvarAlteracao(template: any){
    if(this.registerForm.valid){

      if (this.modoSalvar === 'post'){

        this.orcamento = Object.assign({}, this.registerForm.value);

        this.orcamentoService.saveOrcamento(this.orcamento).subscribe(
          (novoOrcamento: Orcamento) => {
            console.log(novoOrcamento);
            template.hide();
            this.registerForm.reset();
            this.getOrcamentos();
          }, error => {
            console.log(error);
          }
        );
      }
      else{

        this.orcamento = Object.assign({orcamentoId: this.orcamento.orcamentoId}, this.registerForm.value);
        console.log('update');
        this.orcamentoService.updateOrcamento(this.orcamento).subscribe(
          (novoOrcamento: Orcamento) => {
            console.log(novoOrcamento);
            template.hide();
            this.registerForm.reset();
            this.getOrcamentos();
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

  novoOrcamento(template: any) {
    this.modoSalvar = 'post';
    console.log(template)
    this.openModal(template);
  }

  filtrarOrcamento(filtrarPor: string): Orcamento[]{
    filtrarPor = filtrarPor;
    return this.orcamentos.filter(
      orcamento => orcamento.orcamentoId.toString().indexOf(filtrarPor) !== -1
    );
  }


  ngOnInit(): void {
    this.getOrcamentos();
    this.validation();
  }

  getOrcamentos() {
    console.log('aqui');
    this.orcamentoService.getAllOrcamentos().subscribe(
      (_orcamentos: Orcamento[]) => {
        this.orcamentos = _orcamentos;
        console.log(_orcamentos);
      }, error => {
        console.log(error);
        
      });
  }

  excluirOrcamentos(orcamento: Orcamento, template: any) {
    this.openModal(template);
    this.orcamento = orcamento;
    this.bodyDeletarOrcamento = `Tem certeza que deseja excluir o orcamento`;
  }
  
  confirmeDelete(template: any) {
    var id = this.orcamento.orcamentoId.toString();
    this.orcamentoService.deleteOrcamento(id).subscribe(
      () => {
          template.hide();
          this.getOrcamentos();
        }, error => {
          console.log(error);
        }
    );
  }


}
