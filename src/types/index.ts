/**
 * Shared Type Definitions for Gupta Motors
 */

export type UserRole = 'owner' | 'sales_manager' | 'service_advisor' | 'inventory_clerk' | 'billing_operator';

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
}

export interface Motorcycle {
  id: string;
  name: string;
  category: 'commuter' | 'executive' | 'sports' | 'cruiser';
  engineCc: number;
  exShowroomPrice: number;
  availableColors: string[];
  inStock: boolean;
  featured: boolean;
}

export interface ServiceBookingRequest {
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  registrationNumber: string;
  serviceType: 'periodic' | 'repair' | 'warranty' | 'express_wash';
  preferredDate: string;
  additionalNotes?: string;
}

export interface SparePartEnquiryRequest {
  customerName: string;
  customerPhone: string;
  partNameOrNumber: string;
  bikeModel: string;
  modelYear?: string;
  urgency: 'routine' | 'urgent';
}
