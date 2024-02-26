import React, { useState } from "react";
import ServiceSector from "./Service_sector";
import Targets from "./Targets";
import Municipalities from "./Municipalites";
import ServicePosts from "./ServicePosts";

const Search = ({ handleFilter }) => {
  // State to track selected options
  const [selectedOptions, setSelectedOptions] = useState({
    sector: "",
    target: "",
    municipality: "",
  });

  // Function to handle changes in selected options
  const handleOptionChange = (name, value) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(selectedOptions);
  };

  // Function to handle filter button click
  const handleFilterClick = () => {
    // Call the handleFilter function passed from the parent component
    handleFilter(selectedOptions);
    console.log(selectedOptions);
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row pt-3 px-2">
        <div className="col-lg-4 col-md-6 mb-3">
          <ServiceSector
            handleSelectorChange={(value) =>
              handleOptionChange("sector", value)
            }
          />
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <Targets
            handleSelectorChange={(value) =>
              handleOptionChange("target", value)
            }
          />
        </div>
        <div className="col-lg-3 col-md-12 mb-3">
          <Municipalities
            handleSelectorChange={(value) =>
              handleOptionChange("municipality", value)
            }
          />
        </div>
        <div className="col-lg-2 col-md-12 mb-3">
          <button
            className="btn text-white w-100 mb-3"
            onClick={handleFilterClick}
          >
            Filter
          </button>
        </div>
      </div>
      {/* Render the ServicePosts component here */}
      <ServicePosts filters={selectedOptions} />
    </div>
  );
};

export default Search;
