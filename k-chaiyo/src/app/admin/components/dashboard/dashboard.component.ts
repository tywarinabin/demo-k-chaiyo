import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { DashboardAnalytics } from '../../models/admin.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  analytics: DashboardAnalytics | null = null;
  isLoading = true;
  error: string = '';

  dateRange: 'today' | 'week' | 'month' | 'custom' = 'week';
  selectedSource = '';

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;
    this.error = '';

    const { startDate, endDate } = this.getDateRange();

    this.analyticsService.getDashboardAnalytics(startDate, endDate, this.selectedSource || undefined).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.analytics = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load analytics:', error);
        this.error = 'Failed to load analytics data';
        this.isLoading = false;

        // Mock data for demo
        this.loadMockData();
      }
    });
  }

  onDateRangeChange(): void {
    this.loadAnalytics();
  }

  onSourceChange(): void {
    this.loadAnalytics();
  }

  refreshData(): void {
    this.loadAnalytics();
  }

  private getDateRange(): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (this.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(startDate.getDate() - 30);
        break;
    }

    return { startDate, endDate };
  }

  private loadMockData(): void {
    // Mock data for demonstration
    this.analytics = {
      totalVisits: 15420,
      uniqueVisitors: 8934,
      formSubmissions: 234,
      conversionRate: 2.62,
      topSources: [
        { source: 'Facebook', visits: 6500, conversions: 120, conversionRate: 1.85 },
        { source: 'Organic', visits: 5200, conversions: 80, conversionRate: 1.54 },
        { source: 'Google', visits: 3720, conversions: 34, conversionRate: 0.91 }
      ],
      topCountries: [
        { country: 'Nepal', countryCode: 'NP', visits: 12000 },
        { country: 'India', countryCode: 'IN', visits: 2100 },
        { country: 'United States', countryCode: 'US', visits: 1320 }
      ],
      hourlyTrend: [],
      dailyTrend: this.generateMockDailyTrend(),
      recentSubmissions: []
    };

    this.isLoading = false;
  }

  private generateMockDailyTrend(): any[] {
    const trend = [];
    const days = 7;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      trend.push({
        timestamp: date,
        visits: Math.floor(Math.random() * 3000) + 1000,
        submissions: Math.floor(Math.random() * 50) + 10
      });
    }

    return trend;
  }

  getMaxVisits(): number {
    if (!this.analytics?.dailyTrend) return 0;
    return Math.max(...this.analytics.dailyTrend.map(d => d.visits));
  }

  getChartHeight(value: number): number {
    const maxVisits = this.getMaxVisits();
    return maxVisits > 0 ? (value / maxVisits) * 100 : 0;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getSourceIcon(source: string): string {
    const icons: any = {
      'facebook': '📘',
      'google': '🔍',
      'organic': '🌐',
      'twitter': '🐦',
      'instagram': '📸',
      'linkedin': '💼'
    };

    return icons[source.toLowerCase()] || '📊';
  }

  getCountryFlag(countryCode: string): string {
    const flags: any = {
      'NP': '🇳🇵',
      'IN': '🇮🇳',
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'AU': '🇦🇺'
    };

    return flags[countryCode] || '🌍';
  }
}
