import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Search from "../Search";
import "@testing-library/jest-dom/extend-expect";

const handleFilter = jest.fn();

describe("Search component", () => {
    // Mock console.error to prevent errors during testing
    console.error = jest.fn();
    test("render the search component", () => {
        render(<Search />);
        // expect to see 3 components
        expect(screen.getByText("Municipalité(s)")).toBeInTheDocument();
        expect(screen.getByText("Secteurs d'activité")).toBeInTheDocument();
        expect(screen.getByText("Groupe Cible")).toBeInTheDocument();

        // expect to see filter button
        expect(screen.getByText("Filtrer")).toBeInTheDocument();
    });
    test("handleFilterClick function is called when filter button is clicked", () => {
        render(<Search handleFilter={handleFilter} />);
        const filterButton = screen.getByText("Filtrer");
        fireEvent.click(filterButton);
        expect(handleFilter).toBeCalled();
    });
    test.each([
        ["sector", "select-sector", "sector1"],
        ["target", "select-target", "target1"],
        ["municipality", "select-municipality", "municipality1"],
    ])(
        "handleOptionChange function is called when %s option is changed",
        async (name, testId, value) => {
            render(<Search handleFilter={handleFilter} />);

            const select = screen.getByTestId(testId);

            // Change the value of the select element
            fireEvent.change(select, { target: { value } });
            await waitFor(() => {
                setTimeout(() => {
                    expect(handleFilter).toHaveBeenCalledWith({ [name]: value });
                }, 6000);
            });
        }
    );
});
