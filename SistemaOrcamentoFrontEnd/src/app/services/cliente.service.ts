import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url = 'https://localhost:44321/api/cliente/';

  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getClienteByName(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.url + 'Getname', JSON.stringify(cliente), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(this.url + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getAllClientes(): Observable<Cliente[]> {
    console.log('aqui2');
    return this.httpClient.get<Cliente[]>(this.url)  }

  saveCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.url, JSON.stringify(cliente), this.httpOptions)
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    console.log('update2');
    console.log(this.url + cliente.clienteId);
    console.log(cliente);
    return this.httpClient.put<Cliente>(this.url + cliente.clienteId, JSON.stringify(cliente), this.httpOptions)

  }

  deleteCliente(id: string): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(this.url + id, this.httpOptions)

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
