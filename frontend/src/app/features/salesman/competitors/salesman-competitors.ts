import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-competitors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-competitors.html',
  styleUrls: ['./salesman-competitors.css']
})
export class SalesmanCompetitorsComponent {
  reports = [
    { brand: 'Brand X', price: '₹95', remark: 'Offer active' },
    { brand: 'Brand Y', price: '₹88', remark: 'Visible at shelf' }
  ];
}
