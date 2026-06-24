export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super-admin' | 'company-admin' | 'distributor-admin' | 'retailer' | string;
  tenantId: string;
  companyId?: string;
  distributorId?: string;
  retailerId?: string;
}

export interface Product {
  _id?: string;
  name: string;
  sku: string;
  mrp: number;
  gst: number;
  packSize: string;
  benefits?: string[];
  launchStatus?: string;
  media?: any[];
}

export interface Order {
  _id?: string;
  companyId?: string;
  distributorId?: string;
  retailerId?: string;
  orderType?: 'retailer-order' | 'distributor-replenishment';
  items: any[];
  total: number;
  status: string;
  createdAt?: Date;
}

export interface Retailer {
  _id?: string;
  name: string;
  storeName: string;
  category: string;
  location?: any;
  loyaltyPoints?: number;
  status?: string;
}

export interface Company {
  _id?: string;
  name: string;
  industry: string;
  subscriptionPlan: string;
}

export interface DistributorProductPrice {
  _id?: string;
  companyId: string;
  distributorId: string;
  productId: string;
  retailerCategory: 'silver' | 'gold' | 'platinum' | 'all';
  basePrice: number;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minQuantity: number;
  finalPrice?: number;
}

export interface InventoryItem {
  _id?: string;
  distributorId: string;
  productId: string;
  stockOnHand: number;
  reorderLevel?: number;
}

export interface Invoice {
  _id?: string;
  orderId: string;
  invoiceNumber: string;
  amountDue: number;
  amountPaid: number;
  status: string;
  dueDate?: string;
  pdfUrl?: string;
}

export interface SampleRequest {
  _id?: string;
  retailerId: string;
  distributorId?: string;
  companyId: string;
  productId: string;
  quantity: number;
  status: string;
}

export interface ReturnClaim {
  _id?: string;
  orderId: string;
  retailerId: string;
  companyId: string;
  items: any[];
  claimType: string;
  status: string;
}

export interface Story {
  _id?: string;
  companyId: string;
  type: string;
  title?: string;
  contentUrl: string;
  thumbnailUrl?: string;
}
