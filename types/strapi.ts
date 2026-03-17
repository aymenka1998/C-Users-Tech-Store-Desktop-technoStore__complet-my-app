// ✅ نوع الصورة في Strapi (يدعم v4 و v5 والنسخة المسطحة والمصفوفات)
export interface StrapiImage {
  id: number;
  attributes?: {
    url: string;
    name?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
  url?: string; // لـ Strapi v5
}

// ✅ نوع المراجعة (Review)
export interface Review {
  id: number;
  attributes?: {
    rating: number;
    comment: string;
    createdAt: string;
    user?: {
      data: {
        attributes: {
          username: string;
        };
      };
    };
  };
  rating?: number;
  comment?: string;
}

// ✅ نوع المنتج (Product) - تم التحديث بناءً على صورة Strapi
export interface Product {
  id: number;
  documentId?: string;
  attributes?: {
    documentId: string 
    name: string;
    slug: string;
    description?: string; // Rich Text
    price: number;
    originalPrice?: number;
    sku?: string;
    rating?: number;
    reviewsCount?: number; // أضفته لأنه مطلوب في المكونات
    isNew?: boolean;       // موجود في صورتك
    isSale?: boolean;      // موجود في صورتك
    isFeatured?: boolean;  // موجود في صورتك
    
    // في صورتك الحقل هو "Multiple Media" لذا نستخدم مصفوفة
    image?: { 
      data: StrapiImage | StrapiImage[] | null 
    };
    
    category?: { 
      data: { 
        id: number; 
        attributes: Category 
      } | null 
    };
    
    reviews?: { data: Review[] };
    createdAt?: string;
    updatedAt?: string;
  };
  
  // الحقول المسطحة (Flattened)
  name?: string;
  slug?: string;
  price?: number;
  originalPrice?: number;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
  image?: StrapiImage | StrapiImage[];
  category?: Category;
  reviews?: Review[];
}

// ✅ نوع الفئة (Category)
export interface Category {
  id: number;
  attributes?: {
    name: string;
    slug: string;
    description?: string;
    image?: { data: StrapiImage | null };
    products?: { data: Product[] };
  };
  name?: string;
  slug?: string;
  image?: StrapiImage;
  products?: Product[];
}

// ✅ نوع المستخدم (StrapiUser)
export interface StrapiUser {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  phone?: string;
  avatar?: string | StrapiImage;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ✅ أنواع الطلبات (Orders)
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItem {
  id?: number;
  product: Product | number;
  quantity: number;
  price: number;
  total?: number;
}

export interface Order {
  id: number;
  attributes?: {
    orderNumber: string;
    total: number;
    subtotal?: number;
    shipping?: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    shippingAddress: ShippingAddress;
    orderItems: OrderItem[];
    user?: { data: { id: number; attributes: StrapiUser } };
    createdAt: string;
  };
  orderNumber?: string;
  total?: number;
  status?: string;
}

// ✅ نوع الاستجابة العام
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}