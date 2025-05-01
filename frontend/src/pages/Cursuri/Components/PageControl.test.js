import { render, screen, fireEvent } from "@testing-library/react";
import PageControl from "./PageControl";
import Optiuni from "./Optiuni";

jest.mock("./Optiuni", () => () => <div data-testid="optiuni-component">Optiuni Component</div>);

describe("PageControl Component", () => {
    test("renders dots button with correct aria-label", () => {
        render(<PageControl />);
        const buttonElement = screen.getByRole("button", { name: "Menu" });
        expect(buttonElement).toBeInTheDocument();
    });

    test("toggles visibility of Optiuni component when button is clicked", () => {
        render(<PageControl />);
        const buttonElement = screen.getByRole("button", { name: "Menu" });

        // Inițial, Optiuni nu este afișat
        expect(screen.queryByTestId("optiuni-component")).not.toBeInTheDocument();

        // Click pe buton pentru a afișa Optiuni
        fireEvent.click(buttonElement);
        expect(screen.getByTestId("optiuni-component")).toBeInTheDocument();

        // Click pe buton pentru a ascunde Optiuni
        fireEvent.click(buttonElement);
        expect(screen.queryByTestId("optiuni-component")).not.toBeInTheDocument();
    });

    test("applies correct aria-label to the button", () => {
        render(<PageControl ariaLabel="Custom Menu" />);
        const buttonElement = screen.getByRole("button", { name: "Custom Menu" });
        expect(buttonElement).toBeInTheDocument();
    });
});