import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";

function ServicesOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Vue d'ensemble des services
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            ce mois-ci
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="check_circle"
          title="Service 'Web Design' créé"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="info"
          icon="event_available"
          title="Réservation du service 'Marketing' confirmée"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="primary"
          icon="add_box"
          title="Nouveau service 'Développement mobile' ajouté"
          dateTime="21 DEC 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon="reservation"
          title="Service 'SEO' réservé pour le 30 décembre"
          dateTime="20 DEC 2:20 AM"
        />
      </MDBox>
    </Card>
  );
}

export default ServicesOverview;
