export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super-admin' | 'company-admin' | 'distributor-admin' | 'retailer';
  tenantId: string;
  companyId?: string;
  distributorId?: string;
  retailerId?: string;
}

export interface Product {
  _id: string;
  companyId: string;
  name: string;
  sku: string;
  mrp: number;
  gst: number;
  packSize?: string;
  weight?: string;
  benefits?: string[];
  ingredients?: string[];
  specs?: Record<string, any>;
  media?: ProductMedia[];
  launchStatus?: string;
}

export interface Order {
  _id: string;
  companyId: string;
  distributorId?: string;
  retailerId?: string;
  orderType: 'retailer-order' | 'distributor-replenishment';
  items: any[];
  subtotal?: number;
  tax?: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface Retailer {
  _id: string;
  name: string;
  storeName: string;
  category: string;
  location: any;
  status: string;
  loyaltyPoints: number;
}

export interface Company {
  _id: string;
  name: string;
  industry: string;
  subscriptionPlan: string;
  status: string;
}

export interface ProductMedia {
  type: 'image' | 'video' | 'pdf';
  url: string;
  thumbnailUrl?: string;
}

export interface Distributor {
  _id: string;
  companyId: string;
  name: string;
  regions: string[];
  pricingRules?: Record<string, any>;
  status: string;
}

export interface DistributorProductPrice {
  _id: string;
  companyId: string;
  distributorId: string;
  productId: string;
  retailerCategory: 'silver' | 'gold' | 'platinum' | 'all';
  basePrice: number;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minQuantity: number;
  finalPrice?: number;
  status: string;
}

export interface InventoryItem {
  _id: string;
  distributorId: string;
  productId: string;
  stockOnHand: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  alerts?: any[];
}

export interface Invoice {
  _id: string;
  orderId: string;
  invoiceNumber: string;
  retailerId?: string;
  distributorId?: string;
  amountDue: number;
  amountPaid: number;
  dueDate?: string;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  pdfUrl?: string;
}

export interface InstallmentPlan {
  _id: string;
  invoiceId: string;
  retailerId: string;
  distributorId?: string;
  totalAmount: number;
  creditDays: number;
  installments: any[];
  status: string;
}

export interface SampleRequest {
  _id: string;
  retailerId: string;
  distributorId?: string;
  companyId: string;
  productId: string;
  quantity: number;
  status: 'requested' | 'approved' | 'rejected' | 'delivered';
}

export interface ReturnClaim {
  _id: string;
  orderId: string;
  retailerId: string;
  distributorId?: string;
  companyId: string;
  items: any[];
  claimType: 'return' | 'damage' | 'shortage';
  status: string;
}

export interface Story {
  _id: string;
  companyId: string;
  type: 'story' | 'short' | 'banner' | 'reel';
  title?: string;
  contentUrl: string;
  thumbnailUrl?: string;
  status: string;
}

export interface DashboardSummary {
  products: number;
  distributors: number;
  retailers: { active: number; pendingApproval: number };
  orders: { pending: number; delivered: number };
  finance: { openInvoices: number; outstandingAmount: number };
  inventory: { lowStock: number };
  workflows: { pendingSamples: number; openReturns: number };
  discovery: { publishedStories: number; averageRating: number };
  campaigns: { active: number };
  schemes: { active: number };
}
