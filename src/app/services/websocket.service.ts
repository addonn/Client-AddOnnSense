import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';

export interface ChatMessage {
  type: 'user' | 'assistant' | 'stream' | 'done'| 'visualization' | 'floor' |'openai_ids' | 'error';
  content: string;
  floorMapData?: any; 
  chartData?: ChartData; // Optional for visualization messages
  assistant_id: string;
  thread_id?: string; // Optional for openai_ids messages
  vector_store_id: string;
  timestamp: Date;
  isDone:boolean;
}

export interface ChartData {
  chartType: 'pie' | 'bar' | 'line';
  labels: string[];
  data: number[];
  title: string;
}

@Injectable({ providedIn: 'root' })
export class WsService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<ChatMessage>();
  private connectionStatus = new Subject<boolean>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  connect(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('WebSocket not available in server environment');
      return;
    }
    if (typeof WebSocket === 'undefined') {
      console.error('WebSocket is not supported in this environment');
      return;
    }
    this.socket = new WebSocket('wss://5p60bes04j.execute-api.eu-central-1.amazonaws.com/dev');
    // this.socket = new WebSocket('ws://localhost:8000/ws');
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.connectionStatus.next(true);
      // Do NOT send any payload here. Only send when user enters a message.
    };

    // this.socket.onmessage = (event) => {
    //   const message: ChatMessage = {
    //     type: 'assistant',
    //     content: event.data,
    //     timestamp: new Date()
    //   };
    //   this.messageSubject.next(message);
    // };
    let accumulatedMessage = '';
    let currentAssistantMessage: ChatMessage | null = null;

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
 
      if (data.type === 'stream') {
        accumulatedMessage += data.data;
        if (!currentAssistantMessage) {
          // First time: create and emit the message
          currentAssistantMessage = {
            type: 'assistant',
            content: accumulatedMessage,
            timestamp: new Date(),
            assistant_id:  '',
            vector_store_id:'',
            thread_id: '',
            isDone:false
          };
          this.messageSubject.next(currentAssistantMessage);
        } else {
          // Update content and re-emit (your component should just update UI)
          currentAssistantMessage.content = accumulatedMessage;
          currentAssistantMessage.isDone=false;
          this.messageSubject.next({ ...currentAssistantMessage }); // emit updated object
        }
      }

      if (data.type === 'done') {
        // Reset for next streaming response
        currentAssistantMessage = {
          type: 'assistant',
          assistant_id:  '',
          vector_store_id:'',
          thread_id: '',
          content: accumulatedMessage,
          timestamp: new Date(),
          isDone:true
        };
        this.messageSubject.next(currentAssistantMessage);
        accumulatedMessage='';
      }

      // Add new condition for visual data
      if (data.type === 'visualization') {
        const chartMessage: ChatMessage = {
          type: 'assistant',
          content: '',
          chartData: {
            chartType: data.chartType,
            labels: data.labels,
            data: data.data,
            title: data.title
          },
          assistant_id: '',
          vector_store_id: '',
          timestamp: new Date(),
          isDone: false
        };
        this.messageSubject.next(chartMessage);
        return;
      }

      if (data.type === 'openai_ids') {
        // Reset for next streaming response
        
        currentAssistantMessage = {
          type: 'assistant',
          assistant_id: data.openai_info?.assistant_id || '',
          vector_store_id:data.openai_info?.vector_store_id || '',
          thread_id: data.openai_info?.thread_id || '',
          content: data,
          timestamp: new Date(),
          isDone:true
        };
        this.messageSubject.next(currentAssistantMessage);
        accumulatedMessage='';
      }

         //"type": "error", "error": "WebSocket error message"
      if (data.type === 'error') {
        console.error('WebSocket error:', data.error);
        this.messageSubject.error(new Error(data.error));
        this.messageSubject.next(data.error)
      }
     
    };


    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.connectionStatus.next(false);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus.next(false);
    };
  }

  sendPayload(payload: any): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Cannot send payload in server environment');
      return;
    }
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
      // Do NOT emit a user message here. Only emit assistant messages in onmessage handler.
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  onConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
} 