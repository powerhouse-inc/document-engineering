import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderWithForm } from "../../lib/testing.js";
import { DatePickerField } from "./date-picker-field.js";

describe("DatePickerField", () => {
  it("should match the snapshot", () => {
    const { container } = renderWithForm(
      <DatePickerField
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
    renderWithForm(<DatePickerField name="test-date" label={labelText} />);
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it("should not render the label when label prop is not provided", () => {
    renderWithForm(<DatePickerField name="test-date" />);
    expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
  });

  it("should mark the label as required when required prop is true", () => {
    renderWithForm(
      <DatePickerField name="test-date" label="Test Label" required />,
    );
    const label = screen.getByText("Test Label");
    const asterisk = screen.getByText("*");
    expect(label).toBeInTheDocument();
    expect(asterisk).toBeInTheDocument();
  });

  it("should mark the label as disabled when disabled prop is true", () => {
    renderWithForm(
      <DatePickerField name="test-date" label="Test Label" disabled />,
    );
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("cursor-not-allowed");
    expect(label).toHaveClass("text-gray-700");
  });

  it("should disable dates before minDate", async () => {
    renderWithForm(
      <DatePickerField
        label="Test Label"
        name="test-date"
        minDate="2025-01-16"
      />,
    );

    // 1. Find and click the calendar button to open it
    const calendarTrigger = screen.getByTestId("icon-fallback");
    await userEvent.click(calendarTrigger);

    // 2. Wait for the calendar dialog to be visible
    const calendar = await screen.findByRole("dialog");
    expect(calendar).toBeInTheDocument();

    // 3. Find a date button before minDate
    const dateButton = screen.getByRole("button", {
      name: "Saturday, May 10th, 2025",
    });

    // 4. Check that the date button is disabled
    expect(dateButton).toHaveClass("disabled:pointer-events-none");
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");

  });

  it("should disable dates after maxDate", async () => {
    renderWithForm(
      <DatePickerField
        label="Test Label"
        name="test-date"
        maxDate="2025-05-16"
      />,
    );

    // 1. Find and click the calendar button to open it
    const calendarTrigger = screen.getByTestId("icon-fallback");
    await userEvent.click(calendarTrigger);

    // 2. Wait for the calendar dialog to be visible
    const calendar = await screen.findByRole("dialog");
    expect(calendar).toBeInTheDocument();

    // 3. Find a date button after maxDate
    const dateButton = screen.getByRole("button", {
      name: "Saturday, May 17th, 2025",
    });

    // 4. Check that the date button is disabled
    expect(dateButton).toHaveClass("disabled:pointer-events-none");
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("should show error when date is before minDate", async () => {
    renderWithForm(
      <DatePickerField
        label="Test Label"
        name="test-date"
        minDate="2025-05-16"
        showErrorOnBlur
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "2025-05-10");
    await userEvent.tab();

    expect(screen.getByText(/Date must be after/i)).toBeInTheDocument();
  });

  it("should show error when date is after maxDate", async () => {
    renderWithForm(
      <DatePickerField
        label="Test Label"
        name="test-date"
        maxDate="2025-01-16"
        showErrorOnBlur
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "2025-01-20");
    await userEvent.tab();

    expect(screen.getByText(/Date must be before/i)).toBeInTheDocument();
  });
});
