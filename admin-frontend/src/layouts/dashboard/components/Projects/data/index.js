/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

export default function data() {
  // Avatar pour les services (image et nom)
  const avatars = (members) =>
    members.map(([image, name]) => (
      <Tooltip key={name} title={name} placeholder="bottom">
        <MDAvatar
          src={image}
          alt={name}
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { white } }) =>
              `${borderWidth[2]} solid ${white.main}`,
            cursor: "pointer",
            position: "relative",
            "&:not(:first-of-type)": {
              ml: -1.25,
            },
            "&:hover, &:focus": {
              zIndex: "10",
            },
          }}
        />
      </Tooltip>
    ));

  // Structure pour afficher le profil de l'utilisateur avec son service
  const UserProfile = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "User Profile", accessor: "userProfile", width: "30%", align: "left" },
      { Header: "Services", accessor: "services", width: "35%", align: "left" },
      { Header: "Reservations", accessor: "reservations", align: "center" },
      { Header: "Progress", accessor: "progress", align: "center" },
    ],

    rows: [
      {
        userProfile: <UserProfile image="avatar1.jpg" name="John Doe" />,
        services: (
          <MDBox display="flex" py={1}>
            {avatars([
              ["serviceIcon1.svg", "Service 1"],
              ["serviceIcon2.svg", "Service 2"],
            ])}
          </MDBox>
        ),
        reservations: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            3 Reservations
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={70} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        userProfile: <UserProfile image="avatar2.jpg" name="Jane Smith" />,
        services: (
          <MDBox display="flex" py={1}>
            {avatars([
              ["serviceIcon1.svg", "Service 1"],
              ["serviceIcon2.svg", "Service 2"],
            ])}
          </MDBox>
        ),
        reservations: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            5 Reservations
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={50} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        userProfile: <UserProfile image="avatar3.jpg" name="Alice Johnson" />,
        services: (
          <MDBox display="flex" py={1}>
            {avatars([
              ["serviceIcon1.svg", "Service 1"],
              ["serviceIcon2.svg", "Service 2"],
            ])}
          </MDBox>
        ),
        reservations: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            1 Reservation
          </MDTypography>
        ),
        progress: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={90} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
    ],
  };
}
