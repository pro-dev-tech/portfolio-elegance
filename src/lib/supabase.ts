import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Edge function URLs - derived from your Supabase project URL
// Both verify and publish use the same edge function
export const EDGE_FUNCTION_VERIFY_URL = supabaseUrl
  ? `${supabaseUrl}/functions/v1/smooth-responder`
  : "";
export const EDGE_FUNCTION_PUBLISH_URL = supabaseUrl
  ? `${supabaseUrl}/functions/v1/smooth-responder`
  : "";

// Visitor session management
export const getOrCreateVisitorId = async (): Promise<string> => {
  let visitorUuid = localStorage.getItem("portfolio_visitor_uuid");
  if (visitorUuid) return visitorUuid;

  visitorUuid = crypto.randomUUID();
  localStorage.setItem("portfolio_visitor_uuid", visitorUuid);

  // Insert into visitors table
  await supabase.from("visitors").insert({
    id: visitorUuid,
    session_id: visitorUuid,
    user_agent: navigator.userAgent,
    first_visit: new Date().toISOString(),
    last_visit: new Date().toISOString(),
  });

  return visitorUuid;
};
