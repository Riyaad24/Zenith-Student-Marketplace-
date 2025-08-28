// API utility functions for Azure backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-azure-api.azurewebsites.net/api"

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem("auth_token")
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (email: string, password: string, name: string) => {
    return apiRequest<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  },

  logout: async () => {
    return apiRequest("/auth/logout", { method: "POST" })
  },

  getProfile: async () => {
    return apiRequest<any>("/auth/profile")
  },
}

// Products API functions
export const productsAPI = {
  getAll: async (params?: { category?: string; search?: string; page?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)
    if (params?.page) searchParams.set("page", params.page.toString())

    return apiRequest<{ products: any[]; total: number; pages: number }>(`/products?${searchParams.toString()}`)
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/products/${id}`)
  },

  create: async (productData: any) => {
    return apiRequest<any>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  },

  update: async (id: string, productData: any) => {
    return apiRequest<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  },

  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, { method: "DELETE" })
  },
}

// Cart API functions
export const cartAPI = {
  getItems: async () => {
    return apiRequest<any[]>("/cart")
  },

  addItem: async (productId: string, quantity = 1) => {
    return apiRequest<any>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    })
  },

  updateItem: async (itemId: string, quantity: number) => {
    return apiRequest<any>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    })
  },

  removeItem: async (itemId: string) => {
    return apiRequest(`/cart/items/${itemId}`, { method: "DELETE" })
  },

  clear: async () => {
    return apiRequest("/cart", { method: "DELETE" })
  },
}

// Orders API functions
export const ordersAPI = {
  create: async (orderData: any) => {
    return apiRequest<any>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  },

  getAll: async () => {
    return apiRequest<any[]>("/orders")
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/orders/${id}`)
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest<any>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  },
}

// Categories API functions
export const categoriesAPI = {
  getAll: async () => {
    return apiRequest<any[]>("/categories")
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/categories/${id}`)
  },
}
