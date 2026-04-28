import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer
      class="w-full bg-white/95 backdrop-blur-md border-t border-gray-200 font-poppins"
    >
      <div
        class="w-full px-2 sm:px-6 lg:px-10 xl:px-14 py-4 sm:py-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <!-- Brand Column -->
          <div class="space-y-4">
            <a
              routerLink="/"
              class="flex items-center gap-1.5 sm:gap-2.5 shrink-0 transition-transform hover:scale-[1.02]"
              aria-label="K Chaiyo home"
            >
              <span
                class="relative inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl shadow-[0_6px_16px_rgba(124,58,237,0.35)]"
                style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 32 32"
                  class="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 13h16v7a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-7Z" />
                  <path d="M22 15h2a3 3 0 0 1 0 6h-2" />
                  <path d="M11 5c.8 1.2.8 2.5 0 3.7s-.8 2.5 0 3.7" />
                </svg>
              </span>
              <span class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                K Chaiyo?
              </span>
            </a>
            <p class="text-sm text-gray-600 leading-relaxed">
              Nepal's upcoming online delivery platform. We're building something special — launching April 2027!
            </p>
            <div class="flex gap-3">
              <a href="#" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors" aria-label="Facebook">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors" aria-label="Instagram">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C8.396 0 7.996.014 6.79.067 5.59.12 4.694.265 3.94.51c-.806.26-1.49.598-2.175 1.282C.598 2.476.26 3.16.01 3.966c-.245.754-.39 1.65-.443 2.85C-.014 7.996 0 8.396 0 12.017s-.014 4.021-.067 5.227c-.053 1.2-.198 2.096-.443 2.85-.26.806-.598 1.49-1.282 2.175-.687.687-1.371 1.025-2.175 1.282-.754.245-1.65.39-2.85.443C3.996 23.986 4.396 24 8.017 24s4.021-.014 5.227-.067c1.2-.053 2.096-.198 2.85-.443.806-.26 1.49-.598 2.175-1.282.687-.687 1.025-1.371 1.282-2.175.245-.754.39-1.65.443-2.85.053-1.206.067-1.606.067-5.227s.014-4.021.067-5.227c.053-1.2.198-2.096.443-2.85.26-.806.598-1.49 1.282-2.175C21.524 1.49 22.208.852 23.012.597c.754-.245 1.65-.39 2.85-.443C20.004.014 19.604 0 16.017 0zM12.017 5.838a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zM18.406 6.25a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors" aria-label="Twitter">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h4>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">Home</a></li>
              <li><a routerLink="/shop" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">Shop</a></li>
              <li><a href="#features" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">Features</a></li>
              <li><a href="#about" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">About</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">Help Center</a></li>
              <li><a href="#" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">FAQs</a></li>
              <li><a href="#" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">Contact Us</a></li>
              <li><a href="#" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">Track Order</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact</h4>
            <ul class="space-y-3">
              <li class="flex flex-col space-y-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                <a href="mailto:namaste@kchaiyo.com" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">namaste&#64;kchaiyo.com</a>
              </li>
              <li class="flex flex-col space-y-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</span>
                <a href="tel:+9771XXXXXXX" class="text-sm text-gray-600 hover:text-purple-600 transition-colors">+977-1-XXXXXXX</a>
              </li>
              <li class="flex flex-col space-y-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</span>
                <span class="text-sm text-gray-600">Thamel, Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-600">&copy; {{ currentYear }} K Chaiyo? All rights reserved.</p>
          <p class="text-sm font-semibold text-purple-600">Launching April 2027</p>
          <p class="text-sm text-gray-600 flex items-center gap-1">
            Made with
            <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
            in Nepal
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ShopFooterComponent {
  currentYear = new Date().getFullYear();
}