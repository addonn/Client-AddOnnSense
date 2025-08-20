import { Component, ViewChild, ElementRef, AfterViewChecked, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VersionPopupComponent } from '../version-popup/version-popup.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { WsService, ChatMessage, ChartData } from '../../services/websocket.service';
import { StorageService } from '../../services/storage.service';
import { AppConstants } from '../../models/app.constants';
import { User } from '../../models/user';
import { jwtDecode } from 'jwt-decode';
import { ChartComponent } from '../chart/chart.component';
import { FloorMapComponent } from '../floor-map/floor-map.component';
import floorSample from '../../../assets/mock/floorfeaturecollections.json'; // Sample floor map data

@Component({
  selector: 'app-main-window',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    VersionPopupComponent,
    ChartComponent,
    FloorMapComponent
  ],
  templateUrl: './main-window.component.html',
  styleUrl: './main-window.component.scss'
})
export class MainWindowComponent implements AfterViewChecked, OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messageText: string = '';
  messages: {
    text: any;
    sender: 'user' | 'bot';
    isHtml?: boolean;
    isSpeaking?: boolean;
    isChart?: boolean; // For chart messages
    isFloorMap?: boolean; // For floor messages
    floorMapData?: any; // For floor map data
  }[] = [];
  showWelcome: boolean = true;
  showVersionPopup: boolean = false;
  private shouldScroll: boolean = false;
  private speechSynthesis: SpeechSynthesis | undefined;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isBrowser: boolean;
  private wsConnected: boolean = false;
  private wsSubscription: any;
  private wsStatusSubscription: any;
  private backendProvider: string = '';
  private packages: string[] = [];
  private aimodels: string = '';
  // Add class properties for assistant_id and vector_store_id
  assistant_id: string = '';
  vector_store_id: string = '';
  thread_id: string = ''
  floorQueryInProgress: boolean = false;
  FLOOR_URL = 'https://addonn-test.planoncloud.com/services/sdk/platform/jaxrs/addonn/partner/cleanonnoperationsappconnect/addonn/floor/geojson/{floorNumber}';
  floorGeoJson: any = null;


  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private wsService: WsService,
    private storageService: StorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  ngOnInit() {
    // Connect to WebSocket and subscribe to messages
    this.wsService.connect();
    this.getAccountDetails();
    this.wsSubscription = this.wsService.onMessage().subscribe((msg: ChatMessage) => {
      this.showWelcome = false;
      let displayText: string | SafeHtml = msg.content;
      // Track assistant/vector store IDs
      console.log('Messages:', JSON.stringify(this.messages, null, 2));
      console.log('Current message:', JSON.stringify(msg, null, 2));
      if (msg.assistant_id) {
        this.assistant_id = msg.assistant_id;
      }
      if (msg.vector_store_id) {
        this.vector_store_id = msg.vector_store_id;
      }
      if (msg.thread_id) {
        this.thread_id = msg.thread_id;
      }  
      console.log('Thread ID:', this.thread_id);
      console.log('Assistant ID:', this.assistant_id);
      console.log('Vector Store ID:', this.vector_store_id);

      if (!msg.isDone) {
        // Streaming in progress
        const lastBotMsg = this.messages[this.messages.length - 1];
        if (lastBotMsg && lastBotMsg.sender === 'bot' && !lastBotMsg.isHtml) {
          lastBotMsg.text = msg.content;
        } else {
          // First stream chunk – push new message
          this.messages.push({
            text: msg.chartData?.data || msg.content,
            sender: 'bot',
            isHtml: false,
            isChart: !!msg.chartData
          });
        }

        this.shouldScroll = true;

      } else if (msg.type === 'done') {
        // Streaming finished, do nothing or mark complete
      }

      // if(!msg.isDone){
      //   accumulatedText=accumulatedText+' '+msg.content
      // }else{
      //   this.messages.push({
      //     text: displayText,
      //     sender: msg.type === 'user' ? 'user' : 'bot',
      //     isHtml: false
      //   });
      // }

      this.shouldScroll = true;
    });
    this.wsStatusSubscription = this.wsService.onConnectionStatus().subscribe((status: boolean) => {
      this.wsConnected = status;
    });
  }




  ngOnDestroy() {
    if (this.wsSubscription) this.wsSubscription.unsubscribe();
    if (this.wsStatusSubscription) this.wsStatusSubscription.unsubscribe();
    this.wsService.disconnect();
  }


  async getAccountDetails() {
    const userData = localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER);
    if (userData) {
      const currentUser = new User(JSON.parse(userData));
      const customer = currentUser.getAccount();

      if (customer) {
        const key = AppConstants.STORAGE_ACCOUNT.replace('{ACCOUNT}', customer);
        const account = await this.storageService.get(key);

        const license = account?.license;

        if (license) {
          console.log('🔐 Decoding license token:', license);

          try {
            const decoded: any = jwtDecode(license);

            this.backendProvider = decoded.backendProvider;
            this.packages = decoded.packages || [];
            this.aimodels = decoded.aimodel?.[0]?.name || '';

            console.log('✅ backendProvider:', this.backendProvider);
            console.log('✅ packages:', this.packages);
            console.log('✅ ai models:', this.aimodels);

          } catch (err) {
            console.error('❌ Error decoding JWT license:', err);
          }
        }
      }
    }
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
    if (this.shouldScroll && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (!this.messagesContainer) return;
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
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
    const userInput = this.messageText?.trim();
    console.log('floorSample', floorSample);
    console.log('Sending message:', userInput);
    if (!userInput) return;

    this.messages.push({
      text: userInput,
      sender: 'user',
      isHtml: false
    });

    this.showWelcome = false;
    this.shouldScroll = true;

    if (this.floorQueryInProgress) {
      // Step 2: Capture floor number and fetch geoJSON
      const floorNumber = userInput;

      this.floorGeoJson = floorSample;
      this.messages.push({
        isFloorMap: true,
        floorMapData: floorSample,
        sender: 'bot',
        text: undefined
      });

      // this.messages.push({
      //   text: '',
      //   sender: 'bot',
      //   isHtml: false,
      //   isChart: false,
      //   isFloorMap: true,
      //    floorMapData: this.floorGeoJson,
      // });
       this.floorQueryInProgress = false;
      // this.messages.push({
      //   text: `Here is the map for floor ${floorNumber}:`,
      //   sender: 'bot',
      //   isHtml: false,
      //   isFloorMap: true
      // });
     
      // const url = this.FLOOR_URL.replace('{floorNumber}', floorNumber) + `?accesskey=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJNQVJDIiwicG5BdXRvR2VuZXJhdGVkIjpmYWxzZSwiaXNzIjoiUGxhbm9uIFNvZnR3YXJlIiwiZXhwIjoxODkzNTYwNjQwLCJpYXQiOjE3MzcxNzY2Njl9.fsDAFx_z7zAC4FMM8HluP7mN8snyv5cg5tH-oR177XO2ugGpwgbB6CojoiqWsU2WFpSNSDmm2N1II2EBOV_ZgRcMDUALBOBElgtsgSXQjXTd9qlmBz2C_abJvi46L2xNNugJqsPaGz-qjDH8HE1M1C4vKR3GrUoYaXQ6BSgzRYuDUEKkrjRls6U_VD8wz6KdoLxZJ2GllCszjUDSLHKNw4wVZoeKq0KdrFS62LvaRL5D4_MOsVoaU9Ospeim5Fi3l7_zbtiIsD_hojxviR1J3SVqoCGqmOsciR8lKqfYeQZjpgzbcsRJ9-UmFmq4EglFUUG-4V90i5nuwQc9sKnupg`;
      // this.floorGeoJson = null; // Reset previous floor map
      // try {
      //   const res = await fetch(url);
      //   const json = await res.json();

      //   this.floorGeoJson = json;
      //   this.floorGeoJson = floorSample;
      //   console.log('Floor GeoJSON:', this.floorGeoJson);
      //   this.floorQueryInProgress = false;

      //   this.messages.push({
      //     text: `Here is the map for floor ${floorNumber}:`,
      //     sender: 'bot',
      //     isHtml: false,
      //     isFloorMap: true
      //   });

      // } catch (err) {
      //   this.messages.push({
      //     text: `❌ Failed to load floor ${floorNumber}. Try again later.`,
      //     sender: 'bot',
      //     isHtml: false
      //   });
      //   this.floorQueryInProgress = false;
      // }

      this.messageText = '';
      return;
    }

    if (userInput.toLowerCase() === 'floor') {
      this.floorQueryInProgress = true;
      this.messages.push({
        text: '🧭 Which floor number would you like to see?',
        sender: 'bot',
        isHtml: false
      });

      this.messageText = '';
      return;
    }

    // Otherwise, send regular assistant message
    // {"type": "openai_ids", "openai_info":
    //    {"assistant_id": "asst_Oos9dR6WsdEnLLrYPsAuhV97", 
    //     "vector_store_id": "", 
    //     "thread_id": "thread_zPyYu9M5DFOjGDoXhjEN0wTU", "file_id": ""}}
    const payload = {
      action: 'sendMessage',
      data: {
        provider: 'openai',
        message: userInput,
        backend_url: 'https://addonndev-dev.planoncloud.com/services/sdk/platform/jaxrs/addonn/partner/cleanonnoperationsappconnect/addonn/assisstance/clientQueryBuilder',
        //this token for test environment only for floor map data 
        backend_token: '',
        assistant_id: this.assistant_id || '',
        vector_store_id: this.vector_store_id || '',
        thread_id: this.thread_id || '',
        backendProvider: this.backendProvider,
        packages: this.packages,
        aimodels: this.aimodels
      }
    };

    this.wsService.sendPayload(payload);
    this.messageText = '';
    this.shouldScroll = true;
  }

  clearMessage(): void {
    this.messageText = '';
  }
}
