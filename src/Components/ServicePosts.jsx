// ServicePosts.jsx
import React, { useState, useEffect } from "react";
import cheerio from "cheerio";
import "../Styles/style.css";
import PropTypes from "prop-types";
import {
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ServicePosts = ({ filters }) => {
    const [servicePosts, setServicePosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://cdcmemphremagog.com/wp-content/plugins/cdc-custom-map/public/api.php"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                const serviceMarkers = data.markers || [];

                const parsedServicePosts = serviceMarkers.map((post) => {
                    const sectors = post.sectors || [];
                    const targets = post.targets || [];
                    const municipality = post.municipalities || [];
                    const sector = sectors.map((sector) => sector.slug).join(", ");
                    const target = targets.map((target) => target.slug).join(", ");
                    const mun = municipality
                        .map((municipality) => municipality.slug)
                        .join(", ");

                    const normalizedSector = sector.toLowerCase();
                    const normalizedTarget = target.toLowerCase();
                    const normalizedMunicipality = mun.toLowerCase();

                    if (
                        normalizedSector.includes(filters.sector.toLowerCase()) &&
            normalizedTarget.includes(filters.target.toLowerCase()) &&
            normalizedMunicipality.includes(filters.municipality.toLowerCase())
                    ) {
                        const $ = cheerio.load(post.content.html);
                        const addressRegex =
              /<h[23] class="field-content">Adresse<\/h[23]>\s*<\/div>\s*([^<]+)/;
                        const phoneRegex =
              /(?:<span class="field-content"><strong>|\b)([\d\s-]+)(?:<\/strong><\/span>|$)/;

                        const addressMatch = post.content.html.match(addressRegex);
                        const address = addressMatch ? addressMatch[1].trim() : "";
                        const phoneMatch = post.content.html.match(phoneRegex);
                        let phoneNumber = phoneMatch ? phoneMatch[1].trim() : "";

                        if (!phoneNumber) {
                            phoneNumber = $("div.views-field-nothing-1").text().trim();
                        }

                        const website = $("a[href^='http']").attr("href") || "";
                        const emailRegex = /<a.+?href="mailto:([^"]+)"/;
                        const emailMatch = post.content.html.match(emailRegex);
                        const email = emailMatch ? emailMatch[1] : "";

                        return {
                            id: post.id,
                            title: post.title,
                            address: address,
                            phoneNumber: phoneNumber,
                            website: website,
                            email: email,
                        };
                    } else {
                        return null;
                    }
                });

                const filteredServicePosts = parsedServicePosts.filter(
                    (post) => post !== null
                );

                setServicePosts(filteredServicePosts);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 10 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [filters.sector, filters.target, filters.municipality]);

    return (
        <div className="row m-2 p-2 container-flex" data-testid="service-post">
            {servicePosts.map((post) => (
                <div key={post.id}>
                    <h2 data-testid="post-title">{post.title}</h2>
                    {post.address && (
                        <p data-testid="post-address">
                            <span className="icon">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </span>
                            <span className="fs-6 fw-bold">Address: </span>
                            <a
                                className="link-text address-url"
                                href={`https://www.google.com/maps/search/?api=1&query=${post.address}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {post.address}
                            </a>
                        </p>
                    )}
                    {post.phoneNumber && (
                        <p data-testid="post-phone-number">
                            <span className="icon">
                                <FontAwesomeIcon icon={faPhone} />
                            </span>
                            <span className="fs-6 fw-bold">Phone: </span>
                            {post.phoneNumber}
                        </p>
                    )}
                    {post.website && (
                        <p data-testid="post-website">
                            <span className="icon">
                                <FontAwesomeIcon icon={faGlobe} />
                            </span>
                            <span className="fs-6 fw-bold">Website: </span>
                            <a
                                className="fs-6 website-color website-url"
                                href={post.website}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {post.website}
                            </a>
                        </p>
                    )}
                    {post.email && (
                        <p data-testid="post-email">
                            <span className="icon">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                            <span className="fs-6 fw-bold">Email: </span>
                            {post.email}
                        </p>
                    )}
                    <a
                        className="btn see-service fs-4 mt-2 mb-2"
                        role="button"
                        aria-pressed="true"
                        href={`https://cdcmemphremagog.com/?p=${post.id}`}
                        target="_blank"
                        rel="noreferrer"
                    >
              View Service
                    </a>
                    <hr className="post-hr" />
                </div>
            ))}
        </div>
    );
};

ServicePosts.propTypes = {
    filters: PropTypes.shape({
        sector: PropTypes.string,
        target: PropTypes.string,
        municipality: PropTypes.string,
    }).isRequired,
};

export default ServicePosts;
