import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'; // Change to live when ready
// Define types for the API key data
interface ApiKey {
  consumer_key: string;
  consumer_secret: string;
  provider: string;
}
// Define type for M-Pesa auth response
interface MpesaAuthResponse {
  access_token: string;
  expires_in: string;
}
// Define error response type
interface ErrorResponse {
  error: string;
}
export async function GET(request: Request): Promise<NextResponse<MpesaAuthResponse | ErrorResponse>> {
    try {
        // Initialize Supabase client
        const supabase = createClient();

    // Fetch API credentials from Supabase
    const { data, error } = await (await supabase)
        .from('api_keys')
        .select('*')
        .eq('provider', 'mpesa')
        .single();
    
    if (error) throw new Error(error.message);
    
    const { consumer_key, consumer_secret } = data as ApiKey;
    
    // Get authentication token using fetch
    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    const response = await fetch(
        `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
            method: 'GET',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json() as MpesaAuthResponse;
    
    return NextResponse.json({ access_token: responseData.access_token, expires_in: responseData.expires_in });
} catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
}

}

