export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  features: string[];
}

const applyMarkup = (price: number) => Math.round(price * 1.15);

export const PRODUCTS: Product[] = [
  {
    id: "sparta-h6-6k",
    name: "Sparta IP66 H6.6K",
    description: "Born to Endure. Evolved to Protect. High-performance energy storage for extreme environments.",
    originalPrice: 217400, // Demo base price
    price: applyMarkup(217400),
    image: "/assets/products/sparta.jpg",
    category: "Inverters",
    features: ["IP66 Rated", "Long Cycle Life", "Smart BMS"],
  },
  {
    id: "power-go",
    name: "Power Go AIO Portable",
    description: "Itel Energy All-In-One portable power solution for your mobile lifestyle.",
    originalPrice: 65000,
    price: applyMarkup(65000),
    image: "/assets/products/power-go.jpg",
    category: "Power Banks",
    features: ["AIO Design", "Rapid Charging", "Lightweight"],
  },
  {
    id: "power-tank",
    name: "Power Tank Backup",
    description: "Reliable backup power for your essential home and office devices.",
    originalPrice: 125000,
    price: applyMarkup(125000),
    image: "/assets/products/power-tank.jpg",
    category: "Power Banks",
    features: ["High Capacity", "Multiple Outputs", "Emergency LED"],
  },
  {
    id: "itel-aio-plus",
    name: "itel Energy AIO Plus",
    description: "Premium residential energy storage system with integrated modular design.",
    originalPrice: 850000,
    price: applyMarkup(850000),
    image: "/assets/products/aio-plus.jpg",
    category: "Solar Kits",
    features: ["Modular", "Off-grid Compatible", "AI Optimized"],
  },
  {
    id: "star-p6",
    name: "Star P6 Solar Panel",
    description: "High-efficiency PV modules for superior energy harvesting.",
    originalPrice: 48000,
    price: applyMarkup(48000),
    image: "/assets/products/star-p6.jpg",
    category: "Solar Kits",
    features: ["PID Recovery", "High Durability", "Maximum Yield"],
  },
  {
    id: "lithium-pack-5k",
    name: "LiFePO4 Battery Pack 5K",
    description: "Safe and long-lasting lithium battery storage for essential backup.",
    originalPrice: 550000,
    price: applyMarkup(550000),
    image: "/assets/products/lithium-pack.jpg",
    category: "Inverters",
    features: ["LiFePO4 Safety", "Smart BMS", "High Efficiency"],
  },
];

export const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
