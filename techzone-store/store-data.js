// Single source of truth: used by the website AND the chatbot's system prompt.
// Students: edit products/policies here and both update automatically.
module.exports = {
  storeName: "TechZone",
  laptops: [
    { name: "HP 15", price: 85000, specs: "Intel Core i5, 8GB RAM, 512GB SSD, 15.6\" FHD", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=70" },
    { name: "Dell Inspiron 15", price: 95000, specs: "Intel Core i5, 16GB RAM, 512GB SSD, 15.6\" FHD", img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=70" },
    { name: "Lenovo IdeaPad 3", price: 78000, specs: "AMD Ryzen 5, 8GB RAM, 256GB SSD, 15.6\" FHD", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=70" },
    { name: "ASUS VivoBook", price: 105000, specs: "Intel Core i7, 16GB RAM, 512GB SSD, 15.6\" FHD", img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=70" },
    { name: "MacBook Air", price: 225000, specs: "Apple M-series chip, 8GB RAM, 256GB SSD, Retina display", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=70" }
  ],
  phones: [
    { name: "Samsung Galaxy A15", price: 55000, specs: "6.5\" AMOLED, 128GB, 50MP camera, 5000mAh", img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=70" },
    { name: "Xiaomi Redmi Note 13", price: 52000, specs: "6.67\" AMOLED, 128GB, 108MP camera, 5000mAh", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=70" },
    { name: "OPPO A60", price: 58000, specs: "6.67\" display, 128GB, 50MP camera, 5000mAh", img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=70" },
    { name: "Vivo Y28", price: 62000, specs: "6.56\" display, 128GB, 50MP camera, 5000mAh", img: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=70" },
    { name: "iPhone 13", price: 185000, specs: "6.1\" OLED, 128GB, dual 12MP cameras, A15 Bionic", img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=70" }
  ],
  accessories: [
    { name: "Chargers", from: 2000 },
    { name: "Headphones", from: 3500 },
    { name: "Power Banks", from: 4000 },
    { name: "Laptop Bags", from: 2500 }
  ],
  // SAMPLE policies - replace with your real ones.
  policies: {
    warranty: "1-year store warranty on laptops and phones; 6 months on accessories.",
    delivery: "Nationwide delivery in 2-4 working days. Cash on delivery available.",
    returns: "7-day return/exchange for unused items in original packaging, or for manufacturing defects.",
    hours: "Mon-Sat, 10:00 AM to 9:00 PM"
  }
};
