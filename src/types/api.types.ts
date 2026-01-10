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

export interface UserProfile {
  department_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  phone?: string | null;
  mobile?: string | null;
  preferred_language?: string | null;
  timezone?: string | null;
  date_format?: string | null;
  time_format?: string | null;
  currency?: string | null;
  job_title?: string | null;
  employee_id?: string | null;
  office_location?: string | null;
  signature?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  settings?: Record<string, unknown> | null;
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  username?: string | null;
  user_email?: string | null;
  department_name?: string | null;
}

export type UserProfileUpdatePayload = Partial<
  Omit<
    UserProfile,
    | "id"
    | "user_id"
    | "created_at"
    | "updated_at"
    | "department_name"
    | "user_email"
    | "username"
  >
> & {
  settings?: Record<string, unknown>;
};

export interface Configuration {
  language?: string;
  [key: string]: unknown;
}

export interface ApplicationConfig {
  id?: string;
  singleton_key?: string;
  company_name?: string | null;
  company_legal_name?: string | null;
  tax_id?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  default_language?: string | null;
  default_currency?: string | null;
  default_timezone?: string | null;
  default_date_format?: string | null;
  default_time_format?: string | null;
  headquarters_address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  vat_number?: string | null;
  siret?: string | null;
  license_number?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  theme?: string | null;
  default_vat_rate?: string | null;
  booking_reference_prefix?: string | null;
  invoice_number_format?: string | null;
  contract_validity_days?: string | null;
  data_retention_days?: string | null;
  privacy_policy_url?: string | null;
  terms_conditions_url?: string | null;
  settings?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export type AppConfiguration = ApplicationConfig;

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

export interface PaginatedPackageResponse {
  items: Package[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PackageComponent {
  package_id: string;
  product_category_id: string;
  inclusion_mode: string;
  option_group?: string | null;
  is_mandatory: boolean;
  is_default_selected: boolean;
  quantity: number;
  min_quantity: number;
  max_quantity?: number | null;
  price_handling: string;
  price_supplement?: string | null;
  unit_cost?: string | null;
  total_cost?: string | null;
  unit_sell_price?: string | null;
  total_sell_price?: string | null;
  sort_order?: number;
  display_name?: string;
  highlight?: boolean | string | null;
  notes?: string | null;
  id: string;
  created_at: string;
  updated_at: string;
  product_category_name?: string;
  product_category_code?: string;
}

export interface PackageDestination {
  destination_id: string;
  id: string;
  package_id: string;
  created_at: string;
  updated_at: string;
  destination_code?: string | null;
  destination_name?: string | null;
  destination_country?: string | null;
  destination_region?: string | null;
}

export interface PackagePricingPolicy {
  package_id: string;
  pricing_mode: string;
  fixed_price?: string | null;
  base_margin_pct?: string | null;
  base_margin_amount?: string | null;
  is_from_price: boolean;
  notes?: string | null;
  id: string;
  created_at: string;
  updated_at: string;
}
export interface PackageComponentCategoryInfo {
  id: string;
  code?: string | null;
  name?: string | null;
  category_type_code?: string | null;
  category_type_name?: string | null;
  product_id?: string | null;
  product_code?: string | null;
  product_name?: string | null;
  supplier_id?: string | null;
  supplier_code?: string | null;
  supplier_name?: string | null;
  destination_id?: string | null;
  destination_code?: string | null;
  destination_name?: string | null;
  destination_country?: string | null;
}

export interface PackageComponentPriceEstimate {
  estimated_unit_cost?: string | null;
  estimated_total_cost?: string | null;
  cost_source?: string | null;
  unit_sell_price?: string | null;
  total_sell_price?: string | null;
  margin_amount?: string | null;
  margin_percentage?: number | null;
  contract_id?: string | null;
  contract_reference?: string | null;
  contract_item_id?: string | null;
  supplier_vat_rate?: string | null;
  supplier_vat_amount?: string | null;
  sales_vat_rate?: string | null;
  sales_vat_amount?: string | null;
  confidence_level?: string | null;
  pricing_notes?: string | null;
}

export interface PackageComponentEnhanced extends PackageComponent {
  category_info?: PackageComponentCategoryInfo | null;
  price_estimate?: PackageComponentPriceEstimate | null;
}

export interface PackageDestinationEnhanced {
  id: string;
  package_id: string;
  destination_id: string;
  destination_code?: string | null;
  destination_name?: string | null;
  destination_country?: string | null;
  destination_region?: string | null;
  is_primary?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PackagePricingSummary {
  total_components?: number;
  included_components?: number;
  optional_components?: number;
  total_estimated_cost?: string | null;
  total_estimated_sell?: string | null;
  total_estimated_margin?: string | null;
  average_margin_percentage?: number | null;
  has_all_prices?: boolean;
  confidence_level?: string | null;
  pricing_notes?: string | null;
}

export interface PackageUserSummary {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}
export interface Package {
  code: string;
  name: string;
  description?: string;
  status: string;
  min_pax?: number;
  max_pax?: number;
  valid_from?: string;
  valid_to?: string;
  featured_image_url?: string;
  brochure_page?: number;
  highlight?: boolean;
  tags?: string[];
  meta_info?: Record<string, unknown>;
  id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  published_at?: string;
  published_by?: string;
  components?: PackageComponent[];
  pricing_policy?: PackagePricingPolicy;
  destinations?: PackageDestination[];
}

export interface PackageEnhanced extends Package {
  created_by_name?: string | null;
  updated_by_name?: string | null;
  published_by_name?: string | null;
  created_by_user?: PackageUserSummary | null;
  updated_by_user?: PackageUserSummary | null;
  published_by_user?: PackageUserSummary | null;
  components?: PackageComponentEnhanced[];
  destinationsEnhanced?: PackageDestinationEnhanced[];
  pricing_summary?: PackagePricingSummary;
}