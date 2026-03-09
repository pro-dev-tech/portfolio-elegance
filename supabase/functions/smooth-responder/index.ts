import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, password } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify password against owner_auth table
    const { data: authData, error: authError } = await supabase
      .from("owner_auth")
      .select("password")
      .eq("id", 1)
      .single();

    if (authError || !authData) {
      return new Response("Auth config missing", {
        status: 500,
        headers: corsHeaders,
      });
    }

    if (password !== authData.password) {
      return new Response("Wrong password", {
        status: 401,
        headers: corsHeaders,
      });
    }

    // If just verifying, return success
    if (message === "verify") {
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    // Otherwise, publish a post
    const { error: insertError } = await supabase.from("posts").insert({
      message,
    });

    if (insertError) {
      return new Response(insertError.message, {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response("Published", { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(String(err), { status: 500, headers: corsHeaders });
  }
});
