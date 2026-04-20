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
  createdAt: string;
  isVerified: boolean;
  performance: {
    power: number; // HP
    acceleration: number; // 0-100 km/h
    topSpeed: number;
  };
  efficiency: {
    combined: number; // L/100km
    co2: number; // g/km
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
    description: "Immaculate condition Porsche 911 Carrera S. High specification including Sport Chrono and PASM.",
    images: [
      "https://picsum.photos/seed/porsche1/800/600",
      "https://picsum.photos/seed/porsche2/800/600",
      "https://picsum.photos/seed/porsche3/800/600"
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
    description: "Brand new Model 3 Performance with Highland updates. Ultra-fast, zero emissions.",
    images: [
      "https://picsum.photos/seed/tesla1/800/600",
      "https://picsum.photos/seed/tesla2/800/600"
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
    description: "Ultimate driving machine. M xDrive, full carbon package.",
    images: [
      "https://picsum.photos/seed/bmw1/800/600",
      "https://picsum.photos/seed/bmw2/800/600"
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
    description: "The future of grand touring. Matrix LED, ceramic brakes.",
    images: [
      "https://picsum.photos/seed/audi1/800/600",
      "https://picsum.photos/seed/audi2/800/600"
    ],
    sellerId: "seller4",
    createdAt: new Date().toISOString(),
    isVerified: true,
    performance: { power: 646, acceleration: 3.3, topSpeed: 250 },
    efficiency: { combined: 0, co2: 0 }
  }
];

export const generatePriceTrend = (basePrice: number) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    price: basePrice * (1 + (Math.random() * 0.1 - 0.05) + (i * -0.01)),
  }));
};
