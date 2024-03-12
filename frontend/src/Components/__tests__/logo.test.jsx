import React from "react";
import { render, screen } from "@testing-library/react";
import Logo from "../Logo.jsx";

describe("Logo component", () => {
    test.only("renders logo image and social media icons", () => {
        render(<Logo />);

        // Check if logo image is rendered
        const logoImage = screen.getByAltText("header-logo");
        expect(logoImage).toBeInTheDocument();

        // Get all the links in the logo and compt them
        const links = screen.getAllByRole("link");
        expect(links.length).toBe(2);
        links.forEach((link) => {
            expect(link).toHaveAttribute("href");
            //get the href attribute of the link
            const href = link.getAttribute("href");
            //check if the link is a social media link
            if (href.includes("facebook")) {
                expect(link).toContainHTML("svg");
            } else if (href.includes("linkedin")) {
                expect(link).toContainHTML("svg");
            }
        });
        //check if the user click on the link, it will open in a new tab
        links.forEach((link) => {
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });
    });
});
