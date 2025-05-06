import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profesor from "../Profesor/Profesor";

describe("Profesor Component", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders loading state initially", () => {
        render(
            <MemoryRouter>
                <Profesor />
            </MemoryRouter>
        );
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("renders professor information and courses", async () => {
        const mockData = {
            firstName: "Ion",
            lastName: "Popescu",
            rank: "Profesor",
            courses: [
                { id: 1, course: { id: 1, title: "Matematică" } },
                { id: 2, course: { id: 2, title: "Fizică" } },
            ],
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        render(
            <MemoryRouter>
                <Profesor />
            </MemoryRouter>
        );

        // Așteptăm să dispară starea de "Loading..."
        expect(await screen.findByText("Profesor: Ion Popescu (Profesor)")).toBeInTheDocument();

        // Verificăm cursurile
        expect(screen.getByText("Matematică")).toBeInTheDocument();
        expect(screen.getByText("Fizică")).toBeInTheDocument();
    });

    test("renders error message when fetch fails", async () => {
        global.fetch.mockRejectedValueOnce(new Error("Eroare la încărcarea datelor"));

        render(
            <MemoryRouter>
                <Profesor />
            </MemoryRouter>
        );

        // Așteptăm să dispară starea de "Loading..."
        expect(await screen.findByText("Nu există cursuri disponibile pentru acest profesor.")).toBeInTheDocument();
    });

    test("navigates to course details when a course is clicked", async () => {
        const mockData = {
            firstName: "Ion",
            lastName: "Popescu",
            rank: "Profesor",
            courses: [
                { id: 1, course: { id: 1, title: "Matematică" } },
            ],
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        render(
            <MemoryRouter>
                <Profesor />
            </MemoryRouter>
        );

        // Așteptăm să dispară starea de "Loading..."
        expect(await screen.findByText("Matematică")).toBeInTheDocument();

        // Click pe curs
        const courseButton = screen.getByText("Matematică");
        fireEvent.click(courseButton);

        // Verificăm că s-a navigat la detaliile cursului
        expect(await screen.findByText("Cursul nu a fost găsit")).not.toBeInTheDocument();
    });
});