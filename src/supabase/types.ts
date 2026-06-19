export type Database = {
  public: {
    Tables: {
      mortgage_rates: {
        Row: {
          id: string;
          bank: string;
          product_name: string;
          interest_rate: number;
          lock_in_years: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bank: string;
          product_name: string;
          interest_rate: number;
          lock_in_years: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bank?: string;
          product_name?: string;
          interest_rate?: number;
          lock_in_years?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      banks: {
        Row: {
          id: string;
          name: string;
          slug: string;
          website: string | null;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          website?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          website?: string | null;
          logo_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      property_transactions: {
        Row: {
          id: string;
          project: string;
          street: string | null;
          district: number;
          price: number;
          area_sqm: number;
          psf: number | null;
          floor_range: string | null;
          property_type: string | null;
          tenure: string | null;
          type_of_sale: string | null;
          contract_date: string;
          imported_at: string;
        };
        Insert: {
          id?: string;
          project: string;
          street?: string | null;
          district: number;
          price: number;
          area_sqm: number;
          floor_range?: string | null;
          property_type?: string | null;
          tenure?: string | null;
          type_of_sale?: string | null;
          contract_date: string;
          imported_at?: string;
        };
        Update: {
          id?: string;
          project?: string;
          street?: string | null;
          district?: number;
          price?: number;
          area_sqm?: number;
          floor_range?: string | null;
          property_type?: string | null;
          tenure?: string | null;
          type_of_sale?: string | null;
          contract_date?: string;
          imported_at?: string;
        };
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          status: string;
          subscribed_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          status?: string;
          subscribed_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          status?: string;
          subscribed_at?: string;
        };
        Relationships: [];
      };
      calculators: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      insurance_rates: {
        Row: {
          id: string;
          category: string;
          insurer: string;
          plan_name: string;
          tier: string;
          price: number;
          price_unit: string;
          coverage_limit: number | null;
          coverage_limit_label: string | null;
          key_features: string[];
          excess: number | null;
          workshop_type: string | null;
          quote_url: string | null;
          is_active: boolean;
          last_updated: string;
        };
        Insert: {
          id?: string;
          category: string;
          insurer: string;
          plan_name: string;
          tier: string;
          price: number;
          price_unit: string;
          coverage_limit?: number | null;
          coverage_limit_label?: string | null;
          key_features?: string[];
          excess?: number | null;
          workshop_type?: string | null;
          quote_url?: string | null;
          is_active?: boolean;
          last_updated?: string;
        };
        Update: {
          id?: string;
          category?: string;
          insurer?: string;
          plan_name?: string;
          tier?: string;
          price?: number;
          price_unit?: string;
          coverage_limit?: number | null;
          coverage_limit_label?: string | null;
          key_features?: string[];
          excess?: number | null;
          workshop_type?: string | null;
          quote_url?: string | null;
          is_active?: boolean;
          last_updated?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      district_summary: {
        Row: {
          district: number;
          transaction_count: number;
          median_psf: number | null;
          latest_date: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

export type MortgageRate = Database["public"]["Tables"]["mortgage_rates"]["Row"];
