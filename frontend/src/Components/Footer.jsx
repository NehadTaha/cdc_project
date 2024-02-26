//import styles from "../styles/style.css";
import "../Styles/style.css";
import FooterLogo from "../footerLogo.png";
import TableNatation from "../TableNatation.png";
import "bootstrap-icons/font/bootstrap-icons.css";
const Footer = () => {
  return (
    <footer className="footer ">
      <div className="container-flex text-white text-center fs-4 align-items-center justify-content-center">
        <div className="row">
          <div className="col-12 col-sm-6 p-5">
            <h2 className="text-color"> Nos Coordonnées</h2>
            <p>
              CORPORATION DE DÉVELOPPEMENT COMMUNAUTAIRE (CDC) MEMPHRÉMAGOG
              <br />
              <a
                href="https://www.google.com/maps/search/?api=1&query=95+rue+Merry+Nord%2C+Magog+%28Québec+%29+J1X+2E7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-line-underline"
              >
                95 rue Merry Nord, Magog (Québec ) J1X 2E7
              </a>
              <br />
              bureau 217
              <br />
              Téléphone : 819 847.1277
            </p>
          </div>
          <div className="col-12 col-sm-6 p-5">
            <h2 className="text-color"> MISSION DE LA CDC</h2>
            <p>
              Les Corporations de développement communautaire (CDC) sont des
              regroupements d’organismes communautaires ayant pour mandat
              d’assurer la participation active du milieu populaire et
              communautaire au développement socioéconomique de leur milieu.
            </p>
          </div>
        </div>
        <hr className="hr" />
      </div>
      <div className="container-fluid align-items-center justify-content-center">
        <div className="row">
          <div className="col-md-3">
            <a href="https://cdcmemphremagog.com/">
              <img
                className="footer-logo"
                src={FooterLogo}
                alt="logo"
                style={{ width: "50%", height: "100%" }}
              ></img>
            </a>
          </div>
          <div className="col-md-3">
            <a href="https://cdcmemphremagog.com/">
              <img
                className="table-natation"
                src={TableNatation}
                alt="logo"
                style={{ width: "50%", height: "100%" }}
              ></img>
            </a>
          </div>
          <div className="col-md-3 ">
            <a href="https://www.facebook.com/cdcmemphremagog">
              <i className="bi bi-facebook fs-1 text-white "></i>
            </a>
          </div>
          <div className="col-md-3">
            <a href="https://www.instagram.com/cdcmemphremagog/">
              <i className="bi bi-instagram fs-1 text-white"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
