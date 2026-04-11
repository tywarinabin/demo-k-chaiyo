import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitorService } from '../../services/visitor.service';
import { Visitor, VisitorFilters } from '../../models/admin.models';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss']
})
export class VisitorsComponent implements OnInit {
  private readonly visitorService = inject(VisitorService);

  visitors: Visitor[] = [];
  isLoading = true;
  error = '';

  filters: VisitorFilters = {
    page: 1,
    limit: 20,
    source: undefined,
    isBot: undefined
  };

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  };

  sources = ['All', 'Facebook', 'Google', 'Organic', 'Twitter', 'Instagram'];

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors(): void {
    this.isLoading = true;
    this.error = '';

    this.visitorService.getVisitors(this.filters).subscribe({
      next: (response) => {
        this.visitors = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load visitors:', error);
        this.error = 'Failed to load visitors';
        this.isLoading = false;
        this.loadMockData();
      }
    });
  }

  onFilterChange(): void {
    this.filters.page = 1;
    this.loadVisitors();
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.loadVisitors();
  }

  exportData(): void {
    this.visitorService.exportVisitors(this.filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visitors-${new Date().toISOString()}.csv`;
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

  getSourceBadgeClass(source: string): string {
    const classes: any = {
      'facebook': 'badge-blue',
      'google': 'badge-green',
      'organic': 'badge-gray',
      'twitter': 'badge-cyan',
      'instagram': 'badge-pink'
    };
    return classes[source?.toLowerCase()] || 'badge-gray';
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
    this.visitors = Array.from({ length: 20 }, (_, i) => ({
      id: `visitor-${i + 1}`,
      ipHash: 'a1b2c3d4...',
      userAgent: 'Mozilla/5.0...',
      visitedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      source: ['Facebook', 'Google', 'Organic', 'Twitter'][Math.floor(Math.random() * 4)],
      referralCode: Math.random() > 0.5 ? 'ref123' : undefined,
      landingPage: '/',
      countryCode: ['NP', 'IN', 'US'][Math.floor(Math.random() * 3)],
      sessionId: `session-${i + 1}`,
      isBot: Math.random() > 0.9
    } as Visitor));

    this.pagination = {
      page: 1,
      limit: 20,
      total: 234,
      totalPages: 12
    };

    this.isLoading = false;
  }
}
