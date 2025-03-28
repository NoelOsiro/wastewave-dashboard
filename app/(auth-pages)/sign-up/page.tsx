
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Mail, Lock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="p-8 flex-1 flex flex-col justify-center items-center order-2 md:order-1">
          <div className="w-full max-w-md">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold">Create an account</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sign up to get started with our platform
                    </p>
                  </div>

                  <form className="space-y-4" action={signUpAction}>
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
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="password" 
                          name="password" 
                          type="password" 
                          placeholder="Create a strong password" 
                          className="pl-10" 
                          minLength={6}
                          required 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters
                      </p>
                    </div>

                    <SubmitButton 
                      formAction={signUpAction} 
                      pendingText="Signing up..." 
                      className="w-full"
                    >
                      Sign up
                    </SubmitButton>

                    <FormMessage message={searchParams} />
                  
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link className="text-primary hover:underline font-medium" href="/sign-in">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="bg-gradient-to-bl from-primary-foreground/5 to-primary/30 p-10 flex-1 flex flex-col items-center justify-center text-foreground relative overflow-hidden order-1 md:order-2">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-180">
              <path fill="currentColor" d="M44.5,-76.3C59.3,-69.7,74,-60.5,83.1,-47.1C92.2,-33.6,95.7,-16.8,94.9,-0.5C94.1,15.9,89,31.7,79.8,44.7C70.6,57.6,57.3,67.7,42.5,74.3C27.7,80.9,11.4,84.1,-3.9,80.7C-19.1,77.3,-33.1,67.3,-47.3,57.7C-61.5,48.1,-75.8,38.8,-82.2,25.3C-88.5,11.7,-86.9,-6.1,-80.9,-21.1C-74.9,-36.1,-64.6,-48.2,-51.5,-57C-38.5,-65.8,-22.8,-71.3,-6.5,-72.3C9.8,-73.3,29.6,-82.9,44.5,-76.3Z" transform="translate(100 100) scale(1.2)" />
            </svg>
          </div>
          
          <div className="z-10 max-w-md text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Create an account to access exclusive features and start managing your properties efficiently.
            </p>
            <div className="hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-64 h-64 mx-auto">
                <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                  <path d="M2380 4994 c-19 -2 -84 -9 -145 -14 -579 -56 -1128 -339 -1536 -792
                  -115 -128 -297 -402 -358 -538 -26 -60 -63 -127 -81 -150 -42 -53 -107 -180
                  -166 -325 -59 -145 -59 -145 -59 -270 0 -111 2 -128 30 -195 17 -41 46 -97
                  65 -125 63 -94 217 -235 310 -285 224 -120 233 -123 425 -125 153 -2 184 0
                  248 19 110 32 235 92 325 157 103 74 178 150 302 309 247 314 418 460 652
                  558 67 28 145 55 173 60 29 5 89 24 135 42 46 17 132 46 190 64 194 60 227
                  93 222 222 -2 50 -9 74 -38 125 -48 85 -135 190 -199 241 -28 22 -79 66
                  -114 97 -35 31 -111 81 -171 111 -59 30 -139 80 -176 111 -174 143 -281 211
                  -424 269 -126 51 -239 78 -390 96 -82 9 -176 12 -220 8z"/>
                  <path d="M2800 4984 c0 -3 15 -21 33 -41 l32 -36 83 6 c122 10 374 -23 514
                  -67 327 -103 653 -316 863 -566 98 -116 255 -352 255 -383 0 -5 -40 -45 -90
                  -87 -49 -43 -90 -82 -90 -86 0 -5 -10 -16 -22 -25 -23 -16 -19 -17 128 -29
                  83 -7 166 -16 185 -21 19 -5 94 -18 167 -30 l132 -22 2 36 c7 125 -99 393
                  -243 613 -269 413 -709 708 -1183 794 -115 21 -161 25 -335 28 -113 3 -231
                  -1 -262 -8 -32 -7 -105 -40 -169 -76 l-115 -66 60 -7 c33 -4 82 -13 110 -20
                  27 -8 51 -14 53 -14 2 0 -2 10 -9 23 -7 13 -9 27 -5 31 11 10 -29 37 -62 42
                  -16 2 -32 1 -32 -3z"/>
                  <path d="M2320 4939 c-364 -36 -668 -131 -965 -304 -353 -207 -628 -494 -823
                  -861 -81 -152 -90 -180 -60 -194 51 -24 204 -40 345 -36 l82 2 -3 -38 c-2
                  -20 0 -39 3 -42 10 -10 113 22 157 50 22 14 53 30 67 35 37 14 119 106 193
                  218 33 50 90 126 126 170 65 80 68 81 68 47 0 -56 -81 -238 -165 -371 -97
                  -154 -135 -247 -135 -330 0 -33 2 -85 5 -114 l5 -54 57 6 c32 4 128 9 213
                  12 85 3 230 10 321 16 91 5 204 12 251 14 84 3 84 4 112 40 16 21 45 53 66
                  71 l38 34 -7 -55 c-3 -30 -9 -139 -12 -242 -4 -103 -11 -262 -16 -353 -5
                  -91 -14 -255 -19 -365 -10 -184 -14 -202 -41 -260 -27 -60 -30 -75 -35 -201
                  -4 -129 -3 -141 23 -219 15 -45 29 -85 31 -89 2 -3 27 -13 56 -22 105 -30
                  155 -12 248 91 22 25 58 63 79 84 22 20 39 41 39 45 0 9 -89 135 -99 140 -2
                  1 -20 -9 -39 -22 -20 -14 -42 -25 -49 -25 -7 0 -13 -4 -13 -9 0 -5 -9 -11
                  -19 -14 -30 -8 -40 9 -45 75 -5 63 1 66 168 88 39 5 93 12 120 15 28 3 84
                  10 125 16 78 10 76 10 120 -46 l25 -33 -35 -11 c-19 -7 -52 -15 -72 -18 -40
                  -8 -39 -9 19 -93 l27 -39 41 32 c61 46 95 57 139 47 21 -5 40 -10 43 -10 3
                  0 14 26 26 58 41 109 38 219 -11 363 -23 68 -29 100 -29 172 -1 80 1 91 28
                  132 32 50 114 115 148 119 27 3 23 19 -15 55 -39 38 -31 37 -138 30 -56 -3
                  -73 -1 -77 10 -3 8 -30 42 -60 75 -57 65 -66 86 -38 86 10 0 75 -34 145 -75
                  232 -137 307 -175 310 -157 12 61 85 112 156 112 55 0 119 -62 119 -115 0
                  -40 -50 -102 -99 -124 -40 -18 -50 -19 -85 -8 -37 10 -41 9 -58 -14 -11 -14
                  -33 -32 -50 -40 -18 -8 -46 -34 -64 -58 -34 -45 -74 -131 -74 -157 0 -15 48
                  -70 107 -123 66 -58 95 -72 198 -96 47 -11 93 -39 125 -75 14 -17 51 -45 82
                  -62 92 -50 114 -88 128 -218 10 -85 9 -88 -23 -173 -30 -77 -33 -93 -27
                  -152 9 -82 32 -126 96 -184 42 -38 54 -56 52 -78 -1 -23 -9 -32 -43 -48 -23
                  -12 -47 -31 -54 -43 -11 -21 -9 -28 20 -63 l31 -39 71 0 c50 0 72 4 72 13 0
                  7 -16 34 -35 61 -43 58 -40 96 9 96 17 0 48 11 69 25 20 14 41 25 47 25 5 0
                  19 -33 31 -73 25 -86 16 -101 -62 -102 -24 0 -66 -10 -94 -22 -53 -23 -52
                  -22 -31 -62 8 -15 16 -57 18 -94 l2 -67 -169 0 -170 0 -44 51 c-23 28 -45
                  58 -47 67 -3 12 9 16 64 20 l68 5 -40 38 c-22 21 -48 39 -57 39 -47 0 -192
                  -67 -203 -94 -9 -23 -7 -26 25 -39 23 -9 65 -13 116 -11 l80 2 7 -49 c4 -27
                  10 -54 15 -60 4 -5 33 -9 64 -7 l55 3 -3 -102 -3 -103 -54 0 c-30 0 -68 7
                  -85 15 -17 9 -33 13 -35 11 -3 -2 7 -32 21 -66 l25 -63 37 7 c21 3 57 6 82
                  6 l45 0 0 -205 0 -205 45 0 45 0 0 203 c0 111 4 207 8 212 9 14 112 2 112
                  -13 0 -15 107 -142 115 -136 11 6 85 146 85 159 0 7 -15 9 -35 7 -28 -3 -40
                  1 -65 25 l-30 28 0 96 0 97 38 21 c20 11 48 21 61 21 22 0 23 -3 18 -50 -4
                  -43 -2 -50 14 -55 37 -11 162 -17 172 -8 39 39 111 145 107 158 -2 8 -31 36
                  -64 62 -65 51 -156 148 -156 167 0 15 43 22 73 13 16 -5 27 0 44 22 12 15
                  34 32 49 38 30 11 70 1 89 -22 9 -11 30 -15 67 -15 l55 0 15 30 c18 36 12
                  95 -14 130 -16 21 -17 26 -4 45 8 12 21 47 30 78 l15 58 57 -67 c31 -37 77
                  -96 101 -131 46 -66 79 -95 76 -67 -1 10 -5 71 -8 138 -5 110 -9 129 -40
                  198 -19 41 -38 97 -42 125 -10 55 4 93 45 118 25 15 32 15 75 0 26 -9 47
                  -13 47 -9 0 4 18 1 40 -6 l40 -12 0 78 c0 144 -53 255 -175 369 -44 41 -87
                  77 -96 81 -9 3 -56 30 -105 59 -83 49 -89 51 -89 30 0 -33 -19 -53 -112
                  -119 -48 -35 -95 -69 -105 -77 -75 -58 -123 -90 -123 -83 0 5 9 29 19 53 30
                  69 17 108 -63 188 -22 23 -36 44 -32 48 14 14 125 30 272 40 163 11 245 7
                  297 -14 16 -7 52 -32 81 -56 98 -83 177 -224 203 -361 l13 -67 44 -6 c24 -4
                  47 -11 52 -17 5 -5 22 -10 38 -10 43 0 46 17 21 116 -11 47 -25 96 -31 109
                  -5 14 -22 59 -38 102 -16 42 -34 79 -40 81 -5 2 -36 34 -67 71 -51 60 -65
                  70 -116 86 -67 21 -100 47 -98 78 1 12 2 27 3 34 0 6 21 -1 47 -17 54 -33
                  104 -35 160 -4 101 56 130 170 72 283 -25 48 -31 70 -27 98 4 28 10 35 26
                  35 32 0 69 32 84 71 11 29 10 40 -6 77 -34 77 -22 172 13 102 11 -21 19 -52
                  19 -72 -1 -22 6 -43 18 -56 12 -14 20 -39 21 -66 l1 -44 57 -7 c146 -17 232
                  -69 232 -138 0 -113 -166 -257 -301 -261 -61 -2 -70 8 -63 67 5 36 2 52 -12
                  73 -24 35 -75 64 -107 61 -14 -2 -48 11 -81 30 -32 18 -70 37 -85 43 -22 8
                  -38 5 -87 -17 -33 -15 -78 -30 -101 -34 l-41 -7 -36 53 c-22 34 -52 63 -79
                  77 -41 22 -44 26 -38 53 5 24 22 44 71 83 114 93 168 113 329 125 79 6 162
                  15 185 22 46 12 60 8 78 -25 12 -21 20 -24 53 -20 21 3 41 10 44 16 16 25
                  -72 141 -143 187 -19 12 -43 31 -53 43 -10 11 -54 34 -97 51 -44 17 -106 49
                  -139 71 -32 22 -71 47 -85 55 -51 30 -133 121 -175 196 -41 72 -58 90 -58
                  62 0 -6 -16 -39 -36 -73 -44 -76 -135 -164 -208 -201 -59 -30 -115 -41 -199
                  -38 -59 2 -60 2 -47 25 7 13 17 55 21 93 6 70 27 129 68 193 12 19 21 53 25
                  95 l6 65 84 83 c95 93 202 176 330 256 76 47 211 112 293 141 34 12 82 32
                  105 44 24 12 63 30 88 40 25 9 52 21 60 25 8 4 69 21 135 37 83 21 160 49
                  235 86 61 30 134 63 163 74 28 10 52 22 52 25 0 4 -24 21 -52 39 -29 18 -80
                  51 -113 74 -33 22 -62 41 -65 41 -6 0 -103 -73 -190 -143 -64 -52 -70 -55
                  -70 -32 0 38 44 128 108 220 57 82 172 198 214 217 59 26 33 22 -235 -28
                  -71 -13 -202 -47 -291 -75 -211 -68 -347 -128 -499 -223 -253 -157 -425
                  -315 -581 -534 -116 -163 -259 -461 -295 -613 -64 -274 -66 -533 -7 -733 32
                  -108 44 -179 43 -253 -1 -105 -31 -189 -148 -418 -123 -239 -125 -242 -134
                  -218 -18 46 -75 146 -128 223 -81 118 -108 193 -142 404 -44 272 -20 565 74
                  887 65 224 114 335 214 483 151 224 334 411 558 569 149 104 363 222 435 238
                  11 2 64 16 117 30 178 48 365 67 578 58 l90 -4 -75 13 c-41 7 -142 12 -225
                  11 -82 -2 -162 -3 -176 -2 -23 1 -25 3 -15 18 7 10 18 17 25 17 7 0 13 4 13
                  9 0 5 -14 11 -31 15 -16 3 -67 5 -112 4 -45 -1 -106 -5 -137 -9z"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <SmtpMessage />
    </>
  );
}
