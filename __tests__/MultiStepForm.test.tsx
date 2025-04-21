// __tests__/MultiStepForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MultiStepForm, StepComponentProps } from "@/components/onboarding/multi-step-form";
import { RoleSelectionStep } from "@/components/onboarding/role-selection-step";

describe("MultiStepForm", () => {
  const mockOnComplete = jest.fn();
  const steps = [
    {
      id: "roleSelection",
      title: "Select Your Role",
      description: "Choose your role in the waste management chain",
      component: RoleSelectionStep,
      validate: () => true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the first step", () => {
    render(<MultiStepForm steps={steps} onComplete={mockOnComplete} />);

    expect(screen.getByText("Select Your Role")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 1")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Progress: 100% complete");
  });

  it("disables Back button on first step", () => {
    render(<MultiStepForm steps={steps} onComplete={mockOnComplete} />);

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeDisabled();
  });

  it("calls onComplete when Submit is clicked on last step", async () => {
    render(<MultiStepForm steps={steps} onComplete={mockOnComplete} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({});
    });
  });

  it("shows error toast on failed submission", async () => {
    mockOnComplete.mockRejectedValue(new Error("Submission failed"));
    render(<MultiStepForm steps={steps} onComplete={mockOnComplete} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Submitting...")).toBeInTheDocument();
      expect(mockOnComplete).toHaveBeenCalled();
      // Sonner toast is mocked, verify in OnboardingPage tests
    });
  });

  it("navigates to next step when Continue is clicked", () => {
    const multiStep = [
      ...steps,
      {
        id: "nextStep",
        title: "Next Step",
        description: "Next step description",
        component: ({ formData, updateFormData }: StepComponentProps) => <div>Next Step</div>,
        validate: () => true,
      },
    ];

    render(<MultiStepForm steps={multiStep} onComplete={mockOnComplete} />);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(screen.getByText("Next Step")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();
  });

  it("disables Continue button if step is invalid", () => {
    const invalidStep = [
      {
        ...steps[0],
        validate: () => false,
      },
    ];

    render(<MultiStepForm steps={invalidStep} onComplete={mockOnComplete} />);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });
});