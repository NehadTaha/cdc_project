import React, { useState, useEffect } from "react";
import Logo from "../Components/Logo";
import Footer from "../Components/Footer";
import "../Styles/style.css";
import Search from "../Components/Search";
import serviceDetailsWithPost from "../serviceDetailsWithPostText.json";

const Home = () => {
  // State to store the service posts
  const [servicePosts, setServicePosts] = useState([]);

  useEffect(() => {
    // Set service posts from imported data and sort them alphabetically by title
    const sortedPosts = serviceDetailsWithPost.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setServicePosts(sortedPosts);
  }, []);

  // Function to filter posts based on selected options
  const handleFilter = (selectedOptions) => {
    const { target, sector, municipality } = selectedOptions;
    console.log(selectedOptions);

    // Filter the service posts based on the selected options
    const filteredPosts = serviceDetailsWithPost.filter((post) => {
      // Check if the selected target matches the post's serviceTargets
      const targetMatch =
        !target || post.serviceTargets.some((t) => t === target);
      console.log("target", targetMatch);

      // Check if the selected sector matches the post's serviceSectors
      const sectorMatch =
        !sector || post.serviceSectors.some((s) => s === sector);
      console.log("sector", sectorMatch);

      // Check if the selected municipality matches any of the post's municipalitiesServed
      const municipalityMatch =
        !municipality ||
        post.municipalitiesServed.some((m) => m === municipality);
      console.log("muni", municipalityMatch);

      // Return true only if all conditions are met (i.e., all options match)
      return targetMatch && sectorMatch && municipalityMatch;
    });
    console.log(filteredPosts);

    // Update the service posts state with the filtered posts
    setServicePosts(filteredPosts);
  };

  return (
    <div className="container-flex position-relative">
      <div className="row align-items-center">
        <Logo />
      </div>
      <div className="row ms-1 mx-1 container-flex">
        <div className="col-12 d-flex align-items-center justify-content-center magog-image">
          <h1 className="text-white text-center fw-bold">
            RÉPERTOIRE DES ORGANISMES
          </h1>
        </div>
      </div>
      <div>
        <Search handleFilter={handleFilter} />
      </div>
      <div className="row m-2 p-2 container-flex">
        {/* Map through the service posts (sorted alphabetically) and render each post */}
        {servicePosts.map((post, index) => (
          <div key={index}>
            <h2>{post.title}</h2>
            {post.adresse && (
              <p className="fs-5 ">
                <a
                  className="link-text"
                  href={`https://www.google.com/maps/search/?api=1&query=${post.adresse}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {post.adresse}
                </a>
              </p>
            )}
            {post.phoneNumber && (
              <p className="fs-4 fw-bold">{post.phoneNumber}</p>
            )}
            {post.email && <p className="fs-6">{post.email}</p>}
            {post.websiteUrl && (
              <p>
                <a
                  className="fs-6 website-color website-url"
                  href={post.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {post.websiteUrl}
                </a>
              </p>
            )}
            {/* Check if any of the fields are available */}
            {(post.adresse ||
              post.phoneNumber ||
              post.email ||
              post.websiteUrl) && (
              <a
                className="btn btn-primary fs-4 mt-2 mb-2"
                role="button"
                aria-pressed="true"
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
              >
                Voir ce service
              </a>
            )}
            <hr className="post-hr" />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
