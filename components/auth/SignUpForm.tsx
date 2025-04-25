"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, User } from "lucide-react";
import { signUpSchema } from "./signUpSchema";

const RenderSignUpForm = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      // role: "house", // Uncomment if using role field
    },
    mode: "onChange",
  });

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    setPending(true);
    try {
      const supabase = createClient();
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            // role: data.role, // Uncomment if using role field
          },
        },
      });

      if (signUpError) throw signUpError;

      toast.success("Account created successfully! Please check your email for verification.");
      form.reset();
      router.push("/sign-in");
    } catch (error: unknown) {
      console.error("Sign-up error:", error);
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
                <h1 className="text-2xl font-semibold">Create an account</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Sign up to get started with our waste management platform
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              {...field}
                              type="text"
                              placeholder="Your full name"
                              className={`pl-10 ${form.formState.errors.name ? "border-red-500" : ""}`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="you@example.com"
                              className={`pl-10 ${form.formState.errors.email ? "border-red-500" : ""}`}
                            />
                          </div>
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
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              {...field}
                              type="password"
                              placeholder="Create a strong password"
                              className={`pl-10 ${form.formState.errors.password ? "border-red-500" : ""}`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                        <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                      </FormItem>
                    )}
                  />

                  {/* Uncomment the block below to reintroduce the role field */}
                  {/* <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am signing up as:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
                              <Home className="h-6 w-6 text-primary" />
                              <RadioGroupItem value="house" id="house" className="sr-only" />
                              <Label htmlFor="house" className="text-sm cursor-pointer">
                                House
                              </Label>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
                              <Building className="h-6 w-6 text-primary" />
                              <RadioGroupItem value="house_manager" id="manager" className="sr-only" />
                              <Label htmlFor="manager" className="text-sm cursor-pointer">
                                Building Manager
                              </Label>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 border rounded-lg p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary">
                              <Trash2 className="h-6 w-6 text-primary" />
                              <RadioGroupItem value="admin" id="admin" className="sr-only" />
                              <Label htmlFor="admin" className="text-sm cursor-pointer">
                                Waste Company
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  /> */}

                  <Button aria-disabled={pending} type="submit" id="sign-up-btn" className="w-full">
                    {pending ? "Signing up..." : "Sign up"}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link className="text-primary hover:underline font-medium" href="/sign-in" id="sign-in-link">
                        Sign in
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

export default RenderSignUpForm;