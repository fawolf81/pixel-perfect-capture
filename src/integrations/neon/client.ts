import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";
import { createAuthClient } from "@neondatabase/neon-js/auth";

import type { Database } from "./types";

export const neon = createClient<Database>({
  auth: {
    adapter: SupabaseAuthAdapter(),
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});

export const neonAuth = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);