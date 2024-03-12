import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ServicePosts from "../ServicePosts";

describe("ServicePosts component", () => {
  test("renders service posts based on filters", async () => {
    // Mock the fetch function to return sample data
    mockFetchSuccess({
      markers: [
        {
          id: 1,
          sectors: [{ slug: "desired_sector" }],
          targets: [{ slug: "desired_target" }],
          municipalities: [{ slug: "desired_municipality" }],
          content: {
            html: "<div><h3 class='field-content'>Adresse: Test Address</h3></div>",
          },
        },
      ],
    });

    // Render the component with filters
    render(
      <ServicePosts
        filters={{
          sector: "desired_sector",
          target: "desired_target",
          municipality: "desired_municipality",
        }}
      />
    );

    // Wait for service posts to be rendered
    await waitFor(() => {
      expect(screen.getByText("Adresse: Test Address")).toBeInTheDocument();
    });
  });

  test("logs error on failed data fetch", async () => {
    // Mock the fetch function to return an unsuccessful response
    mockFetchFailure();

    // Mock console.error to spy on it
    console.error = jest.fn();

    // Render the component with filters
    render(<ServicePosts filters={{}} />);

    // Wait for the error to be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching data:",
        new Error("Failed to fetch data")
      );
    });
  });
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
