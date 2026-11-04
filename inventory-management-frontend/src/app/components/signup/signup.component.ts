import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RegisterComponent],
  template: `<app-register></app-register>`
})
export class SignupComponent {}
