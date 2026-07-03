import "dotenv/config";
import { connectDatabase } from "./config/db";
import { Product } from "./models/Product";

const placeholder = (name: string) =>
  `https://placehold.co/1200x900/111827/ffffff.png?text=${encodeURIComponent(name)}`;

const products = [
  {
    name: "HeliPhone Aurora",
    slug: "heliphone-aurora",
    price: 18990000,
    description: "HeliPhone Aurora mang đến trải nghiệm flagship gọn nhẹ với màn hình rực rỡ, camera AI và thời lượng pin cả ngày.",
    images: ["/images/products/heliphone-aurora.png"],
    specs: {
      display: "6.3 inch OLED 120Hz",
      chip: "Heli A1 Neural",
      camera: "48MP Fusion + 12MP Ultra Wide",
      battery: "4,600 mAh, sạc nhanh 45W",
      material: "Khung aluminum, mặt lưng kính mờ"
    },
    colors: ["Ultra Violet", "Glacier Silver", "Midnight Black", "Rose Gold"],
    storageOptions: ["128GB", "256GB", "512GB"],
    category: "Flagship",
    brand: "HeliCorp"
  },
  {
    name: "HeliPhone Aurora Pro",
    slug: "heliphone-aurora-pro",
    price: 24990000,
    description: "Aurora Pro nâng cấp camera tele, chip mạnh hơn và lớp vỏ titanium cho người dùng sáng tạo nội dung mỗi ngày.",
    images: ["/images/products/heliphone-aurora-pro.png"],
    specs: {
      display: "6.5 inch LTPO OLED 1-120Hz",
      chip: "Heli A1 Pro",
      camera: "50MP Fusion + 48MP Ultra Wide + 3x Tele",
      battery: "4,900 mAh, sạc nhanh 65W",
      material: "Khung titanium, Ceramic Shield"
    },
    colors: ["Ultra Violet", "Titan Gray", "Pearl White", "Deep Blue"],
    storageOptions: ["256GB", "512GB", "1TB"],
    category: "Flagship",
    brand: "HeliCorp"
  },
  {
    name: "HeliPhone Aurora Pro Max",
    slug: "heliphone-aurora-pro-max",
    price: 30990000,
    description: "Aurora Pro Max có màn hình lớn, pin bền bỉ và hệ camera tốt nhất dành cho công việc lẫn giải trí.",
    images: ["/images/products/heliphone-aurora-pro-max.png"],
    specs: {
      display: "6.9 inch LTPO OLED 1-120Hz",
      chip: "Heli A1 Max",
      camera: "50MP Fusion + 48MP Ultra Wide + 5x Tele",
      battery: "5,400 mAh, sạc nhanh 65W",
      material: "Khung titanium, kính nano-texture"
    },
    colors: ["Ultra Violet", "Titan Black", "Desert Gold", "Arctic Blue"],
    storageOptions: ["256GB", "512GB", "1TB"],
    category: "Flagship",
    brand: "HeliCorp"
  },
  {
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    price: 28990000,
    description: "iPhone 16 Pro thiết kế titanium cực bền, nút Camera Control đột phá và chip A18 Pro mạnh mẽ vượt trội.",
    images: ["/images/products/iphone-16-pro.png"],
    specs: {
      display: "6.3 inch Super Retina XDR OLED",
      chip: "Apple A18 Pro",
      camera: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Tele",
      battery: "3,582 mAh, sạc nhanh 25W MagSafe",
      material: "Khung titanium sấy cát"
    },
    colors: ["Desert Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    category: "Flagship",
    brand: "Apple"
  },
  {
    name: "iPhone 16",
    slug: "iphone-16",
    price: 21990000,
    description: "iPhone 16 với nút Camera Control mới, chip A18 cực nhanh và thiết kế màu sắc cá tính ấn tượng.",
    images: ["/images/products/iphone-16.png"],
    specs: {
      display: "6.1 inch Super Retina XDR OLED",
      chip: "Apple A18",
      camera: "48MP Fusion + 12MP Ultra Wide",
      battery: "3,561 mAh, sạc nhanh 20W",
      material: "Khung nhôm hàng không"
    },
    colors: ["Ultramarine", "Teal", "Pink", "White", "Black"],
    storageOptions: ["128GB", "256GB", "512GB"],
    category: "High-end",
    brand: "Apple"
  },
  {
    name: "Galaxy S25 Ultra",
    slug: "galaxy-s25-ultra",
    price: 32990000,
    description: "Galaxy S25 Ultra dẫn đầu công nghệ với camera 200MP zoom siêu phân giải, bút S Pen và tính năng Galaxy AI tiên tiến.",
    images: ["/images/products/galaxy-s25-ultra.png"],
    specs: {
      display: "6.8 inch Dynamic AMOLED 2X 120Hz",
      chip: "Snapdragon 8 Elite",
      camera: "200MP + 50MP + 12MP + 10MP Quad Camera",
      battery: "5,000 mAh, sạc nhanh 45W",
      material: "Khung titanium cường lực"
    },
    colors: ["Titanium Gray", "Titanium Black", "Titanium Silver", "Titanium Blue"],
    storageOptions: ["256GB", "512GB", "1TB"],
    category: "Flagship",
    brand: "Samsung"
  },
  {
    name: "Galaxy A55 5G",
    slug: "galaxy-a55-5g",
    price: 9990000,
    description: "Galaxy A55 mang đến thiết kế cao cấp, camera chống rung OIS và hiệu năng vượt trội trong phân khúc tầm trung.",
    images: ["/images/products/galaxy-a55-5g.png"],
    specs: {
      display: "6.6 inch Super AMOLED 120Hz",
      chip: "Exynos 1480",
      camera: "50MP Main + 12MP Ultra Wide + 5x Macro",
      battery: "5,000 mAh, sạc nhanh 25W",
      material: "Khung nhôm, mặt sau kính Gorilla Glass"
    },
    colors: ["Iceblue", "Lilac", "Lemon", "Navy"],
    storageOptions: ["128GB", "256GB"],
    category: "Mid-range",
    brand: "Samsung"
  },
  {
    name: "Xiaomi 15 Pro",
    slug: "xiaomi-15-pro",
    price: 23490000,
    description: "Xiaomi 15 Pro kết hợp màn hình cong bốn cạnh siêu đẹp, ống kính Leica Summilux cao cấp và chip Snapdragon thế hệ mới.",
    images: ["/images/products/xiaomi-15-pro.png"],
    specs: {
      display: "6.73 inch AMOLED 120Hz 2K",
      chip: "Snapdragon 8 Elite",
      camera: "50MP Leica Main + 50MP Tele + 50MP Ultra Wide",
      battery: "6,100 mAh, sạc nhanh 90W",
      material: "Khung hợp kim nhôm, mặt kính Xiaomi Shield"
    },
    colors: ["Rock Gray", "Spruce Green", "White", "Silver"],
    storageOptions: ["256GB", "512GB", "1TB"],
    category: "Flagship",
    brand: "Xiaomi"
  },
  {
    name: "Redmi Note 13 Pro 5G",
    slug: "redmi-note-13-pro-5g",
    price: 7290000,
    description: "Redmi Note 13 Pro sở hữu màn hình AMOLED 1.5K cực nét, camera 200MP siêu khủng và sạc siêu nhanh 67W.",
    images: ["/images/products/redmi-note-13-pro-5g.png"],
    specs: {
      display: "6.67 inch AMOLED 1.5K 120Hz",
      chip: "Snapdragon 7s Gen 2",
      camera: "200MP Main + 8MP Ultra Wide + 2MP Macro",
      battery: "5,100 mAh, sạc nhanh 67W",
      material: "Mặt sau kính Gorilla Glass"
    },
    colors: ["Midnight Black", "Ocean Teal", "Aurora Purple"],
    storageOptions: ["128GB", "256GB"],
    category: "Mid-range",
    brand: "Xiaomi"
  }
];

async function seed() {
  await connectDatabase();
  // Clear existing products to ensure fresh start
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
