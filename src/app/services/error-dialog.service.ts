import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  logErrors(error: { log: string; type: string }): void {
    console.log(`[${error.type}]`, error.log);
  }

  openDialog(message: string, status: number): void {
    console.error(`Error ${status}: ${message}`);
    // Implement actual dialog logic here if needed
  }
}
