
"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const role = formData.get("role")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");


  // Validation
  if (!email) {
    throw encodedRedirect("error", "/sign-up", "Email is required");
  }
  if (!password) {
    throw encodedRedirect("error", "/sign-up", "Password is required");
  }
  if (!name) {
    throw encodedRedirect("error", "/sign-up", "Full name is required");
  }
  if (!role) {
    throw encodedRedirect("error", "/sign-up", "Please select a role");
  }

  const validRoles = ['house', 'house_manager', 'admin'] as const;
  if (!validRoles.includes(role as any)) {
    throw encodedRedirect("error", "/sign-up", "Invalid role selected");
  }
  if (password.length < 6) {
    throw encodedRedirect("error", "/sign-up", "Password must be at least 6 characters");
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw encodedRedirect("error", "/sign-up", "Please enter a valid email address");
  }
  if (!/^[a-zA-Z\s-]{2,}$/.test(name)) {
    throw encodedRedirect("error", "/sign-up", "Please enter a valid name (at least 2 characters)");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name: name || email.split('@')[0],
        role: role || 'house', // Default to house role if not specified
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    // Handle specific error cases
    if (error.code === 'weak_password') {
      return encodedRedirect("error", "/sign-up", "Please choose a stronger password");
    }
    if (error.code === 'user_already_exists') {
      return encodedRedirect("error", "/sign-up", "This email is already registered");
    }
    return encodedRedirect("error", "/sign-up", error.message);
  }

  // Fallback in case data.user is somehow missing
  return encodedRedirect(
    "success",
    "/sign-up",
    "Sign up initiated. Please check your email."
  );
};



export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const supabase = await createClient();

  // First, attempt to sign in with email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // After successful sign-in, verify the role from user metadata
  if (data.user) {
    const userRole = data.user.user_metadata?.role;
    
    if (userRole !== role) {
      // Sign out if the role doesn't match
      await supabase.auth.signOut();
      return encodedRedirect("error", "/sign-in", "Incorrect role selected for this account");
    }
    
    // Role matches, proceed with successful login
    return encodedRedirect("success", "/", "Sign in successful");
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
