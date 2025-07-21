import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  isOnline(): boolean {
    return navigator.onLine;
  }
} 