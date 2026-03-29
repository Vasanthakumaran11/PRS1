export const categories = [
  {
    id: "electronics",
    name: "Electronics & Technology",
    description: "Smartphones, Laptops, Accessories"
  },
  {
    id: "home",
    name: "Home & Furniture",
    description: "Chairs, Tables, Decor"
  },
  {
    id: "fashion",
    name: "Fashion & Lifestyle",
    description: "Clothing, Footwear, Accessories"
  }
];

export const mockProducts = [
  {
    id: "p1",
    name: "ProPhone 15 Ultra",
    category: "electronics",
    price: 999.00,
    rating: 4.8,
    reviewsCount: 1245,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800",
    thumbnails: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800",
    ],
    description: "The ultimate smartphone experience with a pro-grade camera system and all-day battery life."
  },
  {
    id: "p2",
    name: "Noise-Cancelling Headphones 700",
    category: "electronics",
    price: 349.99,
    rating: 4.5,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    thumbnails: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Premium wireless headphones with industry-leading noise cancellation."
  },
  {
    id: "p3",
    name: "Minimalist Modern Sofa",
    category: "home",
    price: 599.00,
    rating: 4.2,
    reviewsCount: 120,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
    thumbnails: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"
    ],
    description: "A comfortable and stylish sofa that fits perfectly in any modern living room."
  },
  {
    id: "p4",
    name: "Ergonomic Office Chair",
    category: "home",
    price: 199.50,
    rating: 4.7,
    reviewsCount: 450,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800",
    thumbnails: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Designed for comfort during long working hours with lumbar support."
  },
  {
    id: "p5",
    name: "Classic Men's Chronograph",
    category: "fashion",
    price: 150.00,
    rating: 3.9,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
    thumbnails: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"
    ],
    description: "A timeless elegant watch suitable for both formal and casual occasions."
  },
  {
    id: "p6",
    name: "Ultralight Running Shoes",
    category: "fashion",
    price: 120.00,
    rating: 4.6,
    reviewsCount: 880,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    thumbnails: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Breathable, lightweight shoes designed for maximum speed and comfort."
  }
];

export const mockReviews = [
  {
    id: "r1",
    productId: "p1",
    userId: "John Doe",
    rating: 5,
    text: "Absolutely stunning device! The camera is beyond my expectations.",
    timestamp: "2023-10-12T10:00:00Z"
  },
  {
    id: "r2",
    productId: "p1",
    userId: "Sarah Smith",
    rating: 4,
    text: "Great phone, but the battery life could be a little better.",
    timestamp: "2023-11-05T14:30:00Z"
  }
];
