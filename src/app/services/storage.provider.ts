
import { Storage } from '@ionic/storage';

export function provideIonicStorage() {
  const storage = new Storage();
  return [
    {
      provide: Storage,
      useFactory: async () => {
        await storage.create(); // Important to call create() before using it
        return storage;
      },
    },
  ];
}
