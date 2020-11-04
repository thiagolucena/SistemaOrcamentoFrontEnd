import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Item } from '../models/item';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  url = 'https://localhost:44321/api/item/';

  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getItemByName(item: Item): Observable<Item> {
    return this.httpClient.post<Item>(this.url + 'Getname', JSON.stringify(item), this.httpOptions)
  }

  getItemById(id: number): Observable<Item> {
    return this.httpClient.get<Item>(this.url + id)
  }

  getAllItens(): Observable<Item[]> {
    console.log('aqui2');
    return this.httpClient.get<Item[]>(this.url)  }

  saveItem(item: Item): Observable<Item> {
    return this.httpClient.post<Item>(this.url, JSON.stringify(item), this.httpOptions)
  }

  updateItem(item: Item): Observable<Item> {
    console.log('update2');
    console.log(this.url + item.itemId);
    console.log(item);
    return this.httpClient.put<Item>(this.url + item.itemId, JSON.stringify(item), this.httpOptions)

  }

  deleteItem(id: string): Observable<Item> {
    return this.httpClient.delete<Item>(this.url + id, this.httpOptions)

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
