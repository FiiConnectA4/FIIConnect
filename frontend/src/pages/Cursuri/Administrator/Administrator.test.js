import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Administrator from "./Administrator";

jest.mock("../Components/Ceas", () => () => <div data-testid="ceas-component">Ceas Mock</div>);
jest.mock("../Components/Carte", () => () => <div data-testid="carte-component">Carte Mock</div>);
jest.mock("../Components/Buton", () => ({ text, onNavigate }) => (
    <button onClick={onNavigate}>{text}</button>
));
jest.mock("../Components/PageControl", () => ({ id, title, description, professorId }) => (
    <div data-testid="page-control">
        <p>{title}</p>
    </div>
));
jest.mock("../Profesor/PDetaliiCurs", () => ({ curs, onBack }) => (
    <div>
        <h1>{curs.title}</h1>
        <button onClick={onBack}>Back</button>
    </div>
));

describe("Administrator Component", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders loading state initially", () => {
        render(<Administrator />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("renders course list after loading", async () => {
        const mockCourses = [
            { id: 1, title: "Matematică", description: "Curs de matematică", professorId: 101 },
            { id: 2, title: "Fizică", description: "Curs de fizică", professorId: 102 },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ _embedded: { courseList: mockCourses } }),
        });

        render(<Administrator />);

        await waitFor(() => expect(screen.getByText("Matematică")).toBeInTheDocument());
        expect(screen.getByText("Fizică")).toBeInTheDocument();
    });

    test("navigates to course details when a course button is clicked", async () => {
        const mockCourses = [
            { id: 1, title: "Matematică", description: "Curs de matematică", professorId: 101 },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ _embedded: { courseList: mockCourses } }),
        });

        render(<Administrator />);

        await waitFor(() => expect(screen.getByText("Matematică")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Matematică"));
        expect(screen.getByText("Matematică")).toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
    });

    test("returns to course list when back button is clicked", async () => {
        const mockCourses = [
            { id: 1, title: "Matematică", description: "Curs de matematică", professorId: 101 },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ _embedded: { courseList: mockCourses } }),
        });

        render(<Administrator />);

        await waitFor(() => expect(screen.getByText("Matematică")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Matematică"));
        fireEvent.click(screen.getByText("Back"));

        expect(screen.getByText("Administrare Cursuri")).toBeInTheDocument();
        expect(screen.getByText("Matematică")).toBeInTheDocument();
    });

    test("renders error message when fetch fails", async () => {
        global.fetch.mockRejectedValueOnce(new Error("Eroare la încărcarea cursurilor"));

        render(<Administrator />);

        await waitFor(() => expect(screen.getByText("Nu există cursuri disponibile.")).toBeInTheDocument());
    });
});