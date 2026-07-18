const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const envText = fs.readFileSync(path.resolve(__dirname, "..", ".env.local"), "utf8");
const env = Object.fromEntries(envText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => line.split("=", 2).map((part) => part.trim())));
const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(`Missing Supabase URL or service role key (found URL=${Boolean(supabaseUrl)} role=${Boolean(serviceRoleKey)})`);
}
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
(async () => {
  const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const fullName = "Tamim Hasan";

  const listResult = await supabaseAdmin.auth.admin.listUsers();
  if (listResult.error) {
    console.error("List users error:", listResult.error.message || listResult.error);
    process.exit(1);
  }

  const existingUser = listResult.data.users.find((user) => user.email === email);
  if (existingUser) {
    console.log("Admin user already exists:", {
      id: existingUser.id,
      email: existingUser.email,
      email_confirm: existingUser.email_confirm,
      role: existingUser.user_metadata?.role,
      full_name: existingUser.user_metadata?.full_name,
    });

    const updateResult = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
      password,
      user_metadata: {
        role: "admin",
        full_name: fullName,
      },
    });

    if (updateResult.error) {
      console.error("Update user error:", updateResult.error.message || updateResult.error);
      process.exit(1);
    }

    console.log("Admin user updated with new password and metadata.");
    process.exit(0);
  }

  const createResult = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "admin",
      full_name: fullName,
    },
  });

  if (createResult.error) {
    console.error("Create user error:", createResult.error.message || createResult.error);
    process.exit(1);
  }

  console.log("Admin user created:", createResult.data.user?.email, createResult.data.user?.id);
})();
