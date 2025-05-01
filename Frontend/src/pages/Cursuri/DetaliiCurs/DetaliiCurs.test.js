import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PDetaliiCurs from "./PDetaliiCurs";

jest.mock("./../Components/Ceas", () => () => <div data-testid="ceas-component">Ceas Component</div>);
jest.mock("./../Components/Edit", () => ({ value, onChange }) => (
    <textarea
        data-testid="edit-component"
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
));
jest.mock("./../Components/ButonExtensibil", () => ({ text, professors }) => (
    <div data-testid="buton-extensibil">
        <p>{text}</p>
        {professors.map((prof, index) => (
            <p key={index}>{prof.name}</p>
        ))}
    </div>
));
jest.mock("./../Components/AdaugaLink", () => ({ newMaterial, setNewMaterial, onAdd }) => (
    <div data-testid="adauga-link">
        <input
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
        />
        <button onClick={onAdd}>Adaugă</button>
    </div>
));

describe("PDetaliiCurs Component", () => {
    const mockCurs = {
        id: 1,
        title: "Curs Test",
        gradingMethod: "Examen final",
        description: "Descriere test",
    };

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders loading state initially", () => {
        render(<PDetaliiCurs curs={mockCurs} onBack={jest.fn()} />);
        expect(screen.getByText("Loading course...")).toBeInTheDocument();
    });

    test("renders course details after loading", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ professors: [{ professor: { firstName: "Ion", lastName: "Popescu" } }] }),
        });

        render(<PDetaliiCurs curs={mockCurs} onBack={jest.fn()} />);

        await waitFor(() => expect(screen.getByText("Curs Test")).toBeInTheDocument());
        expect(screen.getByText("Descriere test")).toBeInTheDocument();
        expect(screen.getByText("Examen final")).toBeInTheDocument();
        expect(screen.getByText("Ion Popescu")).toBeInTheDocument();
    });

    test("calls onBack when back button is clicked", () => {
        const onBack = jest.fn();
        render(<PDetaliiCurs curs={mockCurs} onBack={onBack} />);
        const backButton = screen.getByText("< Înapoi");
        fireEvent.click(backButton);
        expect(onBack).toHaveBeenCalledTimes(1);
    });

    test("updates description when edited", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ professors: [] }),
        });

        render(<PDetaliiCurs curs={mockCurs} onBack={jest.fn()} />);

        await waitFor(() => expect(screen.getByText("Curs Test")).toBeInTheDocument());

        const textarea = screen.getByTestId("edit-component");
        fireEvent.change(textarea, { target: { value: "Noua descriere" } });
        expect(textarea).toHaveValue("Noua descriere");
    });

    test("adds a new material", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ professors: [] }),
        });

        render(<PDetaliiCurs curs={mockCurs} onBack={jest.fn()} />);

        await waitFor(() => expect(screen.getByText("Curs Test")).toBeInTheDocument());

        const input = screen.getByTestId("adauga-link").querySelector("input");
        const addButton = screen.getByText("Adaugă");

        fireEvent.change(input, { target: { value: "http://material.com" } });
        fireEvent.click(addButton);

        await waitFor(() => expect(input).toHaveValue(""));
    });
});