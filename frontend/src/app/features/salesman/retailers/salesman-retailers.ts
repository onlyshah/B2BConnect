import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-retailers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-retailers.html',
  styleUrls: ['./salesman-retailers.css']
})
export class SalesmanRetailersComponent {
  retailers = [
    { name: 'Krishna Provision', address: 'Mumbai', outstanding: '₹4,200' },
    { name: 'Metro Convenience', address: 'Bangalore', outstanding: '₹1,100' },
    { name: 'Jay Ambe Super', address: 'Delhi', outstanding: '₹2,800' }
  ];
}
