import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

// Only create client if credentials are provided
const noopResult = { data: null, error: { message: "Supabase not configured" } };
const noopChain: any = new Proxy(
  {},
  { get: () => (..._args: any[]) => Promise.resolve(noopResult) }
);
const noopClient = new Proxy({} as SupabaseClient, {
  get: (_t, prop) => {
    if (prop === "from") return () => noopChain;
    return () => noopChain;
  },
});

export const supabase: SupabaseClient =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : noopClient;

// Edge function URLs
export const EDGE_FUNCTION_VERIFY_URL = supabaseUrl
  ? `${supabaseUrl}/functions/v1/smooth-responder`
  : "";
export const EDGE_FUNCTION_PUBLISH_URL = supabaseUrl
  ? `${supabaseUrl}/functions/v1/smooth-responder`
  : "";

// Visitor session management
export const getOrCreateVisitorId = async (): Promise<string> => {
  let visitorUuid = localStorage.getItem("portfolio_visitor_uuid");

  if (visitorUuid) {
    // Returning visitor — update last_visit
    await supabase.from("visitors").upsert(
      {
        id: visitorUuid,
        session_id: visitorUuid,
        user_agent: navigator.userAgent,
        last_visit: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    return visitorUuid;
  }

  visitorUuid = crypto.randomUUID();
  localStorage.setItem("portfolio_visitor_uuid", visitorUuid);

  // New visitor
  await supabase.from("visitors").upsert(
    {
      id: visitorUuid,
      session_id: visitorUuid,
      user_agent: navigator.userAgent,
      first_visit: new Date().toISOString(),
      last_visit: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  return visitorUuid;
};
