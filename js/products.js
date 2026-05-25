const PRODUCTS = [
  {
    id: "headphones",
    name: "Aurora Pro Wireless Headphones",
    shortDesc: "Studio sound, 40-hour battery, adaptive ANC.",
    description:
      "Experience studio-quality sound with adaptive noise cancellation, 40-hour battery life, and memory-foam cushions designed for all-day comfort.",
    price: 12499,
    oldPrice: 16999,
    badge: "New · Free shipping",

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",

    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    ],

    colors: ["Midnight Black", "Pearl White", "Ocean Blue"],
    category: "Audio",
    rating: 4.8,
    reviewCount: 2340,
  },

  {
    id: "watch",
    name: "Nova Smart Watch",
    shortDesc: "Health tracking, GPS, and 7-day battery.",
    description:
      "Track workouts, heart rate, SpO₂, and sleep with a bright AMOLED display.",

    price: 24999,
    oldPrice: 28999,
    badge: "Bestseller",

    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",

    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    ],

    colors: ["Graphite", "Silver", "Rose Gold"],
    category: "Wearables",
    rating: 4.7,
    reviewCount: 1820,
  },

  {
    id: "fitness-band",
    name: "Pulse Fitness Band",
    shortDesc: "Lightweight tracker with SpO₂ and sleep insights.",

    description:
      "Slim fitness tracker with real-time heart rate and sleep monitoring.",

    price: 6499,
    oldPrice: 7999,
    badge: "Sale",

    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800",

    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800",
    ],

    colors: ["Black", "Teal", "Coral"],
    category: "Wearables",
    rating: 4.6,
    reviewCount: 980,
  },

  {
    id: "speaker",
    name: "Luna Portable Speaker",
    shortDesc: "360° sound, waterproof, 24h playtime.",

    description:
      "Portable Bluetooth speaker with deep bass and waterproof design.",

    price: 7499,
    oldPrice: null,
    badge: "Popular",

    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800",

    images: [
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
    ],

    colors: ["Charcoal", "Sand", "Forest"],
    category: "Audio",
    rating: 4.5,
    reviewCount: 756,
  },

  {
    id: "mouse",
    name: "Eclipse Gaming Mouse",
    shortDesc: "26K DPI sensor, RGB, ultra-light shell.",

    description:
      "Ultra-light gaming mouse with RGB lighting and programmable buttons.",

    price: 4999,
    oldPrice: 6499,

    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",

    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800",
    ],

    colors: ["Black", "White"],
    category: "Gaming",
    rating: 4.4,
    reviewCount: 512,
  },

  {
    id: "usb-hub",
    name: "Stellar USB-C Hub",
    shortDesc: "7-in-1 hub: HDMI, USB 3, SD, 100W PD.",

    description:
      "Premium USB-C hub with HDMI, SD card slots, and power delivery.",

    price: 3799,
    oldPrice: null,
    badge: "Essential",

    image:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800",

    images: [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    ],

    colors: ["Space Gray"],
    category: "Accessories",
    rating: 4.3,
    reviewCount: 340,
  },
];

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function formatMoney(amount) {
  const n = Math.round(Number(amount) || 0);
  return "₹" + n.toLocaleString("en-IN");
}

function renderStars(rating) {
  const full = Math.floor(rating);
  let html = "";

  for (let i = 1; i <= 5; i++) {
    html += i <= full ? "★" : "☆";
  }

  return html;
}