import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import logo from "../logo.jpg";

const Logo = () => {
  return (
    <div className="container-flex" data-testid="logo">
      <div className="row">
        <div className="col-9 col-xl-4 col-lg-4 col-md-5 col-sm-6 justify-content-center">
          <img
            src={logo}
            alt="header-logo"
            style={{ width: "100%", height: "100%" }}
           
          />
        </div>
        <div className="col-xl-8 col-lg-8 col-md-7 col-sm-2  d-flex align-items-center justify-content-end">
          <a
            alt="facebook"
            href="https://www.facebook.com/cdcmemphremagog"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="facebook-icon"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              size="2x"
              style={{
                marginRight: "30px",
                color: "#4267B2",
                paddingBottom: "10px",
                marginLeft: "200px",
              }}
            />
          </a>
          <a
            href="https://www.linkedin.com/company/89222716/admin/feed/posts/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="linkedin-icon"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              size="2x"
              style={{
                color: "#0e76a8",
                paddingBottom: "10px",
                marginRight: "30px",
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Logo;
