import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonHeader, IonToolbar, IonTitle, IonBackButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

interface RoleOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Join B2BConnect</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2 class="text-2xl font-bold mb-4">How would you like to join?</h2>
      <p class="text-gray-600 mb-6">Select your user type to get started</p>

      <div *ngFor="let role of roles" class="mb-4">
        <ion-card (click)="selectRole(role)" button="true" class="cursor-pointer">
          <ion-card-header>
            <div class="text-4xl mb-2">{{ role.icon }}</div>
            <ion-card-title>{{ role.title }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p class="text-sm text-gray-700">{{ role.description }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `
})
export class RoleSelectionPage {
  roles: RoleOption[] = [
    {
      id: 'company',
      icon: '🏢',
      title: 'Company',
      description: 'Manufacturer or brand owner managing products and distribution'
    },
    {
      id: 'distributor',
      icon: '🚚',
      title: 'Distributor',
      description: 'Manage inventory and connect with retailers'
    },
    {
      id: 'salesman',
      icon: '👨‍💼',
      title: 'Salesman',
      description: 'Field sales representative managing visits and orders'
    },
    {
      id: 'retailer',
      icon: '🏪',
      title: 'Retailer',
      description: 'Retail store owner ordering products online'
    }
  ];

  constructor(private router: Router) {}

  selectRole(role: RoleOption): void {
    this.router.navigate(['/auth/register', role.id]);
  }
}
