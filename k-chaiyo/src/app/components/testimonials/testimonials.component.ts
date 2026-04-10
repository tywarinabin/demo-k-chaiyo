import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  imports: [NgFor],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slidesPerView = 3;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;

  testimonials = [
    {
      name: 'Sita Sharma',
      location: 'Kathmandu',
      initials: 'SS',
      rating: 5,
      quote: 'K Chaiyo? ko concept ekdam ramro cha! Nepal lai yesto platform chaieko thyo. Waitlist join garisakey — launch huna sakdina!'
    },
    {
      name: 'Rajesh Thapa',
      location: 'Pokhara',
      initials: 'RT',
      rating: 5,
      quote: 'Early demo dekhepaxi ta jhyap bhayo! UI ekdam clean cha, ordering process sajilo cha. Can\'t wait for the full launch!'
    },
    {
      name: 'Anita Gurung',
      location: 'Biratnagar',
      initials: 'AG',
      rating: 5,
      quote: 'Finally Nepal mai international-level delivery platform aaudai cha! Prices pani reasonable dekhiyo. Excited for April 2027!'
    },
    {
      name: 'Bikash Adhikari',
      location: 'Chitwan',
      initials: 'BA',
      rating: 5,
      quote: 'Nepal mai yesto platform chaieko thyo! International quality products local price ma — K Chaiyo? le Nepal ko e-commerce nai change garcha!'
    },
    {
      name: 'Priya Maharjan',
      location: 'Lalitpur',
      initials: 'PM',
      rating: 5,
      quote: 'Demo version try gareko, UI ekdam smooth cha! Ordering process 2 minute mai sakiyo. Pahila yesto experience Nepal mai paako thiyena.'
    },
    {
      name: 'Sunil Rai',
      location: 'Dharan',
      initials: 'SR',
      rating: 5,
      quote: 'Eastern Nepal samma delivery aaucha bhanne sunera khushi lagyo! Finally haami pani online shopping enjoy garna paauchau. Waiting for the launch!'
    }
  ];

  ngOnInit(): void {
    this.updateSlidesPerView();
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSlidesPerView();
    if (this.currentSlide >= this.totalSlides()) {
      this.currentSlide = Math.max(0, this.totalSlides() - 1);
    }
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getDots(): number[] {
    return Array(this.totalSlides()).fill(0);
  }

  totalSlides(): number {
    return Math.max(1, this.testimonials.length - this.slidesPerView + 1);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides();
    this.resetAutoPlay();
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0
      ? this.totalSlides() - 1
      : this.currentSlide - 1;
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoPlay();
  }

  private updateSlidesPerView(): void {
    const width = window.innerWidth;
    if (width <= 640) {
      this.slidesPerView = 1;
    } else if (width <= 1024) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 3;
    }
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides();
    }, 4000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
