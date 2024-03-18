import React, { useState, useEffect } from "react";
import "../Styles/style.css";
import PropTypes from "prop-types";

const Municipalities = ({ handleSelectorChange }) => {
    const [municipalities, setMunicipalities] = useState([]);
    Municipalities.propTypes = {
        handleSelectorChange: PropTypes.func.isRequired,
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
                // Extract municipalities array from the API response
                const municipalitiesArray = data.municipalities
                    ? Object.entries(data.municipalities).map(([slug, title]) => ({
                        slug,
                        title,
                    }))
                    : [];
                setMunicipalities(municipalitiesArray);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const handleChange = (event) => {
        const selectedValue = event.target.value; 

        handleSelectorChange(selectedValue);
    };

    return (
        <div data-testid="service-municipalities">
            {/* Municipalities Dropdown */}
            <select className="select" onChange={handleChange}>
                <option value="" data-testid="select-municipality">
            Municipalité(s)
                </option>
                {municipalities.map((municipality, index) => (
                    <option key={index} value={municipality.slug}>
                        {municipality.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Municipalities;
