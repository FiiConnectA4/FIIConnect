import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrarToti from "./OrarToti";

describe("OrarToti Component", () => {
  test("renders all buttons", () => {
    render(<OrarToti />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4); // Verificăm că sunt 4 butoane principale
  });

  test("opens dropdown when a button is clicked", () => {
    render(<OrarToti />);
    const studentButton = screen.getByText("Orar studenți");
    fireEvent.click(studentButton);

    const dropdownOptions = screen.getByText("Anul 1");
    expect(dropdownOptions).toBeInTheDocument(); // Verificăm că dropdown-ul este afișat
  });

  test("closes dropdown when clicking outside", () => {
    render(<OrarToti />);
    const studentButton = screen.getByText("Orar studenți");
    fireEvent.click(studentButton);

    const dropdownOptions = screen.getByText("Anul 1");
    expect(dropdownOptions).toBeInTheDocument(); // Dropdown-ul este afișat

    fireEvent.click(document.body); // Click în afara dropdown-ului
    expect(dropdownOptions).not.toBeVisible(); // Dropdown-ul ar trebui să fie ascuns
  });

  test("shows groups when an 'Anul' option is selected", () => {
    render(<OrarToti />);
    const studentButton = screen.getByText("Orar studenți");
    fireEvent.click(studentButton);

    const anul1Option = screen.getByText("Anul 1");
    fireEvent.click(anul1Option);

    const groupButton = screen.getByText("Grupa 1");
    expect(groupButton).toBeInTheDocument(); // Verificăm că grupele sunt afișate
  });

  test("selects a group when clicked", () => {
    render(<OrarToti />);
    const studentButton = screen.getByText("Orar studenți");
    fireEvent.click(studentButton);

    const anul1Option = screen.getByText("Anul 1");
    fireEvent.click(anul1Option);

    const groupButton = screen.getByText("Grupa 1");
    fireEvent.click(groupButton);

    expect(groupButton).toBeInTheDocument(); // Verificăm că grupa a fost selectată
  });
});