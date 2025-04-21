// __tests__/LicenseVerificationStep.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LicenseVerificationStep } from "@/components/onboarding/license-verification";

describe("LicenseVerificationStep", () => {
  const mockUpdateFormData = jest.fn();
  const initialFormData = {
    file: null,
    licenseNumber: "",
    issuingDate: undefined,
    expiryDate: undefined,
    licenseType: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all fields", () => {
    render(<LicenseVerificationStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    expect(screen.getByLabelText("Upload License Document")).toBeInTheDocument();
    expect(screen.getByLabelText("License Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Issuing Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiry Date")).toBeInTheDocument();
    expect(screen.getByLabelText("License Type")).toBeInTheDocument();
  });

  it("shows validation error when required fields are missing", () => {
    render(<LicenseVerificationStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
  });

  it("updates form data when fields are filled", async () => {
    render(<LicenseVerificationStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    fireEvent.change(screen.getByLabelText("License Number"), {
      target: { value: "NEMA/WM/2023/001" },
    });

    const file = new File(["dummy"], "license.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("Upload License Document").querySelector("input")!, {
      target: { files: [file] },
    });

    // Simulate date picker (mock DatePicker component if needed)
    // For simplicity, assume DatePicker updates state correctly
    fireEvent.change(screen.getByLabelText("License Type"), { target: { value: "transport" } });

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          licenseNumber: "NEMA/WM/2023/001",
          file,
          licenseType: "transport",
        }),
      );
    });
  });

  it("validates file uploads", async () => {
    render(<LicenseVerificationStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    const invalidFile = new File(["dummy"], "license.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("Upload License Document").querySelector("input")!, {
      target: { files: [invalidFile] },
    });

    await waitFor(() => {
      expect(screen.getByText("Please upload a PDF, JPG, or PNG file.")).toBeInTheDocument();
    });
  });
});