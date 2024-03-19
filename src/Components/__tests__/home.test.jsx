import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../../Pages/Home.jsx";

describe("Home component", () => {
    console.error = jest.fn();
    test("renders logo, search, service posts, and footer", () => {
        render(<Home />);

        // Check if the logo is rendered
        expect(screen.getByAltText("header-logo")).toBeInTheDocument();

        // Check if the search component is rendered
        expect(screen.getByTestId("search-component")).toBeInTheDocument();

        // Check if the service posts component is rendered
        expect(screen.getByTestId("service-posts")).toBeInTheDocument();

        // Check if the footer is rendered
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
    test("hadles filtering", async () => {
        render(<Home />);
        fireEvent.click(screen.getByText("Filtrer"));
        await waitFor(() => {
            setTimeout(() => {
                expect(screen.getByText("Filtrer par catégorie")).toBeInTheDocument();
            }, 5000);
        });
    });
});
