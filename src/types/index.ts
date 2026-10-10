/**
 * Shared Type Definitions for Gupta Motors
 * Database and application schema definitions matching Supabase PostgreSQL tables.
 */

// ---------------------------------------------------------------------------
// Employee & Role Definitions
// ---------------------------------------------------------------------------

export type EmployeeRole =
  | 'owner'
  | 'admin'
  | 'manager'
  | 'sales'
  | 'service_advisor'
  | 'mechanic'
  | 'inventory_manager'
  | 'cashier';

// Backward compatibility alias
export type UserRole = EmployeeRole;

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Customer Registry
// ---------------------------------------------------------------------------

export interface CustomerRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Motorcycle Catalogue
// ---------------------------------------------------------------------------

export type MotorcycleCategoryType = 'commuter' | 'pulsar' | 'cruiser' | 'tourer';

export interface MotorcycleDbRecord {
  id: string;
  modelId: string;
  name: string;
  series: string;
  category: MotorcycleCategoryType;
  engineCc: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Booking & Test Ride Enquiries
// ---------------------------------------------------------------------------

export type BookingEnquiryType = 'booking' | 'test_ride' | 'pricing_quote' | 'general';
export type BookingEnquiryStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';

export interface BookingEnquiryRecord {
  id: string;
  customerId: string;
  motorcycleId?: string | null;
  enquiryType: BookingEnquiryType;
  status: BookingEnquiryStatus;
  assignedEmployeeId?: string | null;
  preferredDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Service Jobs
// ---------------------------------------------------------------------------

export type ServiceJobType = 'periodic' | 'repair' | 'warranty' | 'express_wash' | 'inspection';
export type ServiceJobStatus = 'booked' | 'received' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';

export interface ServiceJobRecord {
  id: string;
  customerId: string;
  motorcycleId?: string | null;
  registrationNumber: string;
  serviceType: ServiceJobType;
  status: ServiceJobStatus;
  complaintNotes: string;
  estimatedCompletion?: string | null;
  assignedEmployeeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Inventory & Stock Ledger
// ---------------------------------------------------------------------------

export type ProductCategoryType = 'spare_part' | 'lubricant' | 'accessory' | 'merchandise' | 'consumable';
export type StockMovementType = 'receipt' | 'adjustment' | 'sale' | 'service_consumption' | 'return';

export interface InventoryProductRecord {
  id: string;
  sku: string;
  name: string;
  category: ProductCategoryType;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderThreshold: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovementRecord {
  id: string;
  productId: string;
  movementType: StockMovementType;
  quantity: number;
  referenceId?: string | null;
  notes?: string | null;
  recordedBy: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Immutable Audit Ledger
// ---------------------------------------------------------------------------

export interface AuditLogRecord {
  id: string;
  actorId?: string | null;
  action: string;
  tableName: string;
  recordId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Frontend Request Types
// ---------------------------------------------------------------------------

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
