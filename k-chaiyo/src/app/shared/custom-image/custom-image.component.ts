import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

/**
 * Reusable image with skeleton, graceful fallback, and fixed aspect box.
 * Keeps product grids aligned regardless of source image dimensions.
 */
@Component({
  selector: 'app-custom-image',
  standalone: true,
  imports: [NgClass, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="custom-image relative overflow-hidden w-full"
      [ngStyle]="{ 'aspect-ratio': aspectRatio, 'border-radius': radius }"
      [ngClass]="containerClass"
    >
      @if (loading()) {
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:800px_100%] animate-shimmer"
          aria-hidden="true"
        ></div>
      }
      @if (!errored()) {
        <img
          [src]="src"
          [alt]="alt"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 h-full w-full transition-transform duration-300 ease-out group-hover:scale-105"
          [ngClass]="objectFitClass"
          (load)="onLoad()"
          (error)="onError()"
        />
      } @else {
        <div
          class="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400"
          role="img"
          [attr.aria-label]="alt"
        >
          <i class="fas fa-image text-3xl"></i>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CustomImageComponent {
  @Input({ required: true }) src!: string;
  @Input({ required: true }) alt!: string;
  @Input() aspectRatio = '1 / 1';
  @Input() radius = '12px';
  @Input() objectFit: 'contain' | 'cover' = 'contain';
  @Input() containerClass = '';

  protected loading = signal(true);
  protected errored = signal(false);
  protected objectFitClass = computed(() =>
    this.objectFit === 'cover' ? 'object-cover' : 'object-contain p-2'
  );

  onLoad(): void {
    this.loading.set(false);
  }

  onError(): void {
    this.loading.set(false);
    this.errored.set(true);
  }
}
