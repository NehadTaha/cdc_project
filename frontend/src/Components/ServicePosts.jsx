import React, { useState, useEffect } from "react";
import cheerio from "cheerio";
import "../Styles/style.css";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ServicePosts = ({ filters }) => {
  const [servicePosts, setServicePosts] = useState([]);
  console.log("filter.municipality", filters.municipality);
  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

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
          // Extract sectors and targets from the API data
          const sectors = post.sectors || [];
          const targets = post.targets || [];
          const municipality = post.municipalities || [];
          const sector = sectors.map((sector) => sector.slug).join(", ");
          const target = targets.map((target) => target.slug).join(", ");
          const mun = municipality
            .map((municipality) => municipality.slug)
            .join(", ");
          console.log("mun", mun);

          // Normalize filters, sector, and target strings for comparison
          const normalizedFilterSector = normalizeString(filters.sector);
          const normalizedFilterTarget = normalizeString(filters.target);
          const normalizedFilterMunicipality = normalizeString(
            filters.municipality
          );
          console.log(
            "normalizedFilterMunicipality",
            normalizedFilterMunicipality
          );

          const normalizedSector = normalizeString(sector);
          const normalizedTarget = normalizeString(target);
          const normalizedMunicipality = normalizeString(mun);

          // Check if the post matches both sector and target criteria
          const matchesSector = normalizedSector.includes(
            normalizedFilterSector
          );
          const matchesTarget = normalizedTarget.includes(
            normalizedFilterTarget
          );
          const matchesMunicipality = normalizedMunicipality.includes(
            normalizedFilterMunicipality
          );

          if (matchesSector && matchesTarget && matchesMunicipality) {
            const $ = cheerio.load(post.content.html);

            const addressRegex =
              /(?:<h[23] class="field-content">Adresse<\/h[23]>|<h3 class="field-content">Adresse<\/h3>)\s*<\/div>\s*([^<]+)/;
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

        setServicePosts(filteredServicePosts); // Set filtered posts
        console.log("Service Posts Array:", filteredServicePosts.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filters.sector, filters.target, filters.municipality]);

  return (
    <div className="row m-2 p-2 container-flex">
      {/* Map through the service posts and render each post */}
      {servicePosts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          {/* Render other extracted details */}
          {post.address && (
            <p>
              <span className="icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </span>
              <span className="fs-6 fw-bold">Adresse: </span>
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
            <p>
              <span className="icon">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <span className="fs-6 fw-bold">Téléphone: </span>
              {post.phoneNumber}
            </p>
          )}
          {post.website && (
            <p>
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
            <p>
              <span className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span className="fs-6 fw-bold">Courriel: </span>
              {post.email}
            </p>
          )}

          {/* Render link to view more details */}
          <a
            className="btn btn-primary fs-4 mt-2 mb-2"
            role="button"
            aria-pressed="true"
            href={`https://cdcmemphremagog.com/?p=${post.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Voir ce service
          </a>
          <hr className="post-hr" />
        </div>
      ))}
    </div>
  );
};

export default ServicePosts;
