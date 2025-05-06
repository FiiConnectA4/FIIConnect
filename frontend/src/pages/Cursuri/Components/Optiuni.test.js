import { render, screen, fireEvent } from "@testing-library/react";
import Optiuni from "./Optiuni";

describe("Optiuni Component", () => {
    test("renders delete button with correct image", () => {
        render(<Optiuni />);
        const deleteButton = screen.getByAltText("Delete icon");
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveAttribute("src", "/Delete.png");
    });

    test("renders download button with correct image", () => {
        render(<Optiuni />);
        const downloadButton = screen.getByAltText("Download icon");
        expect(downloadButton).toBeInTheDocument();
        expect(downloadButton).toHaveAttribute("src", "/Archive.png");
    });

    test("calls handleDelete when delete button is clicked", () => {
        const consoleSpy = jest.spyOn(console, "log");
        render(<Optiuni />);
        const deleteButton = screen.getByAltText("Delete icon").closest("button");
        fireEvent.click(deleteButton);
        expect(consoleSpy).toHaveBeenCalledWith("Șterge ceva...");
        consoleSpy.mockRestore();
    });

    test("calls handleDownload when download button is clicked", () => {
        const consoleSpy = jest.spyOn(console, "log");
        render(<Optiuni />);
        const downloadButton = screen.getByAltText("Download icon").closest("button");
        fireEvent.click(downloadButton);
        expect(consoleSpy).toHaveBeenCalledWith("Descarcă ceva...");
        consoleSpy.mockRestore();
    });
});