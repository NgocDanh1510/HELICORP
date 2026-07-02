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
    description: "HeliPhone Aurora mang den trai nghiem flagship gon nhe voi man hinh ruc ro, camera AI va thoi luong pin ca ngay.",
    images: [placeholder("HeliPhone Aurora")],
    specs: {
      display: "6.3 inch OLED 120Hz",
      chip: "Heli A1 Neural",
      camera: "48MP Fusion + 12MP Ultra Wide",
      battery: "4,600 mAh, sac nhanh 45W",
      material: "Khung aluminum, mat lung kinh mo"
    },
    colors: ["Ultra Violet", "Glacier Silver", "Midnight Black", "Rose Gold"],
    storageOptions: ["128GB", "256GB", "512GB"],
    category: "heliphone"
  },
  {
    name: "HeliPhone Aurora Pro",
    slug: "heliphone-aurora-pro",
    price: 24990000,
    description: "Aurora Pro nang cap camera tele, chip manh hon va lop vo titanium cho nguoi dung sang tao noi dung moi ngay.",
    images: [placeholder("Aurora Pro")],
    specs: {
      display: "6.5 inch LTPO OLED 1-120Hz",
      chip: "Heli A1 Pro",
      camera: "50MP Fusion + 48MP Ultra Wide + 3x Tele",
      battery: "4,900 mAh, sac nhanh 65W",
      material: "Khung titanium, Ceramic Shield"
    },
    colors: ["Ultra Violet", "Titan Gray", "Pearl White", "Deep Blue"],
    storageOptions: ["256GB", "512GB", "1TB"],
    category: "heliphone"
  },
  {
    name: "HeliPhone Aurora Pro Max",
    slug: "heliphone-aurora-pro-max",
    price: 30990000,
    description: "Aurora Pro Max co man hinh lon, pin ben bi va he camera tot nhat danh cho cong viec lan giai tri.",
    images: [placeholder("Aurora Pro Max")],
    specs: {
      display: "6.9 inch LTPO OLED 1-120Hz",
      chip: "Heli A1 Max",
      camera: "50MP Fusion + 48MP Ultra Wide + 5x Tele",
      battery: "5,400 mAh, sac nhanh 65W",
      material: "Khung titanium, kinh nano-texture"
    },
    colors: ["Ultra Violet", "Titan Black", "Desert Gold", "Arctic Blue"],
    storageOptions: ["256GB", "512GB", "1TB"],
    category: "heliphone"
  }
];

async function seed() {
  await connectDatabase();
  await Product.deleteMany({ slug: { $in: products.map((product) => product.slug) } });
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
