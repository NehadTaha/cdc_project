import React, { useState } from "react";
import Logo from "../Components/Logo";
import Footer from "../Components/Footer";
import "../Styles/style.css";
import ServicePosts from "../Components/ServicePosts";
import Search from "../Components/Search";

const Home = () => {
    // State to hold the filtered options
    const [filters, setFilters] = useState({
        sector: "",
        target: "",
        municipality: "",
    });

    // Function to handle filtering
    const handleFilter = (selectedOptions) => {
        setFilters(selectedOptions);
    };

    return (
        <div className="container-flex position-relative">
            <div className="row align-items-center">
                <Logo />
            </div>
            <div className="row ms-1 mx-1 container-flex">
                <div className="col-12 d-flex align-items-center justify-content-center m-1 magog-image">
                    <h1 className="text-white text-center fw-bold">
            RÉPERTOIRE DES ORGANISMES
                    </h1>
                </div>
            </div>
            {/* Pass handleFilter function as a prop to the Search component */}
            <Search handleFilter={handleFilter} data-testid="search-component" />

            {/* Pass filters as a prop to the ServicePosts component */}
            <ServicePosts filters={filters} />
            <Footer />
        </div>
    );
};

export default Home;
