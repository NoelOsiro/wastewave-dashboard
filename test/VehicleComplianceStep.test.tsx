// __tests__/VehicleComplianceStep.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VehicleComplianceStep } from "@/components/onboarding/vehicle-compliance";

describe("VehicleComplianceStep", () => {
  const mockUpdateFormData = jest.fn();
  const initialFormData = {
    vehicleReg: "",
    vehicleType: "",
    vehicleCapacity: "",
    labelPhoto: null,
    sealingPhoto: null,
    routes: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tabs and fields", () => {
    render(<VehicleComplianceStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    expect(screen.getByText("Vehicle Details")).toBeInTheDocument();
    expect(screen.getByText("Compliance Photos")).toBeInTheDocument();
    expect(screen.getByText("Approved Routes")).toBeInTheDocument();
    expect(screen.getByLabelText("Vehicle Registration Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Vehicle Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Approved Collection Routes")).toBeInTheDocument();
  });

  it("shows validation error when required fields are missing", () => {
    render(<VehicleComplianceStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
  });

  it("updates form data when fields are filled", async () => {
    render(<VehicleComplianceStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    fireEvent.change(screen.getByLabelText("Vehicle Registration Number"), {
      target: { value: "KBZ 123A" },
    });
    fireEvent.change(screen.getByLabelText("Vehicle Type"), { target: { value: "Truck" } });
    fireEvent.change(screen.getByLabelText("Approved Collection Routes"), {
      target: { value: "Nairobi CBD" },
    });

    const file = new File(["dummy"], "label.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Upload vehicle label photo").querySelector("input")!, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleReg: "KBZ 123A",
          vehicleType: "Truck",
          routes: "Nairobi CBD",
          labelPhoto: file,
        }),
      );
    });

    expect(screen.queryByText(/Please fill in all required fields/i)).not.toBeInTheDocument();
  });

  it("validates file uploads", async () => {
    render(<VehicleComplianceStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    const invalidFile = new File(["dummy"], "label.txt", { type: "text/plain" });
    fireEvent.change(screen.getByLabelText("Upload vehicle label photo").querySelector("input")!, {
      target: { files: [invalidFile] },
    });

    await waitFor(() => {
      expect(screen.getByText("Please upload a JPG, PNG, or HEIF file.")).toBeInTheDocument();
    });
  });

  it("switches tabs correctly", () => {
    render(<VehicleComplianceStep formData={initialFormData} updateFormData={mockUpdateFormData} />);

    fireEvent.click(screen.getByText("Compliance Photos"));
    expect(screen.getByLabelText("NEMA Required Labels")).toBeVisible();
  });
});