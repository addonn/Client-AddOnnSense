import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-version-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './version-popup.component.html',
  styleUrl: './version-popup.component.scss'
})
export class VersionPopupComponent {
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
} 