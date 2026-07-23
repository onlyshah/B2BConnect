import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SampleService } from '../../../services/sample.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-distributor-samples',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './distributor-samples.html',
  styleUrls: ['./distributor-samples.css']
})
export class DistributorSamplesComponent implements OnInit {
  samples: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private sampleService: SampleService) {}

  ngOnInit(): void {
    this.sampleService.getSamples().subscribe({
      next: (data) => {
        this.samples = (data as any)?.data ?? data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load samples';
        this.loading = false;
      }
    });
  }
}
