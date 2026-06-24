import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, IonContent, IonCard, IonCardContent],
  template: '<ion-content><ion-card><ion-card-content>Cart - Coming Soon</ion-card-content></ion-card></ion-content>'
})
export class CartComponent {}
