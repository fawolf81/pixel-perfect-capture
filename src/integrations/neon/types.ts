export type Database = {
  public: {
    Tables: {
      account_entitlements: {
        Row: {
          plan: string;
          premium_until: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          plan?: string;
          premium_until?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          plan?: string;
          premium_until?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      game_saves: {
        Row: {
          user_id: string;
          state: unknown;
          screen: string;
          schema_version: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          state: unknown;
          screen?: string;
          schema_version?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          state?: unknown;
          screen?: string;
          schema_version?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};