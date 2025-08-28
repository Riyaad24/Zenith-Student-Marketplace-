// TypeScript types for Azure/MySQL/Prisma backend

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  condition: "new" | "used" | "refurbished"
  status: "active" | "sold" | "inactive"
  categoryId: string
  sellerId: string
  createdAt: string
  updatedAt: string

  // Relations
  category?: Category
  seller?: User
  reviews?: Review[]
}

export interface CartItem {
  id: string
  quantity: number
  userId: string
  productId: string
  createdAt: string
  updatedAt: string

  // Relations
  product?: Product
}

export interface Order {
  id: string
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  shippingCost: number
  tax: number
  userId: string
  addressId?: string
  createdAt: string
  updatedAt: string

  // Relations
  orderItems?: OrderItem[]
  address?: Address
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  productId: string

  // Relations
  product?: Product
}

export interface Address {
  id: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  rating: number
  comment?: string
  userId: string
  productId: string
  createdAt: string
  updatedAt: string

  // Relations
  user?: User
}

export interface Message {
  id: string
  content: string
  read: boolean
  senderId: string
  receiverId: string
  createdAt: string
  updatedAt: string

  // Relations
  sender?: User
  receiver?: User
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pages: number
  limit: number
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ProductForm {
  title: string
  description: string
  price: number
  categoryId: string
  condition: "new" | "used" | "refurbished"
  image?: File
}

export interface CheckoutForm {
  shippingAddress: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  billingAddress: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  paymentMethod: "card" | "paypal" | "bank_transfer"
  cardDetails?: {
    number: string
    expiry: string
    cvc: string
    name: string
  }
}
