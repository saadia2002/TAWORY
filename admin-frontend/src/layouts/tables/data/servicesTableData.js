import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

const Service = ({ name, price, description }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="button" fontWeight="medium">
      {name}
    </MDTypography>
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {price}
    </MDTypography>
    <MDTypography variant="caption">{description}</MDTypography>
  </MDBox>
);

// Validation des propriétés
Service.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default function servicesTableData() {
  return {
    columns: [
      { Header: "service", accessor: "service", width: "45%", align: "left" },
      { Header: "category", accessor: "category", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "created", accessor: "created", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: [
      {
        service: (
          <Service
            name="Nettoyage de jardin"
            price="$120.50"
            description="Service de nettoyage complet pour jardins."
          />
        ),
        category: "Jardinage",
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        created: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            12/06/21
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        service: (
          <Service
            name="Plomberie"
            price="$80.00"
            description="Services de plomberie pour maisons."
          />
        ),
        category: "Plomberie",
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="inactive" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        created: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            15/03/22
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        service: (
          <Service
            name="Peinture intérieure"
            price="$150.00"
            description="Service de peinture pour maisons."
          />
        ),
        category: "Peinture",
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        created: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            20/08/21
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        service: (
          <Service name="Élagage" price="$90.00" description="Service d'élagage pour arbres." />
        ),
        category: "Jardinage",
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        created: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            10/05/22
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        service: (
          <Service
            name="Nettoyage de piscine"
            price="$130.00"
            description="Service de nettoyage complet de piscine."
          />
        ),
        category: "Entretien",
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        created: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            05/09/22
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
    ],
  };
}
