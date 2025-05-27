import {  screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateTimePickerField } from "./date-time-picker-field";
import { vi } from "vitest";
import { renderWithForm } from "#scalars/lib/testing";

describe("DateTimePickerField", () => {
  const defaultProps = {
    name: "datetime",
    label: "Date and Time",
    placeholder: "Select date and time",
  };

  it("should match the snapshot", () => {
    const { container } = renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        label="Test Label"
        name="test-date"
        value="2025-01-01T12:00:00.000Z"
        dateFormat="yyyy-MM-dd"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should handle disabled state", () => {
    renderWithForm(<DateTimePickerField {...defaultProps} disabled />);
    
    const input = screen.getByPlaceholderText("Select date and time");
    expect(input).toBeDisabled();
  });

  it("should render with basic props", () => {
    renderWithForm(<DateTimePickerField {...defaultProps} />);
    
    expect(screen.getByPlaceholderText("Select date and time")).toBeInTheDocument();
    expect(screen.getByText("Date and Time")).toBeInTheDocument();
  });

  it("should display error messages from validation", async () => {
    renderWithForm(
      <DateTimePickerField 
        {...defaultProps} 
        required 
        value="" 
      />
    );
    
    const input = screen.getByPlaceholderText("Select date and time");
    await userEvent.click(input);
    await userEvent.tab(); // Trigger blur to show validation

    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("should handle description", () => {
    const description = "Select a date and time for your appointment";
    renderWithForm(<DateTimePickerField {...defaultProps} description={description} />);
    
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("should disable past dates when disablePastDates is true", async () => {
    renderWithForm(
      <DateTimePickerField 
        {...defaultProps}
        disablePastDates
      />
    );

    const calendarButton = screen.getByTestId("icon-fallback").closest("button");
    if (!calendarButton) throw new Error("Calendar button not found");
    await userEvent.click(calendarButton);

    await waitFor(() => {
      const calendar = screen.getByRole("dialog");
      expect(calendar).toBeInTheDocument();
    });

    const dateButtons = screen.getAllByRole("button", {
      name: /^(Today, )?[A-Za-z]+, [A-Za-z]+ \d{1,2}(st|nd|rd|th), \d{4}$/
    });

    const today = new Date();
    dateButtons.forEach(button => {
      const dateStr = button.getAttribute("aria-label");
      if (!dateStr) return;

      const match = dateStr.match(/([A-Za-z]+), ([A-Za-z]+) (\d{1,2})(st|nd|rd|th), (\d{4})/);
      if (!match) return;
      const [, , month, day, , year] = match;
      const buttonDate = new Date(`${month} ${day}, ${year}`);

      if (
        buttonDate.getFullYear() < today.getFullYear() ||
        (buttonDate.getFullYear() === today.getFullYear() && buttonDate.getMonth() < today.getMonth()) ||
        (buttonDate.getFullYear() === today.getFullYear() && buttonDate.getMonth() === today.getMonth() && buttonDate.getDate() < today.getDate())
      ) {
        expect(button).toHaveClass("disabled:pointer-events-none");
      }
    });
  });

  it("should handle required state with validation", async () => {
    renderWithForm(<DateTimePickerField {...defaultProps} required />);
    
    expect(screen.getByText("*")).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText("Select date and time");
    expect(input).toBeRequired();

    // Trigger validation by focusing and blurring
    await userEvent.click(input);
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("should handle different date formats correctly", async () => {
    const onChange = vi.fn();
    renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        dateFormat="dd/MM/yyyy"
        onChange={onChange}
      />
    );

    const input = screen.getByPlaceholderText("Select date and time");
    await userEvent.type(input, "25/12/2024 14:30");

    expect(input).toHaveValue("25/12/2024 14:30");
    
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.type).toBe("change");
    expect(lastCall.target.value).toMatch(/25\/12\/2024T14:30:00\.000[+-]\d{2}:\d{2}/);
  });

  it("should handle time format changes correctly", async () => {
    const onChange = vi.fn();
    renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        timeFormat="hh:mm a"
        onChange={onChange}
      />
    );

    const input = screen.getByPlaceholderText("Select date and time") as HTMLInputElement;
    await userEvent.type(input, "2024-12-25 02:30 PM");

    expect(input.value.trim()).toBe("2024-12-25 02:30");
    
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.type).toBe("change");
    expect(lastCall.target.value).toMatch(/2024-12-25T02:30:00\.000-\d{2}:\d{2}/);
  });

  it("should handle empty input with validation", async () => {
    const onChange = vi.fn();
    renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        required
        onChange={onChange}
      />
    );

    const input = screen.getByPlaceholderText("Select date and time");
    await userEvent.clear(input);
    await userEvent.tab();

    const lastOnChangeCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastOnChangeCall.type).toBe("change");
    expect(lastOnChangeCall.target.value).toBe("");

    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("should validate date format", async () => {
    renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        dateFormat="yyyy-MM-dd"
        value="invalid-date 14:30"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid format. Use Date and Time separated by a space.")).toBeInTheDocument();
    });
  });

  it("should validate time format", async () => {
    renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        value="2024-12-25 invalid-time"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid format. Use Date and Time separated by a space.")).toBeInTheDocument();
    });
  });

  it("should validate min date", async () => {
    const minDate = "2024-12-01";
    renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        minDate={minDate}
        value="2024-11-30 14:30"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(`Date must be after ${minDate}`)).toBeInTheDocument();
    });
  });

  it("should validate max date", async () => {
    const maxDate = "2024-12-31";
    renderWithForm(
      <DateTimePickerField
        {...defaultProps}
        maxDate={maxDate}
        value="2025-01-01 14:30"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(`Date must be before ${maxDate}`)).toBeInTheDocument();
    });
  });
}); 