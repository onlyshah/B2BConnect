import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { VisitService } from '../../../services/visit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-salesman-visits',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './salesman-visits.html',
  styleUrls: ['./salesman-visits.css']
})
export class SalesmanVisitsComponent implements OnInit {
  visits = [
    { retailer: 'Jay Ambe Provision Store', status: 'Completed', note: 'Order booked • demo shared', time: '09:20 AM' },
    { retailer: 'Shiv Shakti Kirana', status: 'Pending', note: 'Follow-up scheduled', time: '11:00 AM' },
    { retailer: 'Krishna Mart', status: 'Completed', note: 'Payment collected', time: '03:15 PM' }
  ];

  constructor(
    private visitService: VisitService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUserSync();
    if (!user?.salesmanId) {
      return;
    }

    this.visitService.getVisits({ salesman: user.salesmanId }).subscribe({
      next: (visits) => {
        this.visits = Array.isArray(visits) && visits.length ? visits.map((visit: any) => this.toVisitView(visit)) : this.visits;
      },
      error: () => {
        this.visits = this.visits;
      }
    });
  }

  private toVisitView(visit: any) {
    const visitDate = visit?.visitDate || visit?.createdAt;
    return {
      retailer: visit?.retailer?.name || visit?.retailerName || 'Assigned retailer',
      status: this.capitalize(visit?.visitOutcome || visit?.status || 'Pending'),
      note: visit?.notes || visit?.purpose || 'Visit recorded',
      time: visitDate ? new Date(visitDate).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : 'Scheduled'
    };
  }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
