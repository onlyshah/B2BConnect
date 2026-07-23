import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../../services/story.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiEmptyStateComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Stories" eyebrow="content" description="Publish and review stories, launches, and brand updates for your network.">
      <div class="module-shell">
        <div class="module-hero">
          <span class="module-tag">Content pipeline</span>
          <h2>Keep your network aligned with your latest stories</h2>
          <p>Bring campaigns, launches, and customer highlights into one place for the whole team.</p>
        </div>

        <div class="module-grid" *ngIf="!loading && !message">
          <ui-card *ngFor="let story of stories" [title]="story.title || 'Untitled story'" [subtitle]="story.category || 'Marketing'">
            <div class="module-list">
              <div class="module-row"><span>Status</span><strong>{{ story.status || 'draft' }}</strong></div>
              <div class="module-row"><span>Published</span><strong>{{ story.publishedAt ? (story.publishedAt | date:'mediumDate') : 'Pending' }}</strong></div>
            </div>
          </ui-card>
        </div>

        <ui-empty-state *ngIf="loading" title="Loading stories" description="Fetching the latest content rollouts."></ui-empty-state>
        <ui-empty-state *ngIf="message && !loading" title="We hit a snag" [description]="message" tone="error"></ui-empty-state>
      </div>
    </ui-page-shell>
  `,
  styles: []
})
export class StoriesComponent implements OnInit, OnDestroy {
  stories: any[] = [];
  loading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(private storyService: StoryService, private authService: AuthService) {}

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
      },
      error: (err) => {
        console.error('Failed to load stories', err);
        this.message = 'Unable to load stories.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

