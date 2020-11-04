import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Orcamento } from '../models/orcamento';


@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {

  url = 'https://localhost:44321/api/orcamento/';

  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getOrcamentoByLogin(orcamento: Orcamento): Observable<Orcamento> {
    return this.httpClient.post<Orcamento>(this.url + 'GetLogin', JSON.stringify(orcamento), this.httpOptions)
  }

  getOrcamentoById(id: number): Observable<Orcamento> {
    return this.httpClient.get<Orcamento>(this.url + id)
  }

  getAllOrcamentos(): Observable<Orcamento[]> {
    console.log('aqui2');
    return this.httpClient.get<Orcamento[]>(this.url)  }

  saveOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    return this.httpClient.post<Orcamento>(this.url, JSON.stringify(orcamento), this.httpOptions)
  }

  updateOrcamento(orcamento: Orcamento): Observable<Orcamento> {
    console.log('update2');
    console.log(this.url + orcamento.orcamentoId);
    console.log(orcamento);
    return this.httpClient.put<Orcamento>(this.url + orcamento.orcamentoId, JSON.stringify(orcamento), this.httpOptions)

  }

  deleteOrcamento(id: string): Observable<Orcamento> {
    return this.httpClient.delete<Orcamento>(this.url + id, this.httpOptions)

  }



  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = 'Código do erro: ${error.status}, ' + 'menssagem: ${error.message}';
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
