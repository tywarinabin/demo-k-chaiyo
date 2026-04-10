import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NgFor, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  imports: [NgFor, NgClass, NgStyle],
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
      accent: 'purple',
      avatarColor: '#7C3AED',
      quote: 'K Chaiyo? ko concept ekdam ramro cha! Nepal lai yesto platform chaieko thyo. Waitlist join garisakey — launch huna sakdina!'
    },
    {
      name: 'Rajesh Thapa',
      location: 'Pokhara',
      initials: 'RT',
      rating: 5,
      accent: 'blue',
      avatarColor: '#2563EB',
      quote: 'Early demo dekhepaxi ta jhyap bhayo! UI ekdam clean cha, ordering process sajilo cha. Can\'t wait for the full launch!'
    },
    {
      name: 'Anita Gurung',
      location: 'Biratnagar',
      initials: 'AG',
      rating: 5,
      accent: 'cyan',
      avatarColor: '#06B6D4',
      quote: 'Finally Nepal mai international-level delivery platform aaudai cha! Prices pani reasonable dekhiyo. K chaiyo? Sab cha yaha!'
    },
    {
      name: 'Bikash Adhikari',
      location: 'Chitwan',
      initials: 'BA',
      rating: 5,
      accent: 'purple',
      avatarColor: '#7C3AED',
      quote: 'Nepal mai yesto platform chaieko thyo! International quality products local price ma — K Chaiyo? le Nepal ko e-commerce nai change garcha!'
    },
    {
      name: 'Priya Maharjan',
      location: 'Lalitpur',
      initials: 'PM',
      rating: 5,
      accent: 'blue',
      avatarColor: '#2563EB',
      quote: 'Demo version try gareko, UI ekdam smooth cha! Ordering process 2 minute mai sakiyo. Pahila yesto experience Nepal mai paako thiyena.'
    },
    {
      name: 'Sunil Rai',
      location: 'Dharan',
      initials: 'SR',
      rating: 4,
      accent: 'cyan',
      avatarColor: '#06B6D4',
      quote: 'Eastern Nepal samma delivery aaucha bhanne sunera khushi lagyo! Finally haami pani online shopping enjoy garna paauchau.'
    },
    {
      name: 'Manisha KC',
      location: 'Butwal',
      initials: 'MK',
      rating: 5,
      accent: 'purple',
      avatarColor: '#EC4899',
      quote: 'Fashion section ko preview dekhey — K ramro selections! Trending international brands Nepal mai paincha? Amazing! Waitlist ma chu already.'
    },
    {
      name: 'Dipak Shrestha',
      location: 'Bhaktapur',
      initials: 'DS',
      rating: 5,
      accent: 'blue',
      avatarColor: '#059669',
      quote: 'Electronics ko range dami cha! Latest gadgets Nepal mai order garna milne? K Chaiyo? le game change garcha. Excited for launch!'
    },
    {
      name: 'Sabina Tamang',
      location: 'Hetauda',
      initials: 'ST',
      rating: 4,
      accent: 'cyan',
      avatarColor: '#D97706',
      quote: 'Delivery system ko plan suneko — 75+ districts cover garcha re? K Chaiyo team serious cha! Small towns lai pani include gareko ma khushi.'
    },
    {
      name: 'Roshan Poudel',
      location: 'Nepalgunj',
      initials: 'RP',
      rating: 5,
      accent: 'purple',
      avatarColor: '#2563EB',
      quote: 'Western Nepal bata order garna milne sunera ta jhyap! K chaiyo? Sab chaiyo — aba locally nai paincha. Best initiative for Nepal!'
    },
    {
      name: 'Aarati Basnet',
      location: 'Birgunj',
      initials: 'AB',
      rating: 5,
      accent: 'blue',
      avatarColor: '#7C3AED',
      quote: 'Beauty products ko collection hereko — sabai top brands cha! K chaiyo skincare ko lagi? K Chaiyo? ma sab cha. Love this platform!'
    },
    {
      name: 'Kiran Magar',
      location: 'Dhangadhi',
      initials: 'KM',
      rating: 4,
      accent: 'cyan',
      avatarColor: '#06B6D4',
      quote: 'Far-west Nepal samma reach garcha bhanne sunera ta aba k chaiyo? Secure payment options cha, delivery cha — full package!'
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

  getEmptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
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
