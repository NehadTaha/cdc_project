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
  const { sector } = filters;

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

        // Extract details from HTML content using cheerio
        const parsedServicePosts = serviceMarkers.map((post) => {
          const $ = cheerio.load(post.content.html);
          // Regular expression to match the sector in the HTML content
          const sectorRegex = new RegExp(`\\b${sector}\\b`, "i");
          const contentText = $.text();

          // Regular expressions to match different address formats
          const addressRegex1 =
            /<h2 class="field-content">Adresse<\/h2>\s*<\/div>\s*([^<]+)/;
          const addressRegex2 =
            /<h2><strong>Adresse\s*<\/strong><\/h2>\s*<span class=\\"views-field views-field-postal-code\\"><span class=\\"field-content\\">([^<]+)<\/span><\/span>\s*<span class=\\"field-content\\">/;
          const addressRegex3 =
            /<h2><strong>Adresse\s*<\/strong><\/h2>\s*<span class=\\"views-field views-field-postal-code\\"><span class=\\"field-content\\">([^<]+)<\/span><\/span>\s*<span class=\\"field-content\\">/;

          const addressRegex4 =
            /<h3 class="field-content">Adresse<\/h3>\s*<\/div>\s*([^<]+)/;

          // Match the address using the regular expressions
          let address = "";

          const addressMatch1 = post.content.html.match(addressRegex1);
          const addressMatch2 = post.content.html.match(addressRegex2);
          const addressMatch3 = post.content.html.match(addressRegex3);
          const addressMatch4 = post.content.html.match(addressRegex4);

          // Extract the address if a match is found
          if (addressMatch1) {
            address = addressMatch1[1].trim();
          } else if (addressMatch2) {
            address = addressMatch2[1].trim();
          } else if (addressMatch3) {
            address = addressMatch3[1].trim();
          } else if (addressMatch4) {
            address = addressMatch4[1].trim();
          }

          // Regular expressions to match different phone number formats
          const phoneRegex1 =
            /(?:<span class="field-content"><strong>)([\d\s-]+)(?:<\/strong><\/span>)/;
          const phoneRegex2 = /<strong>([\d\s-]+)<\/strong>/;
          const phoneRegex3 =
            /<div class="views-field-nothing-1"><strong>([\d\s-]+)<\/strong><\/div>/;

          // Match the phone number using the regular expressions
          let phoneNumber = "";

          const phoneMatch1 = post.content.html.match(phoneRegex1);
          const phoneMatch2 = post.content.html.match(phoneRegex2);
          const phoneMatch3 = post.content.html.match(phoneRegex3);

          // Extract the phone number if a match is found
          if (phoneMatch1) {
            phoneNumber = phoneMatch1[1].trim();
          } else if (phoneMatch2) {
            phoneNumber = phoneMatch2[1].trim();
          } else if (phoneMatch3) {
            phoneNumber = phoneMatch3[1].trim();
          }

          // If no phone number found using regex, use Cheerio
          if (!phoneNumber) {
            phoneNumber = $("div.views-field-nothing-1").text().trim();
          }

          const website = $("a[href^='http']").attr("href");
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
        });

        // Sort the parsedServicePosts array alphabetically by the title property
        const sortedServicePosts = parsedServicePosts.sort((a, b) =>
          a.title.localeCompare(b.title)
        );

        setServicePosts(sortedServicePosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row m-2 p-2 container-flex">
      {/* Map through the service posts and render each post */}
      {servicePosts.map((post, index) => (
        <div key={index}>
          <h2>{post.title}</h2>
          {/* Render other extracted details */}
          <p>
            <span className="icon">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </span>
            {post.address && <span className="fs-6 fw-bold">Adresse: </span>}
            {post.address && (
              <a
                className="link-text address-url"
                href={`https://www.google.com/maps/search/?api=1&query=${post.address}`}
                target="_blank"
                rel="noreferrer"
              >
                {post.address}
              </a>
            )}
          </p>
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
