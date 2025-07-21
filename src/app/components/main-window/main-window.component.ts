import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VersionPopupComponent } from '../version-popup/version-popup.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main-window',
  standalone: true,
  imports: [
    HeaderComponent, 
    CommonModule, 
    FormsModule, 
    VersionPopupComponent
  ],
  templateUrl: './main-window.component.html',
  styleUrl: './main-window.component.scss'
})
export class MainWindowComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messageText: string = '';
  messages: { 
    text: string | SafeHtml; 
    sender: 'user' | 'bot'; 
    isHtml?: boolean;
    isSpeaking?: boolean;
  }[] = [];
  showWelcome: boolean = true;
  showVersionPopup: boolean = false;
  private shouldScroll: boolean = false;
  private speechSynthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    this.speechSynthesis = window.speechSynthesis;
  }

  toggleVersionPopup(): void {
    this.showVersionPopup = !this.showVersionPopup;
  }

  // toggleSpeech(message: any): void {
  //   if (message.isSpeaking) {
  //     this.stopSpeaking();
  //     message.isSpeaking = false;
  //   } else {
  //     // Stop any other message that might be speaking
  //     this.messages.forEach(m => {
  //       if (m.isSpeaking) {
  //         m.isSpeaking = false;
  //       }
  //     });
  //     this.stopSpeaking();
      
  //     // Start speaking this message
  //     let text = '';
  //     if (typeof message.text === 'string') {
  //       text = message.text;
  //     } else if (message.isHtml) {
  //       // Create a temporary div to extract text from HTML
  //       const tempDiv = document.createElement('div');
  //       tempDiv.innerHTML = message.text.toString();
  //       text = tempDiv.textContent || tempDiv.innerText || '';
  //     }

  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.onend = () => {
  //       message.isSpeaking = false;
  //     };
      
  //     this.currentUtterance = utterance;
  //     this.speechSynthesis.speak(utterance);
  //     message.isSpeaking = true;
  //   }
  // }

  // private stopSpeaking(): void {
  //   if (this.currentUtterance) {
  //     this.speechSynthesis.cancel();
  //     this.currentUtterance = null;
  //   }
  // }

  // closeHelpPopup(): void {
  //   this.showHelpPopup = false;
  // }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  async sendMessage() {
    if (this.messageText?.trim()) {
      // Add user message
      this.messages.push({ text: this.messageText, sender: 'user' });
      this.showWelcome = false;
      this.shouldScroll = true;
      
      // Store message and clear input
      const userRequest = this.messageText;
      this.messageText = '';

      try {
        // Add processing message
        this.messages.push({ 
          text: "Processing your request. Your data will be available shortly.", 
          sender: 'bot' 
        });
        this.shouldScroll = true;

        // Encode the query and create URL
        const encodedQuery = encodeURIComponent(userRequest);
        const url = `/services/sdk/platform/jaxrs/addonn/partner/cleanonnoperationsappconnect/addonn/assisstance/result?query=${encodedQuery}`;

        // Make the GET request
        const response = await fetch(url, {
          method: 'GET'
        });
        this.http.get(environment.AWS_URL + url).subscribe(async (response: any) => {
          
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rawResult = await response.text();
        console.log("Raw result:", rawResult);

        // Create table HTML and sanitize it
        const tableHTML = this.createTable(rawResult);
        const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(tableHTML);

        // Process the response and add it to messages
        this.processLargeResponse(rawResult);
        this.messages.push({ 
          text: sanitizedHtml, 
          sender: 'bot',
          isHtml: true 
        });
        this.shouldScroll = true;

      } catch (error) {
        console.error("Error fetching query result:", error);
        this.messages.push({ 
          text: "❌ Error occurred while fetching the query result.", 
          sender: 'bot' 
        });
        this.shouldScroll = true;
      }
    }
  }

  private createTable(data: string): string {
    // Split the data into lines (rows)
    const lines = data.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return '';

    // Parse the first line to determine headers and column positions
    const headerLine = lines[0];
    const colPositions: number[] = [];
    const headers: string[] = [];

    // Use a regular expression to find non-whitespace sequences (words) and their positions
    let lastPos = 0;
    headerLine.replace(/\S+/g, (match, offset) => {
      colPositions.push(offset); // Start position of each column
      headers.push(match.trim()); // Header name
      lastPos = offset + match.length;
      return match; // Need to return the match to satisfy TypeScript
    });
    colPositions.push(headerLine.length); // End position of the last column

    // The number of columns is the number of headers
    const numColumns = headers.length;

    // Parse each subsequent line into rows based on column positions
    const rows: string[][] = [];
    for (let i = 1; i < lines.length; i++) {
      const rowText = lines[i];
      const row: string[] = [];

      // Split the row into columns based on the positions from the header line
      for (let j = 0; j < numColumns; j++) {
        const start = colPositions[j];
        const end = colPositions[j + 1];
        // Extract the cell value between the start and end positions
        const cellValue = rowText.substring(start, end).trim();
        row.push(cellValue || ''); // Use empty string if no value
      }

      // Only add the row if it has the correct number of columns
      if (row.length === numColumns) {
        rows.push(row);
      }
    }

    // Build the HTML table with Bootstrap classes
    let html = '<table class="table table-striped table-bordered">';
    // Add header row
    html += '<thead><tr>' + headers.map(h => `<th>${this.escapeHtml(h)}</th>`).join('') + '</tr></thead>';

    // Add data rows
    html += '<tbody>';
    for (const row of rows) {
      html += '<tr>' + row.map(cell => `<td>${this.escapeHtml(cell)}</td>`).join('') + '</tr>';
    }
    html += '</tbody></table>';

    return html;
  }

  private processLargeResponse(response: string): void {
    // Implement any additional processing logic here
    console.log('Processing response:', response);
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  clearMessage(): void {
    this.messageText = '';
  }
}
