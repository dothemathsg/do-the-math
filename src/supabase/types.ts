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
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

export type MortgageRate = Database["public"]["Tables"]["mortgage_rates"]["Row"];
