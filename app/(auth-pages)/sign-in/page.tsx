
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left side - Illustration */}
      <div className="bg-gradient-to-br from-primary/90 to-primary/60 p-10 flex-1 flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#FFFFFF" d="M44.5,-76.3C59.3,-69.7,74,-60.5,83.1,-47.1C92.2,-33.6,95.7,-16.8,94.9,-0.5C94.1,15.9,89,31.7,79.8,44.7C70.6,57.6,57.3,67.7,42.5,74.3C27.7,80.9,11.4,84.1,-3.9,80.7C-19.1,77.3,-33.1,67.3,-47.3,57.7C-61.5,48.1,-75.8,38.8,-82.2,25.3C-88.5,11.7,-86.9,-6.1,-80.9,-21.1C-74.9,-36.1,-64.6,-48.2,-51.5,-57C-38.5,-65.8,-22.8,-71.3,-6.5,-72.3C9.8,-73.3,29.6,-82.9,44.5,-76.3Z" transform="translate(100 100) scale(1.2)" />
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
                <path d="M2415 3575 c-16 -9 -41 -32 -55 -52 l-25 -35 -3 -334 -3 -334 286 0
                c268 0 288 1 310 20 47 40 48 50 46 416 -3 320 -4 336 -24 365 -35 50 -63 59
                -194 59 -92 0 -119 -3 -143 -18 -57 -34 -60 -61 -60 -517 l0 -405 -55 0 -55
                0 0 405 c0 430 -3 456 -45 492 -21 18 -41 23 -96 26 -43 2 -79 -1 -94 -9 -30
                -17 -51 -64 -58 -132 -4 -29 -7 -216 -7 -416 -1 -391 1 -404 57 -437 26 -15
                60 -16 383 -14 195 1 368 6 382 10 15 4 38 19 50 34 l24 25 -3 404 c-3 387
                -4 406 -24 432 -11 15 -35 36 -54 47 -31 18 -56 19 -309 19 -231 0 -280 -3
                -302 -16z"/>
                <path d="M3453 2890 c-12 -5 -29 -21 -38 -36 -15 -25 -16 -48 -11 -198 14
                -409 18 -462 36 -484 17 -21 32 -24 198 -36 99 -7 187 -15 196 -18 12 -4 16
                -19 16 -60 0 -74 -13 -85 -111 -98 -121 -15 -289 -52 -289 -63 0 -20 39 -97
                61 -121 66 -72 158 -96 359 -96 281 0 382 62 428 263 25 108 20 171 -18 213
                -29 32 -33 33 -160 54 -213 35 -250 46 -250 71 0 36 20 45 135 58 122 14 170
                29 221 67 78 59 98 178 53 305 -32 87 -74 141 -137 178 -60 34 -157 51 -307
                51 -98 0 -151 -5 -182 -16 -54 -20 -117 -85 -139 -145 -16 -43 -16 -49 1 -77
                19 -32 44 -41 110 -40 29 1 48 9 83 39 25 21 60 42 79 47 19 4 81 8 137 7
                101 -1 105 -2 142 -31 42 -34 66 -85 66 -139 0 -55 -24 -105 -63 -130 -32
                -21 -48 -23 -327 -35 -91 -3 -173 -11 -182 -16 -22 -13 -24 -32 -31 -222 -4
                -92 -12 -201 -19 -243 -7 -43 -10 -79 -8 -82 10 -9 158 46 188 69 18 15 47
                49 65 76 l31 50 0 344 0 344 -28 38 c-15 21 -37 43 -47 48 -24 13 -238 13
                -278 0z"/>
                <path d="M1480 2629 c-21 -27 -50 -62 -65 -79 -14 -16 -25 -33 -25 -38 0 -4
                29 -38 64 -75 79 -82 78 -81 -16 -176 -43 -45 -78 -84 -78 -87 0 -3 16 -23
                35 -43 l36 -36 -40 -42 c-23 -23 -41 -46 -41 -51 0 -6 18 -30 41 -54 l41 -44
                -35 -35 -34 -34 75 -75 c41 -41 78 -74 82 -74 4 1 42 36 84 78 l76 76 47 -47
                47 -48 34 34 c19 19 39 34 44 34 5 0 28 -17 50 -38 l40 -38 37 36 36 35 43
                -44 44 -43 37 31 c20 17 60 52 88 78 l51 48 -78 78 -79 78 44 43 43 43 -34
                35 c-19 20 -34 39 -34 43 0 5 18 28 40 53 l40 44 -44 44 -44 44 44 44 43 44
                -77 77 -78 78 -76 -77 -77 -76 -44 44 -44 44 -37 -36 -37 -37 -44 43 -43 44
                -36 -37 c-20 -21 -39 -38 -43 -38 -4 0 -25 17 -46 38 l-38 37 -39 -48z m247
                -306 c90 -62 133 -195 91 -286 -63 -140 -241 -177 -363 -74 -71 60 -99 139
                -84 234 27 168 208 255 356 126z"/>
                <path d="M2475 1664 c-11 -3 -49 -21 -84 -40 -36 -20 -70 -34 -78 -31 -7 2
                -102 2 -210 0 -167 -4 -204 -7 -238 -24 -24 -11 -48 -33 -61 -54 l-24 -36 0
                -379 0 -380 25 -36 c14 -21 39 -43 60 -53 33 -17 63 -19 330 -19 267 0 297 2
                330 19 21 10 46 32 60 53 l25 36 0 375 c0 217 -4 388 -10 406 -20 60 -50 95
                -95 112 -32 12 -86 23 -122 25 -36 3 -70 7 -76 11 -13 7 14 103 37 129 37 42
                99 49 249 27 l119 -17 19 24 c10 12 19 33 19 46 0 24 -7 28 -145 94 -123 58
                -78 53 -130 12z m5 -273 c17 -9 19 -22 22 -128 l3 -118 -25 -3 c-14 -2 -97
                -2 -185 0 l-160 3 -3 71 c-5 114 -3 128 26 151 l26 21 139 4 c91 2 145 -1
                157 -9z m-240 -401 l0 -70 -105 0 -105 0 0 70 0 70 105 0 105 0 0 -70z m255
                -1 l0 -70 -102 3 -103 3 -3 68 -3 67 106 0 105 0 0 -71z m-255 -204 l0 -75
                -105 0 -105 0 0 75 0 75 105 0 105 0 0 -75z m260 5 l0 -70 -105 0 -105 0 0
                70 0 70 105 0 105 0 0 -70z"/>
                <path d="M3575 1630 c-89 -20 -228 -101 -262 -153 -13 -20 -14 -28 -3 -50 16
                -33 67 -50 105 -34 15 6 67 39 117 73 61 42 112 69 152 81 54 15 73 16 136 6
                107 -16 173 -66 209 -158 15 -39 38 -69 94 -125 41 -40 83 -89 94 -107 26
                -45 29 -131 5 -178 -39 -78 -152 -118 -262 -94 -107 24 -193 98 -233 201 -24
                60 -52 88 -87 88 -38 0 -80 -42 -80 -80 0 -137 111 -294 260 -369 106 -53
                217 -73 337 -61 84 8 96 13 176 58 102 59 173 152 192 252 21 111 -2 193 -84
                298 -28 35 -82 95 -121 134 -99 98 -124 166 -85 227 42 66 154 67 229 4 68
                -58 103 -56 147 6 33 48 21 68 -71 116 -95 50 -150 65 -260 70 -55 3 -119 0
                -155 -5z"/>
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

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Link 
                        href="/forgot-password" 
                        className="text-xs text-primary hover:underline"
                      >
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

                  <SubmitButton 
                    pendingText="Signing In..." 
                    className="w-full"
                  >
                    Sign in
                  </SubmitButton>

                  <FormMessage message={searchParams} />
                
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
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
