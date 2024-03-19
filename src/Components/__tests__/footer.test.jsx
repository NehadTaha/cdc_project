import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Footer from "../Footer";

describe("Footer", () => {
    test("renders Footer component", () => {
        render(<Footer />);
        const coordneesElement = screen.getByText(/Nos Coordonnées/i);
        expect(coordneesElement.textContent).toContain("Nos Coordonnées");

        const missionElement = screen.getByText(/MISSION DE LA CDC/i);
        expect(missionElement.textContent).toContain("MISSION DE LA CDC");

        const footerImgs = screen.getAllByRole("img");
        expect(footerImgs.length).toBe(2);

        const footerLinks = screen.getAllByRole("link");
        expect(footerLinks.length).toBe(5);

        footerLinks.forEach((link) => {
            fireEvent.click(link);
            expect(link).toHaveAttribute("href");
            const href = link.getAttribute("href");
            if (href.includes("facebook")) {
                expect(link).toContainHTML("svg");
            }
            if (href.includes("linkedin")) {
                expect(link).toContainHTML("svg");
            }
        });
    });
});
