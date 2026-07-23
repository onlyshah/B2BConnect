import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiHeaderComponent } from './ui-header';

@Component({
  selector: 'ui-page-shell',
  standalone: true,
  imports: [CommonModule, UiHeaderComponent],
  template: `
    <section class="page-shell">
      <div class="page-shell__header" *ngIf="title || eyebrow || hasActions">
        <ui-header *ngIf="title || eyebrow" [title]="title" [eyebrow]="eyebrow">
          <div class="page-shell__actions" *ngIf="hasActions">
            <ng-content select="[slot=actions]"></ng-content>
          </div>
        </ui-header>
      </div>
      <p class="page-shell__description" *ngIf="description">{{ description }}</p>
      <div class="page-shell__content">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [
    `:host{display:block}.page-shell{display:grid;gap:16px}.page-shell__header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding-bottom:2px}.page-shell__actions{display:flex;gap:8px;flex-wrap:wrap}.page-shell__description{margin:-4px 0 0;color:var(--text-muted);line-height:1.6;max-width:860px}.page-shell__content{display:grid;gap:14px}`
  ]
})
export class UiPageShellComponent {
  @Input() title = '';
  @Input() eyebrow?: string;
  @Input() description?: string;

  get hasActions(): boolean {
    return true;
  }
}
