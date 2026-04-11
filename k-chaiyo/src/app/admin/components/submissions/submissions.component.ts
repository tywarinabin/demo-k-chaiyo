import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubmissionService } from '../../services/submission.service';
import { FormSubmission, SubmissionFilters } from '../../models/admin.models';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss']
})
export class SubmissionsComponent implements OnInit {
  private readonly submissionService = inject(SubmissionService);

  submissions: FormSubmission[] = [];
  selectedSubmission: FormSubmission | null = null;
  showDetailModal = false;
  isLoading = true;
  isUpdating = false;
  error = '';

  filters: SubmissionFilters = {
    page: 1,
    limit: 20,
    status: undefined
  };

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  };

  statusOptions = [
    { value: undefined, label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'spam', label: 'Spam' }
  ];

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.isLoading = true;
    this.error = '';

    this.submissionService.getSubmissions(this.filters).subscribe({
      next: (response) => {
        this.submissions = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load submissions:', error);
        this.error = 'Failed to load submissions';
        this.isLoading = false;
        this.loadMockData();
      }
    });
  }

  onFilterChange(): void {
    this.filters.page = 1;
    this.loadSubmissions();
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.loadSubmissions();
  }

  viewDetails(submission: FormSubmission): void {
    this.selectedSubmission = submission;
    this.showDetailModal = true;
  }

  closeModal(): void {
    this.showDetailModal = false;
    this.selectedSubmission = null;
  }

  updateStatus(status: 'pending' | 'reviewed' | 'contacted' | 'spam', notes?: string): void {
    if (!this.selectedSubmission) return;

    this.isUpdating = true;

    this.submissionService.updateSubmissionStatus(this.selectedSubmission.id, status, notes).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Update local data
          const index = this.submissions.findIndex(s => s.id === this.selectedSubmission!.id);
          if (index !== -1) {
            this.submissions[index] = response.data;
          }

          this.selectedSubmission = response.data;
        }

        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Failed to update status:', error);
        alert('Failed to update status. Please try again.');
        this.isUpdating = false;
      }
    });
  }

  exportData(): void {
    this.submissionService.exportSubmissions(this.filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submissions-${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Export failed:', error);
        alert('Export failed. Please try again.');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'pending': 'status-pending',
      'reviewed': 'status-reviewed',
      'contacted': 'status-contacted',
      'spam': 'status-spam'
    };
    return classes[status] || 'status-pending';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, this.pagination.page - Math.floor(maxVisible / 2));
    const end = Math.min(this.pagination.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  private loadMockData(): void {
    const names = ['Nabin Tiwari', 'Raj Kumar', 'Sita Sharma', 'Ram Bahadur'];
    const categories = ['web-development', 'design', 'consultation', 'support'];
    const statuses: ('pending' | 'reviewed' | 'contacted' | 'spam')[] = ['pending', 'reviewed', 'contacted', 'spam'];

    this.submissions = Array.from({ length: 20 }, (_, i) => ({
      id: `submission-${i + 1}`,
      visitorId: `visitor-${i + 1}`,
      ipHash: 'a1b2c3d4...',
      fullName: names[i % names.length],
      email: `user${i + 1}@example.com`,
      phoneNumber: `+977-98${String(i).padStart(8, '0')}`,
      message: 'I am interested in your services and would like to know more about what you offer.',
      needsCategory: categories[i % categories.length],
      consentGiven: true,
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: statuses[i % statuses.length]
    } as FormSubmission));

    this.pagination = {
      page: 1,
      limit: 20,
      total: 156,
      totalPages: 8
    };

    this.isLoading = false;
  }
}
