export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  exteriorColor: string;
  description: string;
  images: string[];
  sellerId: string;
  sellerName?: string;
  location?: string;
  daysListed?: number;
  createdAt: string;
  isVerified: boolean;
  performance: {
    power: number;
    acceleration: number;
    topSpeed: number;
  };
  efficiency: {
    combined: number;
    co2: number;
  };
}

export const mockCars: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "911 Carrera S",
    year: 2023,
    price: 145000,
    mileage: 5000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColor: "Shark Blue",
    location: "München",
    sellerName: "AutoHaus Bayern",
    daysListed: 2,
    description: "Immaculate condition Porsche 911 Carrera S. High specification including Sport Chrono and PASM. One owner from new, full Porsche service history.",
    images: [
      "https://picsum.photos/seed/porsche911a/800/500",
      "https://picsum.photos/seed/porsche911b/800/500",
      "https://picsum.photos/seed/porsche911c/800/500"
    ],
    sellerId: "seller1",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 450, acceleration: 3.5, topSpeed: 308 },
    efficiency: { combined: 10.5, co2: 239 }
  },
  {
    id: "2",
    make: "Tesla",
    model: "Model 3 Performance",
    year: 2024,
    price: 58000,
    mileage: 1200,
    fuelType: "Electric",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColor: "Pearl White",
    location: "Berlin",
    sellerName: "EV Motors Berlin",
    daysListed: 5,
    description: "Brand new Model 3 Performance with Highland updates. Full Autopilot, glass roof, ultra-fast charging. Zero emissions, zero compromise.",
    images: [
      "https://picsum.photos/seed/tesla3a/800/500",
      "https://picsum.photos/seed/tesla3b/800/500"
    ],
    sellerId: "seller2",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 510, acceleration: 3.1, topSpeed: 262 },
    efficiency: { combined: 0, co2: 0 }
  },
  {
    id: "3",
    make: "BMW",
    model: "M4 Competition",
    year: 2022,
    price: 89000,
    mileage: 12000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColor: "Isle of Man Green",
    location: "Hamburg",
    sellerName: "Premium Cars Hamburg",
    daysListed: 8,
    description: "The ultimate driving machine. M xDrive, full carbon exterior package, Merino leather. Track-ready, road-approved.",
    images: [
      "https://picsum.photos/seed/bmwm4a/800/500",
      "https://picsum.photos/seed/bmwm4b/800/500"
    ],
    sellerId: "seller3",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 510, acceleration: 3.5, topSpeed: 290 },
    efficiency: { combined: 10.2, co2: 234 }
  },
  {
    id: "4",
    make: "Audi",
    model: "RS e-tron GT",
    year: 2023,
    price: 115000,
    mileage: 8000,
    fuelType: "Electric",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColor: "Tactical Green",
    location: "Stuttgart",
    sellerName: "Audi Zentrum Stuttgart",
    daysListed: 12,
    description: "The future of grand touring. Matrix LED, ceramic brakes, Bang & Olufsen 3D Sound. Tested, verified, and ready to impress.",
    images: [
      "https://picsum.photos/seed/audietron1/800/500",
      "https://picsum.photos/seed/audietron2/800/500"
    ],
    sellerId: "seller4",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 646, acceleration: 3.3, topSpeed: 250 },
    efficiency: { combined: 0, co2: 0 }
  },
  {
    id: "5",
    make: "Mercedes-Benz",
    model: "S 580 4MATIC",
    year: 2022,
    price: 138000,
    mileage: 14000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColor: "Obsidian Black",
    location: "Frankfurt",
    sellerName: "Star Automobile Frankfurt",
    daysListed: 7,
    description: "The pinnacle of luxury motoring. MBUX Hyperscreen, executive rear package, Burmester 4D surround sound, magic body control.",
    images: [
      "https://picsum.photos/seed/mercs580a/800/500",
      "https://picsum.photos/seed/mercs580b/800/500"
    ],
    sellerId: "seller5",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 503, acceleration: 4.3, topSpeed: 250 },
    efficiency: { combined: 11.8, co2: 269 }
  },
  {
    id: "6",
    make: "BMW",
    model: "X5 xDrive50e",
    year: 2023,
    price: 89000,
    mileage: 22000,
    fuelType: "Plug-in Hybrid",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColor: "Phytonic Blue",
    location: "München",
    sellerName: "BMW Niederlassung München",
    daysListed: 3,
    description: "Best of both worlds. 105 km electric range, luxurious interior, impressive performance. Ideal for business and family use.",
    images: [
      "https://picsum.photos/seed/bmwx5a/800/500",
      "https://picsum.photos/seed/bmwx5b/800/500"
    ],
    sellerId: "seller6",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 489, acceleration: 4.6, topSpeed: 250 },
    efficiency: { combined: 1.7, co2: 39 }
  },
  {
    id: "7",
    make: "Mercedes-Benz",
    model: "GLE 350d AMG Line",
    year: 2021,
    price: 71000,
    mileage: 38000,
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColor: "Iridium Silver",
    location: "Düsseldorf",
    sellerName: "Autohaus Kessler",
    daysListed: 14,
    description: "Commanding presence, refined interior. AMG exterior and interior packages. 7-seater configuration, panoramic sunroof.",
    images: [
      "https://picsum.photos/seed/mercgle1/800/500",
      "https://picsum.photos/seed/mercgle2/800/500"
    ],
    sellerId: "seller7",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 272, acceleration: 6.3, topSpeed: 240 },
    efficiency: { combined: 6.9, co2: 181 }
  },
  {
    id: "8",
    make: "Volkswagen",
    model: "Golf GTI Clubsport",
    year: 2023,
    price: 41000,
    mileage: 8500,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "Hatchback",
    exteriorColor: "Tornado Red",
    location: "Köln",
    sellerName: "VW Zentrum Köln",
    daysListed: 1,
    description: "Hot hatch perfection. 300 PS, Nürburgring-tuned suspension, Akrapovic exhaust. The most driver-focused GTI ever made.",
    images: [
      "https://picsum.photos/seed/vwgti1/800/500",
      "https://picsum.photos/seed/vwgti2/800/500"
    ],
    sellerId: "seller8",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 300, acceleration: 5.6, topSpeed: 250 },
    efficiency: { combined: 7.8, co2: 178 }
  },
  {
    id: "9",
    make: "Audi",
    model: "Q5 45 TFSI e",
    year: 2022,
    price: 54000,
    mileage: 27000,
    fuelType: "Plug-in Hybrid",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColor: "Chronos Grey",
    location: "Leipzig",
    sellerName: "Audi Zentrum Leipzig",
    daysListed: 10,
    description: "Premium compact SUV with plug-in hybrid efficiency. Virtual cockpit, B&O sound, quattro all-wheel drive.",
    images: [
      "https://picsum.photos/seed/audiq51/800/500",
      "https://picsum.photos/seed/audiq52/800/500"
    ],
    sellerId: "seller9",
    createdAt: new Date().toISOString(),
    isVerified: false,
    performance: { power: 299, acceleration: 5.3, topSpeed: 237 },
    efficiency: { combined: 1.9, co2: 44 }
  },
  {
    id: "10",
    make: "BMW",
    model: "5 Series 540i",
    year: 2021,
    price: 65000,
    mileage: 21000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColor: "Mineral White",
    location: "Berlin",
    sellerName: "Premium Drive Berlin",
    daysListed: 18,
    description: "The complete executive saloon. xDrive, M Sport package, head-up display, Harman Kardon sound, adaptive suspension.",
    images: [
      "https://picsum.photos/seed/bmw5a/800/500",
      "https://picsum.photos/seed/bmw5b/800/500"
    ],
    sellerId: "seller10",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 340, acceleration: 4.8, topSpeed: 250 },
    efficiency: { combined: 9.1, co2: 208 }
  },
  {
    id: "11",
    make: "Porsche",
    model: "Cayenne GTS",
    year: 2022,
    price: 122000,
    mileage: 9000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColor: "Gentian Blue",
    location: "Hamburg",
    sellerName: "Porsche Zentrum Hamburg",
    daysListed: 4,
    description: "Sports car soul in an SUV body. Active suspension management, sport exhaust, 22-inch RS Spyder wheels, panoramic roof.",
    images: [
      "https://picsum.photos/seed/pcayennea/800/500",
      "https://picsum.photos/seed/pcayenneb/800/500"
    ],
    sellerId: "seller11",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 460, acceleration: 4.5, topSpeed: 272 },
    efficiency: { combined: 12.4, co2: 283 }
  },
  {
    id: "12",
    make: "Mercedes-Benz",
    model: "C 300e AMG Line",
    year: 2023,
    price: 63000,
    mileage: 11000,
    fuelType: "Plug-in Hybrid",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColor: "Spectral Blue",
    location: "Stuttgart",
    sellerName: "Mercedes Niederlassung Stuttgart",
    daysListed: 6,
    description: "New generation C-Class with MBUX and plug-in hybrid drivetrain. AMG Line interior, Burmester sound, 100 km electric range.",
    images: [
      "https://picsum.photos/seed/mercc300a/800/500",
      "https://picsum.photos/seed/mercc300b/800/500"
    ],
    sellerId: "seller12",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 313, acceleration: 5.8, topSpeed: 250 },
    efficiency: { combined: 0.9, co2: 21 }
  },
  {
    id: "13",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2023,
    price: 128000,
    mileage: 3500,
    fuelType: "Electric",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColor: "Midnight Silver",
    location: "Frankfurt",
    sellerName: "Tesla Showroom Frankfurt",
    daysListed: 9,
    description: "Ludicrous performance. Tri-motor AWD, 1020 HP, 0-100 in under 2 seconds. The fastest production car ever built.",
    images: [
      "https://picsum.photos/seed/teslasplaid1/800/500",
      "https://picsum.photos/seed/teslasplaid2/800/500"
    ],
    sellerId: "seller13",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 1020, acceleration: 1.99, topSpeed: 322 },
    efficiency: { combined: 0, co2: 0 }
  },
  {
    id: "14",
    make: "Audi",
    model: "A4 Avant 40 TDI",
    year: 2021,
    price: 37000,
    mileage: 46000,
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "Wagon",
    exteriorColor: "Navarra Blue",
    location: "Hannover",
    sellerName: "Private Seller",
    daysListed: 22,
    description: "Practical estate with premium feel. S Line exterior, virtual cockpit, MMI navigation plus, quattro. Full service history.",
    images: [
      "https://picsum.photos/seed/audia4a/800/500",
      "https://picsum.photos/seed/audia4b/800/500"
    ],
    sellerId: "seller14",
    createdAt: new Date().toISOString(),
    isVerified: false,
    performance: { power: 204, acceleration: 7.3, topSpeed: 237 },
    efficiency: { combined: 5.2, co2: 137 }
  },
  {
    id: "15",
    make: "Volkswagen",
    model: "Tiguan R-Line",
    year: 2022,
    price: 44000,
    mileage: 18000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColor: "Deep Black Pearl",
    location: "Dortmund",
    sellerName: "VW Autohaus Dortmund",
    daysListed: 15,
    description: "Germany's best-selling SUV in premium R-Line trim. TSI engine, 4Motion AWD, panoramic sunroof, ambient lighting.",
    images: [
      "https://picsum.photos/seed/vwtiguan1/800/500",
      "https://picsum.photos/seed/vwtiguan2/800/500"
    ],
    sellerId: "seller15",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 190, acceleration: 7.5, topSpeed: 216 },
    efficiency: { combined: 8.2, co2: 187 }
  },
  {
    id: "16",
    make: "BMW",
    model: "M3 Competition xDrive",
    year: 2022,
    price: 96000,
    mileage: 5500,
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColor: "Sao Paulo Yellow",
    location: "München",
    sellerName: "M Cars München",
    daysListed: 2,
    description: "The benchmark sports saloon. xDrive, carbon bucket seats, track package. Fastest ever M3 and it shows.",
    images: [
      "https://picsum.photos/seed/bmwm3a/800/500",
      "https://picsum.photos/seed/bmwm3b/800/500"
    ],
    sellerId: "seller16",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 510, acceleration: 3.5, topSpeed: 290 },
    efficiency: { combined: 10.5, co2: 239 }
  }
];

export const generatePriceTrend = (basePrice: number) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    price: basePrice * (1 + (Math.random() * 0.1 - 0.05) + (i * -0.01)),
  }));
};
