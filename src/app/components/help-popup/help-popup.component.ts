import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-popup.component.html',
  styleUrl: './help-popup.component.scss'
})
export class HelpPopupComponent {
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
} 