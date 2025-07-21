import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Client-AddOnnSense'; 
  constructor(private storage: Storage) {
      this.initializeLocalDB();
  }
  private async initializeLocalDB() {
        try {
            let drivers = await this.storage.driver;
            console.log('Drivers:', drivers);
            const value = await this.storage.get('test_key');
        } catch (error) {
            if (error?.message === 'Database not created. Must call create() first') {
                await this.storage.create();
                await this.storage.set('test_key', 'Hello Ionic Storage');
                await this.storage.set('A',"text");
            }
        }
    }
}
