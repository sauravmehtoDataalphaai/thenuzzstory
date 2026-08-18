export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          loyalty_points: number;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          phone?: string;
          loyalty_points?: number;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          loyalty_points?: number;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          pincode: string;
          address: string;
          city: string;
          state: string;
          landmark: string;
          type: "Home" | "Work";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          pincode: string;
          address: string;
          city: string;
          state: string;
          landmark?: string;
          type?: "Home" | "Work";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          pincode?: string;
          address?: string;
          city?: string;
          state?: string;
          landmark?: string;
          type?: "Home" | "Work";
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          subtotal: number;
          discount: number;
          delivery_fee: number;
          total: number;
          payment_method: string;
          shipping_name: string;
          shipping_phone: string;
          shipping_address: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          status?: string;
          subtotal?: number;
          discount?: number;
          delivery_fee?: number;
          total?: number;
          payment_method?: string;
          shipping_name?: string;
          shipping_phone?: string;
          shipping_address?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          subtotal?: number;
          discount?: number;
          delivery_fee?: number;
          total?: number;
          payment_method?: string;
          shipping_name?: string;
          shipping_phone?: string;
          shipping_address?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_slug: string;
          product_name: string;
          variant: string;
          qty: number;
          unit_price: number;
          image_url: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_slug: string;
          product_name: string;
          variant?: string;
          qty?: number;
          unit_price?: number;
          image_url?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_slug?: string;
          product_name?: string;
          variant?: string;
          qty?: number;
          unit_price?: number;
          image_url?: string;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          role: string;
          permission: string;
          allowed: boolean;
        };
        Insert: {
          role: string;
          permission: string;
          allowed?: boolean;
        };
        Update: {
          role?: string;
          permission?: string;
          allowed?: boolean;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string;
          pet: string;
          category: string;
          type: string;
          price: number;
          mrp: number;
          rating: number;
          reviews: number;
          image_url: string;
          variants: Json;
          in_stock: boolean;
          is_new: boolean;
          popularity: number;
          subscribable: boolean;
          life_stage: string;
          description: string;
          specs: Json;
          ingredients: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          name: string;
          brand: string;
          pet: string;
          category: string;
          type: string;
          price?: number;
          mrp?: number;
          rating?: number;
          reviews?: number;
          image_url?: string;
          variants?: Json;
          in_stock?: boolean;
          is_new?: boolean;
          popularity?: number;
          subscribable?: boolean;
          life_stage?: string;
          description?: string;
          specs?: Json;
          ingredients?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string;
          pet?: string;
          category?: string;
          type?: string;
          price?: number;
          mrp?: number;
          rating?: number;
          reviews?: number;
          image_url?: string;
          variants?: Json;
          in_stock?: boolean;
          is_new?: boolean;
          popularity?: number;
          subscribable?: boolean;
          life_stage?: string;
          description?: string;
          specs?: Json;
          ingredients?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          code: string;
          label: string;
          type: "percent" | "flat";
          value: number;
          min_cart: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          label: string;
          type: "percent" | "flat";
          value?: number;
          min_cart?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          type?: "percent" | "flat";
          value?: number;
          min_cart?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string;
          action: string;
          entity_type: string;
          entity_id: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string;
          action: string;
          entity_type: string;
          entity_id?: string;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          details?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      otp_requests: {
        Row: {
          id: string;
          target_type: "email" | "phone";
          target_value: string;
          otp_hash: string;
          purpose: "signup" | "login";
          expires_at: string;
          attempts: number;
          is_used: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          target_type: "email" | "phone";
          target_value: string;
          otp_hash: string;
          purpose: "signup" | "login";
          expires_at: string;
          attempts?: number;
          is_used?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          target_type?: "email" | "phone";
          target_value?: string;
          otp_hash?: string;
          purpose?: "signup" | "login";
          expires_at?: string;
          attempts?: number;
          is_used?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type CouponRow = Database["public"]["Tables"]["coupons"]["Row"];
export type AuditLogRow = Database["public"]["Tables"]["audit_log"]["Row"];

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  role: string;
}
