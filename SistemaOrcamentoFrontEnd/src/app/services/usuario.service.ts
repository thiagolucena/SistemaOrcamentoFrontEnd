import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'https://localhost:44321/api/usuario/';

  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getUsuarioByLogin(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.url + 'GetLogin', JSON.stringify(usuario), this.httpOptions)
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(this.url + id)
  }

  getAllUsuarios(): Observable<Usuario[]> {
    console.log('aqui2');
    return this.httpClient.get<Usuario[]>(this.url)  }

  saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.url, JSON.stringify(usuario), this.httpOptions)
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    console.log('update2');
    console.log(this.url + usuario.usuarioId);
    console.log(usuario);
    return this.httpClient.put<Usuario>(this.url + usuario.usuarioId, JSON.stringify(usuario), this.httpOptions)

  }

  deleteUsuario(id: string): Observable<Usuario> {
    return this.httpClient.delete<Usuario>(this.url + id, this.httpOptions)

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

