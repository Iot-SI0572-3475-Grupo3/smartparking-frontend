import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {AuthenticationService} from "./app/features/iam/services/authentication.service";

bootstrapApplication(AppComponent, appConfig)
  .then((ref) => {
    if (typeof window !== 'undefined') {
      const auth = ref.injector.get(AuthenticationService);
      auth.initSession();
    }
  })
  .catch((err) => console.error(err));
