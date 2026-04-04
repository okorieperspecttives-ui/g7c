export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string; // Added for brand-neutrality
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  features: string[];
  specifications: Specification[]; // Enhanced specs
  isBestSeller?: boolean;
  capacity?: string; // Added for filtering (e.g. "6.6kVA", "500Wh")
}

const applyMarkup = (price: number) => Math.round(price * 1.15);

export const PRODUCTS: Product[] = [
  {
    id: "sparta-h6-6k",
    name: "Sparta IP66 H6.6K Energy System",
    brand: "itel Energy",
    description: "Born to Endure. Evolved to Protect. A high-performance all-in-one energy storage solution for residential and small business use.",
    originalPrice: 217400,
    price: applyMarkup(217400),
    image: "/assets/products/sparta.jpg",
    category: "Inverters",
    isBestSeller: true,
    capacity: "5-10kVA",
    features: ["IP66 Rated Protection", "Integrated Modular Design", "Smart EMS Control"],
    specifications: [
      { label: "Rated Power", value: "6.6kW" },
      { label: "IP Rating", value: "IP66" },
      { label: "Battery Chemistry", value: "LiFePO4" },
      { label: "Warranty", value: "5 Years" },
    ],
  },
  {
    id: "power-go-aio",
    name: "Power Go Portable Power Station",
    brand: "itel Energy",
    description: "Compact and reliable all-in-one portable power solution. Perfect for camping, mobile office, or home backup during short outages.",
    originalPrice: 85000,
    price: applyMarkup(85000),
    image: "/assets/products/power-go.jpg",
    category: "Portable Power Stations",
    capacity: "< 1kVA",
    features: ["AIO Design", "Rapid Charging", "Lightweight & Compact"],
    specifications: [
      { label: "Capacity", value: "500Wh" },
      { label: "Outlets", value: "2x AC, 3x USB, 1x Type-C" },
      { label: "Weight", value: "5.5kg" },
    ],
  },
  {
    id: "power-tank-backup",
    name: "Power Tank Essential Backup",
    brand: "itel Energy",
    description: "Essential backup power for home devices. High capacity with multiple output ports for reliable energy storage.",
    originalPrice: 125000,
    price: applyMarkup(125000),
    image: "/assets/products/power-tank.jpg",
    category: "Batteries & Energy Storage",
    isBestSeller: true,
    capacity: "1-3kVA",
    features: ["High Capacity Cells", "Intelligent BMS", "Emergency LED Lighting"],
    specifications: [
      { label: "Capacity", value: "1200Wh" },
      { label: "Cycle Life", value: "3000+ Cycles" },
      { label: "Max Discharge", value: "100A" },
    ],
  },
  {
    id: "solar-panel-p6",
    name: "High-Efficiency Solar Panel Star P6",
    brand: "itel Energy",
    description: "Premium PV modules designed for higher performance and long-term durability. Includes integrated PID recovery technology.",
    originalPrice: 48000,
    price: applyMarkup(48000),
    image: "/assets/products/star-p6.jpg",
    category: "Solar Panels & Kits",
    features: ["PID Recovery Technology", "Anti-Reflective Coating", "High Efficiency Cells"],
    specifications: [
      { label: "Max Power", value: "450W" },
      { label: "Efficiency", value: "20.5%" },
      { label: "Cell Type", value: "Monocrystalline" },
    ],
  },
  {
    id: "aio-plus-storage",
    name: "Residential Energy Storage AIO Plus",
    brand: "itel Energy",
    description: "Advanced one-stop energy storage solution. Integrated design for seamless grid-on and grid-off performance.",
    originalPrice: 850000,
    price: applyMarkup(850000),
    image: "/assets/products/aio-plus.jpg",
    category: "All-in-One Systems",
    features: ["Scalable Modular Design", "EMS Driven Connection", "AI Optimized Cycle Life"],
    specifications: [
      { label: "System Voltage", value: "48V" },
      { label: "Inverter Type", value: "Hybrid" },
      { label: "Scalability", value: "Up to 15 Units" },
    ],
  },
  {
    id: "lifepo4-pack-5k",
    name: "Safety-First LiFePO4 Battery Pack",
    brand: "itel Energy",
    description: "Superior battery chemistry ensuring safety and long lifespan. High efficiency and high power density for demanding applications.",
    originalPrice: 550000,
    price: applyMarkup(550000),
    image: "/assets/products/lithium-pack.jpg",
    category: "Batteries & Energy Storage",
    features: ["Multi-layer Safety Protection", "Intelligent BMS", "Wide Temperature Range"],
    specifications: [
      { label: "Nominal Capacity", value: "5.12kWh" },
      { label: "BMS", value: "Integrated Smart BMS" },
      { label: "Temperature", value: "-20°C to 60°C" },
    ],
  },
];

export const CATEGORIES = [
  { name: "Inverters", tagline: "Reliable power conversion", icon: "Zap" },
  { name: "Batteries & Energy Storage", tagline: "Safe & long-lasting backup", icon: "Battery" },
  { name: "All-in-One Systems", tagline: "Complete integrated power", icon: "Box" },
  { name: "Portable Power Stations", tagline: "Power for life on the go", icon: "Plug" },
  { name: "Solar Panels & Kits", tagline: "Harness clean solar energy", icon: "Sun" },
  { name: "Accessories & Components", tagline: "Essential system parts", icon: "Settings" },
];

export const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
