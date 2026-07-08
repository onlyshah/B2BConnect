/**
 * Response Handler Service
 * Centralized handling of API responses, error messages, and notifications
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  closeable?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private toastIdCounter = 0;

  constructor() {}

  /**
   * Show success message
   */
  showSuccess(message: string, title: string = 'Success'): void {
    this.addToast('success', message, title);
  }

  /**
   * Show error message
   */
  showError(message: string, title: string = 'Error'): void {
    this.addToast('error', message, title);
  }

  /**
   * Show warning message
   */
  showWarning(message: string, title: string = 'Warning'): void {
    this.addToast('warning', message, title);
  }

  /**
   * Show info message
   */
  showInfo(message: string, title: string = 'Info'): void {
    this.addToast('info', message, title);
  }

  /**
   * Add toast notification
   */
  addToast(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
    duration: number = 5000,
    closeable: boolean = true
  ): void {
    const id = `toast-${++this.toastIdCounter}`;

    const toast: Toast = {
      id,
      type,
      message,
      title,
      duration,
      closeable,
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }
  }

  /**
   * Remove toast
   */
  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter((t) => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearToasts(): void {
    this.toastsSubject.next([]);
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Get current loading state
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Handle API error
   */
  handleApiError(error: any): void {
    let message = 'An unexpected error occurred';

    if (error?.message) {
      message = error.message;
    } else if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.statusCode) {
      switch (error.statusCode) {
        case 400:
          message = 'Invalid request data';
          break;
        case 401:
          message = 'Session expired. Please login again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          message = 'Resource not found';
          break;
        case 409:
          message = 'This resource already exists';
          break;
        case 422:
          message = 'Validation error. Please check your input.';
          break;
        case 429:
          message = 'Too many requests. Please try again later.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        case 503:
          message = 'Service unavailable. Please try again later.';
          break;
      }
    }

    this.showError(message);
  }

  /**
   * Handle API success
   */
  handleApiSuccess(message?: string): void {
    if (message) {
      this.showSuccess(message);
    }
  }

  /**
   * Parse validation errors
   */
  parseValidationErrors(errors: Record<string, string[]>): string[] {
    const errorMessages: string[] = [];

    for (const field in errors) {
      if (errors[field] && Array.isArray(errors[field])) {
        errors[field].forEach((msg: string) => {
          errorMessages.push(`${field}: ${msg}`);
        });
      }
    }

    return errorMessages;
  }

  /**
   * Show validation errors as toast
   */
  showValidationErrors(errors: Record<string, string[]>): void {
    const messages = this.parseValidationErrors(errors);
    messages.forEach((msg) => this.showError(msg));
  }
}
