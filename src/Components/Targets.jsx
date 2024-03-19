import React, { useState, useEffect } from "react";
import "../Styles/style.css";
import PropTypes from "prop-types";

const Targets = ({ handleSelectorChange }) => {
    const [targets, setTargets] = useState([]);
    Targets.propTypes = {
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
                // Extract targets array from the API response
                const targetsArray = data.service_target || [];
                setTargets(targetsArray);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
    // Call the handleSelectorChange function with the selected value
        handleSelectorChange(event.target.value);
    };

    return (
        <div>
            {/* Target Dropdown */}
            <select className="select" onChange={handleChange}>
                <option data-testid="select-target">Groupe Cible</option>
                {targets.map((target, index) => (
                    <option key={index} value={Object.keys(target)[0]}>
                        {Object.values(target)[0]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Targets;
