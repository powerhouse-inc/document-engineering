import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "./date-picker";

describe("DatePicker", () => {
  const defaultProps = {
    name: "test-date",
    label: "Test Date",
  };

  it("should match the snapshot", () => {
    const { container } = render(
      <DatePicker
        label="Test Label"
        name="test-date"
        value="2025-01-01"
        dateFormat="yyyy-MM-dd"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should display the label when provided", () => {
    const labelText = "Test Label";
    render(<DatePicker name="test-date" label={labelText} />);
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it("should render with label", () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByText("Test Date")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should show description when provided", () => {
    const description = "This is a test description";
    render(<DatePicker {...defaultProps} description={description} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("should show error messages when provided", () => {
    const errors = ["Invalid date format"];
    render(<DatePicker {...defaultProps} errors={errors} />);
    expect(screen.getByText("Invalid date format")).toBeInTheDocument();
  });

  it("should show warning messages when provided", () => {
    const warnings = ["Date is in the past"];
    render(<DatePicker {...defaultProps} warnings={warnings} />);
    expect(screen.getByText("Date is in the past")).toBeInTheDocument();
  });

  it("should handle disabled state", () => {
    render(<DatePicker {...defaultProps} disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });
  
  it("should disable dates before minDate", async () => {
    // Arrange: Render component with minDate
    render(
      <DatePicker
        label="Test Label"
        name="test-date"
        minDate="2025-01-16"
      />,
    );

    // Act: Open calendar
    const calendarTrigger = screen.getByTestId("icon-fallback");
    await userEvent.click(calendarTrigger);

    // Assert: Calendar is visible
    const calendar = await screen.findByRole("dialog");
    expect(calendar).toBeInTheDocument();

    // Assert: Date before minDate is disabled
    const dateButton = screen.getByRole("button", {
      name: "Saturday, May 10th, 2025",
    });
    expect(dateButton).toHaveClass("disabled:pointer-events-none");
  });

  it("should disable dates after maxDate", async () => {
    // Arrange: Render component with maxDate
    render(
      <DatePicker
        label="Test Label"
        name="test-date"
        maxDate="2025-05-16"
      />,
    );

    // Act: Open calendar
    const calendarTrigger = screen.getByTestId("icon-fallback");
    await userEvent.click(calendarTrigger);

    // Assert: Calendar is visible
    const calendar = await screen.findByRole("dialog");
    expect(calendar).toBeInTheDocument();

    // Assert: Date after maxDate is disabled
    const dateButton = screen.getByRole("button", {
      name: "Saturday, May 17th, 2025",
    });
    expect(dateButton).toHaveClass("disabled:pointer-events-none");
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("should handle custom date format", async () => {
    // Arrange: Render component with custom date format
    const dateFormat = "DD/MM/YYYY";
    render(<DatePicker {...defaultProps} dateFormat={dateFormat} />);
    
    // Act: Open calendar and select date
    const calendarTrigger = screen.getByTestId("icon-fallback");
    await userEvent.click(calendarTrigger);
    const calendar = await screen.findByRole("dialog");
    const dateButton = screen.getByRole("button", {
      name: "Saturday, May 10th, 2025",
    });
    await userEvent.click(dateButton);
    
    // Assert: Input value matches custom format
    const input = screen.getByRole("textbox") as HTMLInputElement;
    await waitFor(() => {
      expect(input.value).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  it("should close calendar when clicking outside", async () => {
    // Arrange: Render component
    render(<DatePicker {...defaultProps} />);
    
    // Act: Open calendar and click outside
    const calendarTrigger = screen.getByTestId("icon-fallback");
    await userEvent.click(calendarTrigger);
    const calendar = await screen.findByRole("dialog");
    await userEvent.click(document.body);
    
    // Assert: Calendar is closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should handle manual date input", async () => {
    // Arrange: Render component
    render(<DatePicker {...defaultProps} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    
    // Act: Type date manually
    await userEvent.type(input, "2024-03-20");
    
    // Assert: Input has correct value
    expect(input.value).toBe("2024-03-20");
  });

  it("should open calendar when clicking the input", async () => {
    // Arrange: Render component
    render(<DatePicker {...defaultProps} />);
    
    // Act: Click calendar button
    const calendarButton = screen.getByTestId("icon-fallback").closest("button");
    await userEvent.click(calendarButton!);
    
    // Assert: Calendar is visible with grid
    const calendar = await screen.findByRole("dialog");
    expect(calendar).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    
    // Act: Click outside
    await userEvent.click(document.body);
    
    // Assert: Calendar is closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should handle autoClose prop", async () => {
    // Arrange: Render component with autoClose
    render(<DatePicker {...defaultProps} autoClose />);
    
    // Act: Open calendar and select date
    const calendarButton = screen.getByTestId("icon-fallback").closest("button");
    await userEvent.click(calendarButton!);
    const calendar = await screen.findByRole("dialog");
    const dateButton = screen.getByRole("button", {
      name: "Saturday, May 10th, 2025",
    });
    await userEvent.click(dateButton);
    
    // Assert: Calendar closes automatically
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should handle weekStart prop", async () => {
    // Arrange: Render component with weekStart
    render(<DatePicker {...defaultProps} weekStart="Monday" />);
    
    // Act: Open calendar
    const calendarTrigger = screen.getByTestId("icon-fallback");
    await userEvent.click(calendarTrigger);
    const calendar = await screen.findByRole("dialog");
    
    // Assert: Weekday headers are in correct order
    const weekdayHeaders = screen.getAllByRole("columnheader", { hidden: true });
    const weekdays = weekdayHeaders.map(header => header.textContent);
    expect(weekdays).toEqual(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);
  });
}); 