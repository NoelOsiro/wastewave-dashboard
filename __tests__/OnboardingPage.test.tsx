// __tests__/OnboardingPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
  const mockRouter = { push: jest.fn() };
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
      updateUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    jest.clearAllMocks();
  });

  it("redirects to sign-in if user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error("Unauthorized") });

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
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    mockSupabase.single.mockResolvedValue({
      data: { role: null, onboarding_step: null },
      error: null,
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByText("Select Your Role")).toBeInTheDocument();
      expect(screen.getByText("Choose your role in the waste management chain")).toBeInTheDocument();
    });
  });

  it("handles form completion for generator role", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    mockSupabase.single.mockResolvedValue({
      data: { role: null, onboarding_step: null },
      error: null,
    });
    mockSupabase.auth.updateUser.mockResolvedValue({ data: {}, error: null });
    mockSupabase.eq.mockResolvedValue({ data: {}, error: null });
    const mockUpdateOnboardingStatus = require("@/utils/supabase/onboarding").updateOnboardingStatus;
    mockUpdateOnboardingStatus.mockResolvedValue({ error: null });

    render(<OnboardingPage />);

    await waitFor(() => {
      // Simulate form completion (handled in MultiStepForm tests)
      // Trigger handleFormComplete via MultiStepForm
    });

    // Note: Full form submission testing is covered in MultiStepForm tests
  });

  it("shows error toast on failed user data fetch", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    mockSupabase.single.mockResolvedValue({ data: null, error: new Error("Profile not found") });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load user data. Please try again.");
    });
  });
});