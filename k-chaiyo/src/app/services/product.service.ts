import { Injectable, computed, signal } from '@angular/core';
import { Product, ShopCategory } from '../shared/models/product.model';

/**
 * In-memory product catalog for the shop page.
 * Replace with an HTTP-backed implementation when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly activeCategoryId = signal<string>('dairy-breakfast');

  readonly categories: ReadonlyArray<ShopCategory> = [
    { id: 'dairy-breakfast', name: 'Dairy & Breakfast', icon: 'fas fa-mug-hot' },
    { id: 'snacks', name: 'Snacks & Munchies', icon: 'fas fa-cookie-bite' },
    { id: 'beverages', name: 'Cold Drinks & Juices', icon: 'fas fa-wine-bottle' },
    { id: 'instant', name: 'Instant & Frozen Food', icon: 'fas fa-utensils' },
    { id: 'tea-coffee', name: 'Tea, Coffee & Health', icon: 'fas fa-coffee' },
    { id: 'bakery', name: 'Bakery & Biscuits', icon: 'fas fa-bread-slice' },
    { id: 'sweet-tooth', name: 'Sweet Tooth', icon: 'fas fa-candy-cane' },
    { id: 'atta', name: 'Atta, Rice & Dal', icon: 'fas fa-wheat-awn' },
    { id: 'masala', name: 'Masala, Oil & More', icon: 'fas fa-pepper-hot' },
    { id: 'sauces', name: 'Sauces & Spreads', icon: 'fas fa-jar' },
    { id: 'chicken', name: 'Chicken, Meat & Fish', icon: 'fas fa-drumstick-bite' },
    { id: 'paan', name: 'Paan Corner', icon: 'fas fa-leaf' }
  ];

  private readonly catalog: Product[] = [
    // Dairy & Breakfast
    { id: 'd1', name: 'DDC Full Cream Milk', size: '500 ml', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format', mrp: 95, price: 90, discountPercent: 5, categoryId: 'dairy-breakfast' },
    { id: 'd2', name: 'DDC Cow Milk', size: '500 ml', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format', mrp: 85, price: 80, discountPercent: 6, categoryId: 'dairy-breakfast' },
    { id: 'd3', name: 'Sitaram Pasteurized Cow Milk', size: '500 ml', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&auto=format', mrp: 90, price: 82, discountPercent: 9, categoryId: 'dairy-breakfast' },
    { id: 'd4', name: 'Sujal Dairy Shikhar Milk', size: '1 L', imageUrl: 'https://images.unsplash.com/photo-1597306498413-078e59e4e4b4?w=400&auto=format', mrp: 175, price: 165, discountPercent: 6, categoryId: 'dairy-breakfast' },
    { id: 'd5', name: 'Sujal Dairy Gold Milk', size: '1 L', imageUrl: 'https://images.unsplash.com/photo-1517448931170-2d85a22f0cfb?w=400&auto=format', mrp: 180, price: 170, discountPercent: 6, categoryId: 'dairy-breakfast' },
    { id: 'd6', name: 'Nepal Dairy Fresh Milk', size: '500 ml', imageUrl: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&auto=format', mrp: 95, price: 88, discountPercent: 7, categoryId: 'dairy-breakfast' },
    { id: 'd7', name: 'Tasza Toned Milk', size: '1 L', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format', mrp: 170, price: 160, discountPercent: 6, categoryId: 'dairy-breakfast' },
    { id: 'd8', name: 'Amul Slim & Trim Milk', size: '1 L', imageUrl: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&auto=format', mrp: 190, price: 178, discountPercent: 6, categoryId: 'dairy-breakfast' },
    { id: 'd9', name: 'Chitwan Farm Fresh Dahi', size: '400 g', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format', mrp: 110, price: 99, discountPercent: 10, categoryId: 'dairy-breakfast' },
    { id: 'd10', name: 'Amul Butter Pack', size: '100 g', imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format', mrp: 60, price: 55, discountPercent: 8, categoryId: 'dairy-breakfast' },
    { id: 'd11', name: 'Nepal Dairy Paneer', size: '200 g', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format', mrp: 180, price: 160, discountPercent: 11, categoryId: 'dairy-breakfast' },
    { id: 'd12', name: 'Farm Fresh Eggs (Brown)', size: '6 pcs', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format', mrp: 120, price: 99, discountPercent: 18, categoryId: 'dairy-breakfast' },

    // Snacks
    { id: 's1', name: 'Lays Classic Salted Chips', size: '52 g', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format', mrp: 30, price: 25, discountPercent: 17, categoryId: 'snacks' },
    { id: 's2', name: 'Kurkure Masala Munch', size: '85 g', imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&auto=format', mrp: 30, price: 27, discountPercent: 10, categoryId: 'snacks' },
    { id: 's3', name: 'Haldiram Bhujia Sev', size: '200 g', imageUrl: 'https://images.unsplash.com/photo-1599629954294-14df9ec8bc3b?w=400&auto=format', mrp: 80, price: 68, discountPercent: 15, categoryId: 'snacks' },
    { id: 's4', name: 'Wai Wai Noodles (Chicken)', size: '75 g', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format', mrp: 25, price: 22, discountPercent: 12, categoryId: 'snacks' },
    { id: 's5', name: 'Doritos Nacho Cheese', size: '90 g', imageUrl: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&auto=format', mrp: 60, price: 49, discountPercent: 18, categoryId: 'snacks' },
    { id: 's6', name: 'Pringles Sour Cream', size: '107 g', imageUrl: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400&auto=format', mrp: 180, price: 149, discountPercent: 17, categoryId: 'snacks' },
    { id: 's7', name: 'Mixture Namkeen', size: '250 g', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format', mrp: 90, price: 75, discountPercent: 17, categoryId: 'snacks' },
    { id: 's8', name: 'Popcorn Butter Salt', size: '70 g', imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format', mrp: 50, price: 42, discountPercent: 16, categoryId: 'snacks' },

    // Beverages
    { id: 'b1', name: 'Coca-Cola Can', size: '330 ml', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&auto=format', mrp: 60, price: 50, discountPercent: 17, categoryId: 'beverages' },
    { id: 'b2', name: 'Pepsi Bottle', size: '750 ml', imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&auto=format', mrp: 85, price: 70, discountPercent: 18, categoryId: 'beverages' },
    { id: 'b3', name: 'Real Mixed Fruit Juice', size: '1 L', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049e6e0f79b?w=400&auto=format', mrp: 150, price: 125, discountPercent: 17, categoryId: 'beverages' },
    { id: 'b4', name: 'Red Bull Energy Drink', size: '250 ml', imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&auto=format', mrp: 180, price: 159, discountPercent: 12, categoryId: 'beverages' },
    { id: 'b5', name: 'Frooti Mango Drink', size: '600 ml', imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format', mrp: 50, price: 40, discountPercent: 20, categoryId: 'beverages' },
    { id: 'b6', name: 'Tropicana Orange Juice', size: '1 L', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049e6e0f79b?w=400&auto=format', mrp: 160, price: 139, discountPercent: 13, categoryId: 'beverages' },
    { id: 'b7', name: 'Mountain Dew', size: '750 ml', imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format', mrp: 85, price: 72, discountPercent: 15, categoryId: 'beverages' },
    { id: 'b8', name: 'Lassi Bottle Sweet', size: '500 ml', imageUrl: 'https://images.unsplash.com/photo-1626201850129-a96fdd0c82b1?w=400&auto=format', mrp: 80, price: 65, discountPercent: 19, categoryId: 'beverages' },

    // Instant & Frozen
    { id: 'i1', name: 'Maggi 2-Minute Noodles', size: '70 g', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format', mrp: 20, price: 16, discountPercent: 20, categoryId: 'instant' },
    { id: 'i2', name: 'Yippee Magic Masala', size: '60 g', imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&auto=format', mrp: 20, price: 17, discountPercent: 15, categoryId: 'instant' },
    { id: 'i3', name: 'Frozen Veg Momos', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&auto=format', mrp: 250, price: 199, discountPercent: 20, categoryId: 'instant' },
    { id: 'i4', name: 'Frozen Chicken Nuggets', size: '400 g', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&auto=format', mrp: 320, price: 279, discountPercent: 13, categoryId: 'instant' },
    { id: 'i5', name: 'Ready-to-eat Palak Paneer', size: '300 g', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format', mrp: 180, price: 149, discountPercent: 17, categoryId: 'instant' },
    { id: 'i6', name: 'Frozen Green Peas', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format', mrp: 150, price: 119, discountPercent: 21, categoryId: 'instant' },

    // Tea / Coffee
    { id: 't1', name: 'Tokla Nepali Black Tea', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1597318281675-8fa27cfc1c3f?w=400&auto=format', mrp: 320, price: 275, discountPercent: 14, categoryId: 'tea-coffee' },
    { id: 't2', name: 'Nescafe Classic Coffee', size: '100 g', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format', mrp: 380, price: 329, discountPercent: 13, categoryId: 'tea-coffee' },
    { id: 't3', name: 'Bournvita Chocolate Drink', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format', mrp: 340, price: 289, discountPercent: 15, categoryId: 'tea-coffee' },
    { id: 't4', name: 'Horlicks Classic Malt', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1559525839-d9acfd4ed4f8?w=400&auto=format', mrp: 380, price: 319, discountPercent: 16, categoryId: 'tea-coffee' },
    { id: 't5', name: 'Green Tea Bags (25 pc)', size: '37.5 g', imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&auto=format', mrp: 220, price: 179, discountPercent: 19, categoryId: 'tea-coffee' },
    { id: 't6', name: 'Davidoff Rich Aroma', size: '100 g', imageUrl: 'https://images.unsplash.com/photo-1509785289313-3c3d3f4c97f8?w=400&auto=format', mrp: 1100, price: 945, discountPercent: 14, categoryId: 'tea-coffee' },

    // Bakery
    { id: 'bk1', name: 'Britannia Whole Wheat Bread', size: '400 g', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format', mrp: 70, price: 58, discountPercent: 17, categoryId: 'bakery' },
    { id: 'bk2', name: 'Parle-G Original Biscuits', size: '250 g', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format', mrp: 40, price: 33, discountPercent: 18, categoryId: 'bakery' },
    { id: 'bk3', name: 'Oreo Cream Biscuits', size: '120 g', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format', mrp: 50, price: 42, discountPercent: 16, categoryId: 'bakery' },
    { id: 'bk4', name: 'Croissant Butter', size: '2 pcs', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format', mrp: 180, price: 149, discountPercent: 17, categoryId: 'bakery' },
    { id: 'bk5', name: 'Hide & Seek Chocolate', size: '200 g', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format', mrp: 60, price: 49, discountPercent: 18, categoryId: 'bakery' },
    { id: 'bk6', name: 'Good Day Cashew', size: '150 g', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format', mrp: 45, price: 38, discountPercent: 16, categoryId: 'bakery' },

    // Sweet Tooth
    { id: 'sw1', name: 'Dairy Milk Silk', size: '150 g', imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&auto=format', mrp: 220, price: 185, discountPercent: 16, categoryId: 'sweet-tooth' },
    { id: 'sw2', name: 'KitKat 4-Finger', size: '37 g', imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&auto=format', mrp: 60, price: 49, discountPercent: 18, categoryId: 'sweet-tooth' },
    { id: 'sw3', name: 'Ferrero Rocher (16 pc)', size: '200 g', imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&auto=format', mrp: 890, price: 729, discountPercent: 18, categoryId: 'sweet-tooth' },
    { id: 'sw4', name: 'Haldiram Rasgulla Tin', size: '1 kg', imageUrl: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&auto=format', mrp: 320, price: 269, discountPercent: 16, categoryId: 'sweet-tooth' },

    // Atta / Rice / Dal
    { id: 'a1', name: 'Aashirvaad Shudh Chakki Atta', size: '5 kg', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format', mrp: 420, price: 359, discountPercent: 15, categoryId: 'atta' },
    { id: 'a2', name: 'India Gate Basmati Rice', size: '5 kg', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format', mrp: 950, price: 799, discountPercent: 16, categoryId: 'atta' },
    { id: 'a3', name: 'Tata Toor Dal', size: '1 kg', imageUrl: 'https://images.unsplash.com/photo-1599908760826-5e4b0abd8e49?w=400&auto=format', mrp: 180, price: 149, discountPercent: 17, categoryId: 'atta' },
    { id: 'a4', name: 'Masoor Dal Premium', size: '1 kg', imageUrl: 'https://images.unsplash.com/photo-1599908760826-5e4b0abd8e49?w=400&auto=format', mrp: 175, price: 139, discountPercent: 21, categoryId: 'atta' },

    // Masala / Oil
    { id: 'm1', name: 'Fortune Sunflower Oil', size: '1 L', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format', mrp: 220, price: 189, discountPercent: 14, categoryId: 'masala' },
    { id: 'm2', name: 'MDH Garam Masala', size: '100 g', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format', mrp: 80, price: 65, discountPercent: 19, categoryId: 'masala' },
    { id: 'm3', name: 'Everest Chilli Powder', size: '200 g', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format', mrp: 120, price: 99, discountPercent: 18, categoryId: 'masala' },
    { id: 'm4', name: 'Tata Salt Iodised', size: '1 kg', imageUrl: 'https://images.unsplash.com/photo-1519414442781-fbd745c5b497?w=400&auto=format', mrp: 30, price: 25, discountPercent: 17, categoryId: 'masala' },

    // Sauces
    { id: 'sa1', name: 'Kissan Tomato Ketchup', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&auto=format', mrp: 140, price: 115, discountPercent: 18, categoryId: 'sauces' },
    { id: 'sa2', name: "Veeba Chilli Garlic", size: '310 g', imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&auto=format', mrp: 180, price: 149, discountPercent: 17, categoryId: 'sauces' },
    { id: 'sa3', name: 'Kissan Mixed Fruit Jam', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1619120235253-8d00b9143b9f?w=400&auto=format', mrp: 180, price: 155, discountPercent: 14, categoryId: 'sauces' },
    { id: 'sa4', name: 'Peanut Butter Crunchy', size: '350 g', imageUrl: 'https://images.unsplash.com/photo-1569940904057-3dc30d7a9f3d?w=400&auto=format', mrp: 260, price: 219, discountPercent: 16, categoryId: 'sauces' },

    // Chicken / Meat / Fish
    { id: 'c1', name: 'Fresh Chicken Breast', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&auto=format', mrp: 360, price: 299, discountPercent: 17, categoryId: 'chicken' },
    { id: 'c2', name: 'Fresh Chicken Whole', size: '1 kg', imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&auto=format', mrp: 520, price: 449, discountPercent: 14, categoryId: 'chicken' },
    { id: 'c3', name: 'Fresh Mutton Curry Cut', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&auto=format', mrp: 720, price: 649, discountPercent: 10, categoryId: 'chicken' },
    { id: 'c4', name: 'Fresh Rohu Fish', size: '500 g', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format', mrp: 340, price: 279, discountPercent: 18, categoryId: 'chicken' },

    // Paan
    { id: 'pa1', name: 'Rajnigandha Paan Masala', size: '20 g', imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&auto=format', mrp: 60, price: 49, discountPercent: 18, categoryId: 'paan' },
    { id: 'pa2', name: 'Chutki Supari', size: '50 g', imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&auto=format', mrp: 40, price: 32, discountPercent: 20, categoryId: 'paan' },
    { id: 'pa3', name: 'Pass Pass Chatpata', size: '20 g', imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&auto=format', mrp: 25, price: 20, discountPercent: 20, categoryId: 'paan' }
  ];

  getActiveCategoryId() {
    return this.activeCategoryId.asReadonly();
  }

  setActiveCategory(id: string): void {
    this.activeCategoryId.set(id);
  }

  readonly activeCategory = computed(() =>
    this.categories.find(c => c.id === this.activeCategoryId()) ?? this.categories[0]
  );

  readonly productsForActiveCategory = computed(() =>
    this.catalog.filter(p => p.categoryId === this.activeCategoryId())
  );

  findById(id: string): Product | undefined {
    return this.catalog.find(p => p.id === id);
  }
}
