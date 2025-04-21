// __tests__/OnboardingPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from '@supabase/supabase-js';
import OnboardingPage from "@/app/onboarding/page";
import { toast } from "sonner";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/utils/supabase/client", () => ({
  createClient: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));
jest.mock("@/utils/supabase/onboarding", () => ({
  createLicense: jest.fn(),
  createVehicle: jest.fn(),
  updateOnboardingStatus: jest.fn(),
  uploadFile: jest.fn(),
}));

describe("OnboardingPage", () => {
  const mockRouter = { 
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  };
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
      updateUser: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }),
    // Required base properties
    supabaseUrl: 'http://localhost:54321',
    supabaseKey: 'dummy-key',
    realtime: { connect: jest.fn() },
    realtimeUrl: 'http://localhost:54321',
    rest: { headers: {} },
    // Additional required properties
    functions: { invoke: jest.fn() },
    storage: { from: jest.fn() },
    schema: '',
    rpc: jest.fn(),
    removeChannel: jest.fn(),
    removeAllChannels: jest.fn(),
    getChannels: jest.fn(),
    channel: jest.fn(),
  } as unknown as SupabaseClient;

  beforeEach(() => {
    jest.mocked(useRouter).mockReturnValue(mockRouter);
    jest.mocked(createClient).mockReturnValue(mockSupabase);
    jest.clearAllMocks();
  });

  it("redirects to sign-in if user is not authenticated", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null }, error: new Error("Unauthorized") });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please sign in to continue.");
      expect(mockRouter.push).toHaveBeenCalledWith("/sign-in");
    });
  });

  it("renders loading state initially", () => {
    render(<OnboardingPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: /loading/i })).toHaveAttribute("aria-live", "polite");
  });

  it("fetches user data and renders MultiStepForm", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    const mockSingle = jest.fn().mockResolvedValue({
      data: { role: null, onboarding_step: null },
      error: null,
    });
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: mockSingle,
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByText("Select Your Role")).toBeInTheDocument();
      expect(screen.getByText("Choose your role in the waste management chain")).toBeInTheDocument();
    });
  });

  it("shows error toast on failed user data fetch", async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: new Error("Profile not found") });
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: mockSingle,
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load user data. Please try again.");
    });
  });
});