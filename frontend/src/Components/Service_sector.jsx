import React, { useState, useEffect } from "react";
import "../Styles/style.css";
import PropTypes from "prop-types";

const ServiceSector = ({ handleSelectorChange }) => {
    const [serviceData, setServiceData] = useState([]);
    const [selectedSector, setSelectedSector] = useState("");
    ServiceSector.propTypes = {
        handleSelectorChange: PropTypes.func.isRequired,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://cdcmemphremagog.com/wp-json/wp/v2/service_sector?_embed&per_page=100"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setServiceData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedSector(selectedValue);
        handleSelectorChange(selectedValue); // Send the selected sector value to the parent component
    };

    return (
        <div>
            {/* Service Sector Dropdown */}
            <select
                className="select"
                value={selectedSector}
                onChange={handleChange}
            >
                <option value="">Secteurs d&apos;activité</option>
                {serviceData.map((sector) => (
                    <option key={sector.id} value={sector.slug}>
                        {sector.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ServiceSector;
