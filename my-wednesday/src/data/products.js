export const products = [
  {
    id: 1,
    name: 'Midnight Runner',
    price: 189000,
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    description: 'Sneakers premium dengan desain minimalis untuk aktivitas sehari-hari.',
  },
  {
    id: 2,
    name: 'Urban Edge Jacket',
    price: 599000,
    category: 'outerwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    description: 'Jaket urban dengan material berkualitas dan potongan modern.',
  },
  {
    id: 3,
    name: 'Shadow Watch',
    price: 349000,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    description: 'Jam tangan elegan dengan dial minimalis dan tali kulit.',
  },
  {
    id: 4,
    name: 'Essence Bag',
    price: 459000,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d1281b?w=400&h=400&fit=crop',
    description: 'Tas premium dengan desain timeless dan kapasitas optimal.',
  },
  {
    id: 5,
    name: 'Flow Tee',
    price: 129000,
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1521572163471-6300b297ffab?w=400&h=400&fit=crop',
    description: 'Kaos basic dengan bahan breathable dan fit relaxed.',
  },
  {
    id: 6,
    name: 'Noir Sunglasses',
    price: 279000,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    description: 'Kacamata hitam dengan lensa UV protection dan frame ringan.',
  },
]

export const getProductById = (id) => products.find((p) => p.id === Number(id))
export const getProductsByCategory = (cat) =>
  cat ? products.filter((p) => p.category === cat) : products
