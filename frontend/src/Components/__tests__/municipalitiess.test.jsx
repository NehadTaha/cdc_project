import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Municipalities from "../Municipalites";
import e from "express";

describe("Municipalities component", () => {
    let handleSelectorChange;
    console.error = jest.fn();

    beforeEach(() => {
        handleSelectorChange = jest.fn();
    });

    test("renders dropdown with options", async () => {
    // Mock the fetch function to return sample data
        mockFetchSuccess({
            municipalities: {
                slug1: "Municipality 1",
                slug2: "Municipality 2",
            },
        });

        // Render the component
        render(<Municipalities handleSelectorChange={handleSelectorChange} />);

        await assertDropdownOptions([
            "Municipalité(s)",
            "Municipality 1",
            "Municipality 2",
        ]);
    

    
    });
    test("render dropdown without options", async () => {
    // Mock the fetch function to return sample data
        mockFetchSuccess({
            municipalities: {},
        });

        // Render the component
        render(<Municipalities handleSelectorChange={handleSelectorChange} />);
        await assertDropdownOptions([
            "Municipalité(s)",
        ]);
        expect(handleSelectorChange).not.toHaveBeenCalled();
    });


    test("logs error on failed data fetch", async () => {
    // Mock the fetch function to return an unsuccessful response
        mockFetchFailure();

        // Mock console.error to spy on it
        console.error = jest.fn();

        // Render the component
        render(<Municipalities handleSelectorChange={handleSelectorChange} />);

        // Wait for the error to be logged
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                "Error fetching data:",
                new Error("Failed to fetch data")
            );
        });
    });

    test("calls handleSelectorChange on dropdown change", async () => {
    // Mock the fetch function to return sample data
        mockFetchSuccess({
            municipalities: {
                slug1: "Municipality 1",
                slug2: "Municipality 2",
            },
        });

        // Render the component
        render(<Municipalities handleSelectorChange={handleSelectorChange} />);

        await assertDropdownOptions([
            "Municipalité(s)",
            "Municipality 1",
            "Municipality 2",
        ]);

        // Simulate user selecting an option from the dropdown
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "slug1" },
        });

        // Check if handleSelectorChange is called with the correct value
        expect(handleSelectorChange).toHaveBeenCalledWith("slug1");
    });

    // Helper function to mock successful fetch response
    const mockFetchSuccess = (data) => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(data),
            })
        );
    };

    // Helper function to mock failed fetch response
    const mockFetchFailure = () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        );
    };

    // Helper function to assert dropdown options
    const assertDropdownOptions = async (options) => {
        await waitFor(() => {
            options.forEach((option) => {
                expect(screen.getByText(option)).toBeInTheDocument();
            });
        });
    };
});