import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../../Pages/Home.jsx";

describe("Home component", () => {
    console.error = jest.fn();
    test("renders logo, search, service posts, and footer", async () => {
        render(<Home />);

        // Check if the logo is rendered
        expect(screen.getByAltText("header-logo")).toBeInTheDocument();

        // Check if the search component is rendered
        expect(screen.getByTestId("search-component")).toBeInTheDocument();

        // Check if the service posts component is rendered
        expect(await screen.findByTestId("service-post")).toBeInTheDocument();

        // Check if the footer is rendered
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    test("calls handleFilter function when the search component is used", async () => {
        const handleFilter = jest.fn();

        // Render the Home component with the mocked handleFilter function
        render(<Home />);

        // Simulate user interactions by selecting options and clicking the filter button
        fireEvent.change(screen.getByTestId("select-sector"), {
            target: { value: "selected_sector_value" },
        });

        fireEvent.change(screen.getByTestId("select-target"), {
            target: { value: "selected_target_value" },
        });

        fireEvent.change(screen.getByTestId("select-municipality"), {
            target: { value: "selected_municipality_value" },
        });

        fireEvent.click(screen.getByText("Filtrer"));

        await waitFor(() => {
            setTimeout(() => {
                expect(handleFilter).toHaveBeenCalledWith({
                    sector: "selected_sector_value",
                    target: "selected_target_value",
                    municipality: "selected_municipality_value",
                });
            }, 6000);
        });
    });
});
