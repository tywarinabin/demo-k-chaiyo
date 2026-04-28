import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { ProductsComponent } from '../products/products.component';
import { FeaturesComponent } from '../features/features.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { StatsComponent } from '../stats/stats.component';
import { CtaComponent } from '../cta/cta.component';
import { FooterComponent } from '../footer/footer.component';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    ProductsComponent,
    FeaturesComponent,
    TimelineComponent,
    CountdownComponent,
    TestimonialsComponent,
    StatsComponent,
    CtaComponent,
    FooterComponent,
    ContactModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />
    <app-hero />
    <app-products />
    <app-features />
    <app-timeline />
    <app-countdown />
    <app-testimonials />
    <app-stats />
    <app-cta />
    <app-footer />
    <app-contact-modal />
  `
})
export class LandingComponent {}
