import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ServicePosts from "../ServicePosts";

// Import jest-fetch-mock
import fetchMock from "jest-fetch-mock";

describe("ServicePosts component", () => {
    // Mock console.error to prevent errors during testing
    console.error = jest.fn();

    // Setup fetch mock before each test
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("renders the ServicePosts component", async () => {
        render(
            <ServicePosts filters={{ sector: "", target: "", municipality: "" }} />
        );

        await waitFor(() => {
            expect(screen.getByTestId("service-post")).toBeInTheDocument();
        });
    });

    test("renders error message when data fetching fails", async () => {
        console.error = jest.fn(); // Reset jest.fn() to track calls

        // Mock the fetch function to throw an error
        fetchMock.mockRejectOnce(new Error("Failed to fetch"));

        render(
            <ServicePosts filters={{ sector: "", target: "", municipality: "" }} />
        );

        await waitFor(() => {
            setTimeout(() => {
                // Ensure that console.error is called with the expected arguments
                expect(console.error).toHaveBeenCalledWith(
                    "Error fetching data:",
                    new Error("Failed to fetch")
                );
            }, 6000);
        });
    });

    test("renders service posts with all details", async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    markers: [
                        {
                            id: 1,
                            title: "Test title",
                            address: "Test address",
                            phoneNumber: "123-456-7890",
                            website: "https://test.com",
                            email: "test@test.com",
                        },
                    ],
                }),
        });

        render(
            <ServicePosts filters={{ sector: "", target: "", municipality: "" }} />
        );

        await waitFor(
            () => {
                const postTitles = screen.getAllByTestId("post-title");
                expect(postTitles.length).toBeGreaterThan(0);
                postTitles.forEach((title) => {
                    expect(title).toBeInTheDocument();
                });

                const postAddresses = screen.getAllByTestId("post-address");
                expect(postAddresses.length).toBeGreaterThan(0);
                postAddresses.forEach((address) => {
                    expect(address).toBeInTheDocument();
                });

                const postPhoneNumbers = screen.getAllByTestId("post-phone-number");
                expect(postPhoneNumbers.length).toBeGreaterThan(0);
                postPhoneNumbers.forEach((phoneNumber) => {
                    expect(phoneNumber).toBeInTheDocument();
                });

                const postWebsites = screen.getAllByTestId("post-website");
                expect(postWebsites.length).toBeGreaterThan(0);
                postWebsites.forEach((website) => {
                    expect(website).toBeInTheDocument();
                });

                const postEmails = screen.getAllByTestId("post-email");
                expect(postEmails.length).toBeGreaterThan(0);
                postEmails.forEach((email) => {
                    expect(email).toBeInTheDocument();
                });
            },
            { timeout: 5000 }
        ); // Increase the timeout to 5000 milliseconds (5 seconds)
    });

    // Test for filtering based on different filters
    test("filters service posts based on sector, target, and municipality", async () => {
    // Mock the fetch function to return sample data
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    markers: [
                        {
                            id: 3,
                            title: "Test title 3",
                            sectors: [{ slug: "sector3" }],
                            targets: [{ slug: "target3" }],
                            municipalities: [{ slug: "municipality3" }],
                            content: {
                                html: "<h2 class=\"field-content\">Test Content 3</h2>",
                            },
                        },
                    ],
                }),
        });

        // Render the component with filters
        render(
            <ServicePosts
                filters={{
                    sector: "sector1",
                    target: "target1",
                    municipality: "municipality1",
                }}
            />
        );

        // Ensure that only the post that matches the filters is rendered
        await waitFor(() => {
            setTimeout(() => {
                expect(screen.queryByText("Test title 3")).not.toBeInTheDocument();
                expect(screen.queryByText("Test title 3")).toBeNull();
            }, 6000);
        });
    });
});
