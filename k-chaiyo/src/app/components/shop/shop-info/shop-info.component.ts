import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-shop-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  template: `
    <footer class="bg-white border-t border-gray-100 font-poppins animate-fade-up">

      <!-- ── Category info strip ── -->
      <div class="px-6 md:px-10 py-5" style="background: linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(37,99,235,0.04) 100%);">
        <div class="flex items-start gap-3 max-w-3xl">
          <span
            class="mt-0.5 shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-[0_4px_14px_rgba(124,58,237,0.28)]"
            style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
          >
            <i class="fas fa-store text-[12px]"></i>
          </span>
          <div>
            <h2 class="text-sm font-bold text-shop-text mb-0.5">{{ activeCategory().name }} Online</h2>
            <p class="text-[12px] text-shop-mutedText leading-relaxed">
              K Chaiyo? le timlai Nepal ko best fresh products 22 minute bhitra tyahai delivery gardinchha —
              quality dairy, snacks, beverages, ra daily essentials, sabai trusted brands bata.
              Ghar bata order gara, hamilai tension chhoda.
            </p>
          </div>
        </div>
      </div>

      <!-- ── Gradient divider ── -->
      <div
        class="h-px w-full"
        style="background: linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.25) 30%, rgba(37,99,235,0.25) 70%, transparent 100%);"
      ></div>

      <!-- ── Main footer columns ── -->
      <div class="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">

        <!-- Brand column -->
        <div class="px-6 md:px-8 py-7 md:w-[260px] shrink-0">
          <div class="flex items-center gap-2 mb-3">
            <span
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg shadow-[0_4px_14px_rgba(124,58,237,0.28)]"
              style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
            >
              <svg viewBox="0 0 32 32" class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 13h16v7a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-7Z"/>
                <path d="M22 15h2a3 3 0 0 1 0 6h-2"/>
                <path d="M11 5c.8 1.2.8 2.5 0 3.7s-.8 2.5 0 3.7"/>
                <path d="M16 5c.8 1.2.8 2.5 0 3.7s-.8 2.5 0 3.7"/>
              </svg>
            </span>
            <span class="text-base font-extrabold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              K Chaiyo?
            </span>
          </div>
          <p class="text-[12px] text-shop-mutedText leading-relaxed mb-5">
            Nepal's fastest grocery delivery. Fresh products at your door in 22 minutes, every day.
          </p>

          <!-- Delivery badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 mb-5">
            <i class="fas fa-bolt text-amber-500 text-[10px]"></i>
            <span class="text-[11px] font-semibold text-amber-700">22-min delivery</span>
          </div>

          <!-- Social links -->
          <div class="flex items-center gap-2">
            @for (s of socials; track s.label) {
              <a
                [href]="s.href"
                [attr.aria-label]="s.label"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-shop-mutedText hover:border-brand-primary/40 hover:text-brand-primary hover:bg-white transition-all duration-200 text-[13px]"
              >
                <i [class]="s.icon"></i>
              </a>
            }
          </div>
        </div>

        <!-- Quick Links -->
        <div class="px-6 md:px-8 py-7 flex-1">
          <h3 class="footer-heading">
            <span class="footer-heading-dot"></span>
            Quick Links
          </h3>
          <ul class="space-y-2.5">
            @for (link of quickLinks; track link.label) {
              <li>
                <a
                  href="#"
                  class="flex items-center gap-2.5 text-[13px] text-shop-mutedText hover:text-brand-primary transition-colors duration-200 group"
                >
                  <i [class]="link.icon + ' text-[11px] text-gray-300 group-hover:text-brand-primary/60 transition-colors duration-200'"></i>
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>
        </div>

        <!-- Delivery Zones -->
        <div class="px-6 md:px-8 py-7 flex-1">
          <h3 class="footer-heading">
            <span class="footer-heading-dot"></span>
            Delivery Zones
          </h3>
          <ul class="space-y-2.5">
            @for (zone of deliveryZones; track zone) {
              <li class="flex items-center gap-2 text-[13px] text-shop-mutedText">
                <i class="fas fa-location-dot text-brand-primary/60 text-[10px]"></i>
                {{ zone }}
              </li>
            }
          </ul>
        </div>

        <!-- Contact & App -->
        <div class="px-6 md:px-8 py-7 flex-1">
          <h3 class="footer-heading">
            <span class="footer-heading-dot"></span>
            Contact
          </h3>
          <ul class="space-y-3 mb-5">
            @for (c of contacts; track c.label) {
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-50 border border-gray-100">
                  <i [class]="c.icon + ' text-brand-primary text-[10px]'"></i>
                </span>
                <span class="text-[12px] text-shop-mutedText leading-tight pt-0.5">{{ c.label }}</span>
              </li>
            }
          </ul>

          <!-- Separator inside column -->
          <div class="h-px bg-gray-100 mb-4"></div>

          <!-- App badges -->
          <p class="text-[11px] font-semibold text-shop-mutedText uppercase tracking-wider mb-2.5">Get the App</p>
          <div class="flex flex-col gap-2">
            @for (app of appBadges; track app.label) {
              <div
                class="inline-flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[12px] font-medium text-shop-text cursor-pointer hover:border-brand-primary/40 hover:bg-white transition-all duration-200 w-fit"
              >
                <i [class]="app.icon + ' text-[14px]'"></i>
                <div class="leading-none">
                  <div class="text-[9px] text-shop-mutedText">Download on</div>
                  <div class="text-[12px] font-semibold">{{ app.label }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- ── Gradient divider ── -->
      <div
        class="h-px w-full"
        style="background: linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 30%, rgba(37,99,235,0.15) 70%, transparent 100%);"
      ></div>

      <!-- ── Bottom bar ── -->
      <div class="px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/60">
        <p class="text-[11px] text-shop-mutedText text-center sm:text-left flex items-center gap-1">
          © 2024 K Chaiyo? · Built with
          <i class="fas fa-heart text-red-400 text-[9px]"></i>
          in Nepal
        </p>
        <div class="flex items-center gap-1 text-[11px] text-shop-mutedText">
          @for (link of legalLinks; track link; let last = $last) {
            <a href="#" class="hover:text-brand-primary transition-colors duration-200 px-2">{{ link }}</a>
            @if (!last) {
              <span class="text-gray-300">|</span>
            }
          }
        </div>
      </div>

    </footer>
  `,
  styles: [`
    .footer-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 14px;
    }
    .footer-heading-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7C3AED, #2563EB);
      flex-shrink: 0;
    }
  `]
})
export class ShopInfoComponent {
  private readonly productService = inject(ProductService);
  protected readonly activeCategory = this.productService.activeCategory;

  protected readonly socials = [
    { label: 'Facebook',  href: '#', icon: 'fab fa-facebook-f' },
    { label: 'Instagram', href: '#', icon: 'fab fa-instagram' },
    { label: 'X / Twitter', href: '#', icon: 'fab fa-x-twitter' },
    { label: 'WhatsApp', href: '#', icon: 'fab fa-whatsapp' }
  ];

  protected readonly quickLinks = [
    { label: 'Home',           icon: 'fas fa-house' },
    { label: 'About Us',       icon: 'fas fa-circle-info' },
    { label: 'Track Order',    icon: 'fas fa-truck-fast' },
    { label: 'Offers & Deals', icon: 'fas fa-tag' },
    { label: 'FAQs',           icon: 'fas fa-circle-question' }
  ];

  protected readonly deliveryZones = [
    'Hattiban, Lalitpur',
    'Sanepa, Lalitpur',
    'Balkhu, Kathmandu',
    'Pulchowk, Lalitpur',
    'Ekantakuna, Lalitpur'
  ];

  protected readonly contacts = [
    { icon: 'fas fa-phone',   label: '+977 01-5555-222' },
    { icon: 'fas fa-envelope', label: 'hello@kchaiyo.com.np' },
    { icon: 'fas fa-clock',   label: 'Open daily · 7am – 11pm' }
  ];

  protected readonly appBadges = [
    { label: 'Google Play', icon: 'fab fa-google-play text-green-600' },
    { label: 'App Store',   icon: 'fab fa-apple text-gray-800' }
  ];

  protected readonly legalLinks = ['Privacy Policy', 'Terms of Service', 'Refund Policy'];
}
