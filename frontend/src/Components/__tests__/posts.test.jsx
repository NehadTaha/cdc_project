import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ServicePosts from "../ServicePosts";

// Import jest-fetch-mock
import fetchMock from "jest-fetch-mock";

const customTextMatcher = (text) => {
    return (content, node) => {
        const hasText = (node) => {
            if (node.textContent === text) {
                return true;
            }
            for (const childNode of node.childNodes) {
                if (hasText(childNode)) {
                    return true;
                }
            }
            return false;
        };
        return hasText(node);
    };
};

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
        jest
            .spyOn(global, "fetch")
            .mockRejectedValueOnce(new Error("Failed to fetch"));

        render(
            <ServicePosts filters={{ sector: "", target: "", municipality: "" }} />
        );

        await waitFor(() => {
            // Ensure that console.error is called with the expected arguments
            expect(console.error).toHaveBeenCalledWith(
                "Error fetching data:",
                new Error("Failed to fetch")
            );
        });
    });

    test("renders service posts with all details", async () => {
    // Mock fetch to return specific service posts
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

        // Wait for the data to be fetched and the component to re-render
        // Wait for the data to be fetched and the component to re-render
        await waitFor(() => {
            const postTitles = screen.queryAllByTestId("post-title");
            expect(postTitles.length).toBeGreaterThan(0);
            postTitles.forEach((title) => {
                expect(title).toBeInTheDocument();
            });
            const postAddresses = screen.queryAllByTestId("post-address");
            expect(postAddresses.length).toBeGreaterThan(0);
            postAddresses.forEach((address) => {
                expect(address).toBeInTheDocument();
            });

            const postPhoneNumbers = screen.queryAllByTestId("post-phone-number");
            expect(postPhoneNumbers.length).toBeGreaterThan(0);
            postPhoneNumbers.forEach((phoneNumber) => {
                expect(phoneNumber).toBeInTheDocument();
            });

            const postWebsites = screen.queryAllByTestId("post-website");
            expect(postWebsites.length).toBeGreaterThan(0);
            postWebsites.forEach((website) => {
                expect(website).toBeInTheDocument();
            });

            const postEmails = screen.queryAllByTestId("post-email");
            expect(postEmails.length).toBeGreaterThan(0);
            postEmails.forEach((email) => {
                expect(email).toBeInTheDocument();
            });
        });
    });
});
