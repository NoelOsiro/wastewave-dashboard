import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function Login({ searchParams }: { searchParams: Promise<Message> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left side - Illustration */}
      <div className="bg-gradient-to-br from-primary/90 to-primary/60 p-10 flex-1 flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              fill="#FFFFFF"
              d="M44.5,-76.3C59.3,-69.7,74,-60.5,83.1,-47.1C92.2,-33.6,95.7,-16.8,94.9,-0.5C94.1,15.9,89,31.7,79.8,44.7C70.6,57.6,57.3,67.7,42.5,74.3C27.7,80.9,11.4,84.1,-3.9,80.7C-19.1,77.3,-33.1,67.3,-47.3,57.7C-61.5,48.1,-75.8,38.8,-82.2,25.3C-88.5,11.7,-86.9,-6.1,-80.9,-21.1C-74.9,-36.1,-64.6,-48.2,-51.5,-57C-38.5,-65.8,-22.8,-71.3,-6.5,-72.3C9.8,-73.3,29.6,-82.9,44.5,-76.3Z"
              transform="translate(100 100) scale(1.2)"
            />
          </svg>
        </div>

        <div className="z-10 max-w-md text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-white/80 text-lg mb-8">
            Log in to your account to access all features and manage your properties efficiently.
          </p>
          <div className="hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-64 h-64 mx-auto">
              <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)" fill="#FFF" stroke="none">
                <path d="M2330 4469 c-305 -29 -659 -175 -910 -377 -573 -461 -792 -1240 -542
                -1927 188 -516 636 -930 1167 -1076 133 -37 234 -52 377 -58 294 -12 559 44
                819 174 455 227 795 651 922 1150 32 128 56 313 57 435 0 144 -9 257 -32 390
                -81 463 -339 884 -711 1157 -143 105 -359 209 -532 257 -146 40 -237 52 -405
                55 -82 2 -172 1 -200 -3z m490 -189 c407 -79 750 -288 992 -605 333 -435 422
                -1013 235 -1535 -73 -204 -229 -447 -381 -590 -94 -89 -266 -212 -366 -261
                -218 -107 -400 -149 -650 -149 -247 0 -415 38 -630 144 -565 277 -910 871
                -873 1506 18 304 122 592 301 835 293 398 716 629 1179 646 58 2 121 4 141 5
                20 1 43 1 50 0 8 0 9 -75 3 -293 l-8 -293 -129 0 c-170 0 -226 -18 -289 -94
                l-45 -53 0 -369 0 -369 45 -53 c63 -76 119 -94 289 -94 l129 0 -2 -167 -3
                -168 -142 -77 c-149 -80 -172 -98 -211 -158 -65 -103 -74 -174 -35 -278 41
                -109 122 -181 239 -214 102 -28 308 -11 401 33 83 40 154 121 187 216 21 60
                22 74 16 280 -3 120 -8 229 -11 242 -3 19 1 29 17 40 12 7 24 14 28 14 6 0
                169 -161 182 -179 3 -5 -7 -25 -21 -46 -184 -252 -156 -595 68 -813 194 -190
                483 -222 718 -80 102 62 218 194 256 293 28 72 30 87 30 190 0 107 -1 117
                -32 190 -32 73 -115 178 -181 225 l-33 25 48 47 49 47 -3 -52 c-7 -102 55
                -238 143 -314 160 -138 399 -138 561 1 89 75 156 226 145 326 l-5 47 148 148
                c171 171 203 214 203 270 0 94 -86 180 -180 180 -56 0 -100 -33 -267 -199
                l-148 -147 -65 66 -65 67 60 59 c67 67 85 103 85 171 0 92 -85 176 -176 176
                -73 0 -107 -20 -172 -102 -29 -36 -52 -70 -52 -75 0 -5 -29 15 -64 45 -35 30
                -68 56 -73 59 -4 2 -8 122 -9 266 -2 301 -7 340 -57 427 -33 57 -119 139
                -179 172 -88 47 -150 58 -333 58 l-170 0 -3 293 c-2 160 -1 292 2 292 3 0 55
                -8 116 -19z"/>
                {/* ... rest of the SVG paths ... */}
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="p-8 flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-semibold">Sign in</h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter your credentials to access your account
                  </p>
                </div>

                <form className="space-y-4" action={signInAction}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
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

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <SubmitButton pendingText="Signing In..." className="w-full">
                    Sign in
                  </SubmitButton>

                  <FormMessage message={resolvedSearchParams} />

                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <Link className="text-primary hover:underline font-medium" href="/sign-up">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}