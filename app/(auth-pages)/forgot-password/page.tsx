
import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="w-full max-w-md mx-auto p-6 flex flex-col justify-center">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-semibold">Reset Password</h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter your email and we'll send you a link to reset your password
                  </p>
                </div>

                <form className="space-y-4" action={forgotPasswordAction}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        className="pl-10" 
                        required 
                      />
                    </div>
                  </div>

                  <SubmitButton 
                    className="w-full"
                  >
                    Send Reset Link
                  </SubmitButton>

                  <FormMessage message={searchParams} />

                  <div className="flex justify-center">
                    <Link 
                      href="/sign-in" 
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to Sign in
                    </Link>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12">
            <div className="relative">
              <div className="relative flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-48 h-48 text-primary/20">
                  <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-4.987-3.744A7.966 7.966 0 0 0 12 20c1.97 0 3.773-.712 5.167-1.892A6.979 6.979 0 0 0 12.16 16a6.981 6.981 0 0 0-5.147 2.256zM5.616 16.82A8.975 8.975 0 0 1 12.16 14a8.972 8.972 0 0 1 6.362 2.634 8 8 0 1 0-12.906.187zM12 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SmtpMessage />
    </>
  );
}
