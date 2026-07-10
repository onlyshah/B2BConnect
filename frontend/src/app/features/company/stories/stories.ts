import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../../services/story.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent],
  templateUrl: './stories.html',
  styleUrls: ['./stories.css']
})
export class StoriesComponent implements OnInit, OnDestroy {
  stories: any[] = [];
  loading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(private storyService: StoryService, private authService: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStories();

    this.authService.currentUser$
      .pipe(filter(user => !!user), takeUntil(this.destroy$))
      .subscribe(() => this.loadStories());
  }

  loadStories() {
    this.loading = true;
    this.storyService.getStories({ page: 1, limit: 20 }).subscribe({
      next: (data) => {
        this.stories = data || [];
        this.loading = false;
        try { this.cd.detectChanges(); } catch(e) {}
      },
      error: (err) => {
        console.error('Failed to load stories', err);
        this.message = 'Unable to load stories.';
        this.loading = false;
        try { this.cd.detectChanges(); } catch(e) {}
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

