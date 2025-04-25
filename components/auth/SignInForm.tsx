"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInSchema } from "./signInSchema";

const RenderFrom = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setPending(true);
    const { email, password } = data;
    try {
      const supabase = createClient();
      const signInResponse = await supabase.auth.signInWithPassword({ email, password });

      if (signInResponse.error) throw signInResponse.error;

      const userId = signInResponse.data.session?.user?.id;
      if (!userId) throw new Error("User ID not found.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error("User profile not found.");

      form.reset();
      toast.success("Sign in successful");

      if (!profile.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error("Sign-in error:", error);
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="p-8 flex-1 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg">
        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold">Sign in</h1>
                <p className="text-sm text-muted-foreground mt-2">Enter your credentials to sign in</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className={form.formState.errors.email ? "border-red-500" : ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            className={form.formState.errors.password ? "border-red-500" : ""}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button aria-disabled={pending} type="submit" id="sign-in-btn" className="w-full">
                    {pending ? "Submitting..." : "Sign In"}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Need an account?{" "}
                      <Link className="text-primary hover:underline font-medium" href="/sign-up" id="sign-up-link">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RenderFrom;