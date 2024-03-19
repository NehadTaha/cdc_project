import React, { useState } from "react";
import ServiceSector from "./Service_sector";
import Targets from "./Targets";
import Municipalities from "./Municipalites";
import "../Styles/style.css";
import PropTypes from "prop-types";
const Search = ({ handleFilter }) => {
    const [selectedOptions, setSelectedOptions] = useState({
        sector: "",
        target: "",
        municipality: "",
    });
    Search.propTypes = {
        handleFilter: PropTypes.func.isRequired,
    };

    const handleOptionChange = (name, value) => {
        setSelectedOptions((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFilterClick = () => {
        handleFilter(selectedOptions);
    };

    return (
        <div className="container-fluid pt-2"data-testid="search-component">
            <div className="row pt-3 px-2">
                <div className="col-lg-4 col-md-6 mb-3">
                    <ServiceSector
                        handleSelectorChange={(value) =>
                            handleOptionChange("sector", value)
                        }
                        selectedSector={selectedOptions.sector}
                        handleFilter={handleFilter} // Pass handleFilter function
                    />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                    <Targets
                        handleSelectorChange={(value) =>
                            handleOptionChange("target", value)
                        }
                        selectedTarget={selectedOptions.target}
                        handleFilter={handleFilter} // Pass handleFilter function
                    />
                </div>
                <div className="col-lg-3 col-md-12 mb-3">
                    <Municipalities
                        handleSelectorChange={(value) =>
                            handleOptionChange("municipality", value)
                        }
                        selectedMunicipality={selectedOptions.municipality}
                        handleFilter={handleFilter} // Pass handleFilter function
                    />
                </div>
                <div className="col-lg-2 col-md-12 mb-3">
                    <button
                        className="btn w-100 mb-3 see-service"
                        onClick={handleFilterClick}
                    >
            Filtrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
