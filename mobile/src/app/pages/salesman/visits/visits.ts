import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonText,
  IonList,
  IonListHeader
} from '@ionic/angular/standalone';
import { VisitService } from '../../../services/visit.service';

@Component({
  selector: 'app-visits-mobile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonText,
    IonList,
    IonListHeader
  ],
  templateUrl: './visits.html',
  styleUrls: ['./visits.scss']
})
export class VisitsMobileComponent implements OnInit {
  visits: any[] = [];
  loading = true;

  constructor(private visitService: VisitService) {}

  ngOnInit() {
    this.loadVisits();
  }

  loadVisits() {
    this.visitService.getVisits().subscribe({
      next: (data) => {
        this.visits = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading visits', err);
        this.loading = false;
      }
    });
  }
}
