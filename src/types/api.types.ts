// Types basés sur les schemas Pydantic du backend

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT' | 'CLIENT';
  is_active: boolean;
  attributes?: Record<string, any>;
  roles?: Role[];
  created_at: string;
  updated_at: string;
}

export interface AppConfiguration {
  language?: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'ADMIN' | 'MANAGER' | 'AGENT' | 'CLIENT';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  code: string;
  description?: string;
  conditions?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  level: number;
  is_active: boolean;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  brand_name?: string;
  country?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  legal_name?: string;
  registration_number?: string;
  tax_id?: string;
  legal_form?: string;
  payment_terms?: string;
  preferred_currency?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface SupplierContact {
  id: string;
  supplier_id: string;
  first_name: string;
  last_name: string;
  position?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  is_primary: boolean;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierWithContacts extends Supplier {
  contacts: SupplierContact[];
}

export interface ProductType {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryType {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  code: string;
  country: string;
  region?: string;
  city?: string;
  zone?: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  timezone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierProduct {
  id: string;
  supplier_id: string;
  product_type_id: string;
  destination_id: string;
  code: string;
  name: string;
  description?: string;
  specifications?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierProductWithRelations extends SupplierProduct {
  product_type: ProductType;
  destination: Destination;
  supplier?: Supplier;
}

export interface Contract {
  id: string;
  code: string;
  name: string;
  supplier_name?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface SupplierContract {
  supplier_id: string;
  code: string;
  name: string;
  contract_type: string;
  status: string;
  priority: number;
  version: number;
  signature_date?: string | null;
  valid_from?: string | null;
  valid_to?: string | null;
  terminated_at?: string | null;
  auto_renew: boolean;
  is_cumulative: boolean;
  notes?: string | null;
  id: string;
  created_at: string;
  updated_at: string;
}

// Types pour les réponses API avec pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

// Types pour les erreurs API
export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface Media {
  id: string;
  entity_type: string;
  entity_id: string;
  media_type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'LOGO' | string;
  storage_type: 'LOCAL' | 'CLOUD' | 'EXTERNAL' | string;
  file_name: string;
  file_url: string;
  title?: string;
  alt_text?: string;
  source?: string;
  mime_type?: string;
  file_size?: number;
  width?: number;
  height?: number;
  file_path?: string;
  external_url?: string;
  meta_info?: Record<string, unknown>;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
  created_by?: string;
}

export interface ProductWithRelations extends SupplierProduct {
  product_type?: ProductType;
  destination?: Destination;
  supplier?: Supplier;
}