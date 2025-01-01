import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import emailjs from "emailjs-com";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// DataTable component (make sure it exists in your project)
import DataTable from "examples/Tables/DataTable";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";

const ActionCell = ({ row, onEdit, onDelete, onActivate, onAttend }) => (
    <MDBox display="flex" alignItems="center">
      <MDButton variant="text" color="info" onClick={() => onAttend(row.original)}>
        <Icon>hourglass_empty</Icon>&nbsp;Attends {/* Icône mise à jour */}
      </MDButton>
      <MDButton variant="text" color="error" onClick={() => onDelete(row.original._id)}>
        <Icon>delete</Icon>&nbsp;Deactivate
      </MDButton>
      <MDButton
          variant="text"
          color="success"
          onClick={() => onActivate(row.original)} // Pass the entire service object
      >
        <Icon>check_circle</Icon>&nbsp;Activate
      </MDButton>
    </MDBox>
);

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  onAttend: PropTypes.func.isRequired, // Ajout de la prop onAttend
};

function Notifications() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]); // Prestataires
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    serviceProvider: "",
    status: "", // Default status
  });

  const fetchData = async () => {
    try {
      const [servicesResponse, categoriesResponse, providersResponse] = await Promise.all([
        fetch("http://localhost:5000/api/services/service"),
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/users")
      ]);

      const servicesData = await servicesResponse.json();
      const categoriesData = await categoriesResponse.json();
      const providersData = await providersResponse.json();

      setServices(servicesData);
      setCategories(categoriesData);
      const filteredProviders = providersData.filter((user) => user.role === "prestataire");
      setProviders(filteredProviders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async () => {
    const url = editMode
        ? `http://localhost:5000/api/services/services/${currentService._id}`
        : "http://localhost:5000/api/services/services";
    const method = editMode ? "PUT" : "POST";

    try {
      const serviceData = {
        name: currentService.name,
        description: currentService.description,
        price: parseFloat(currentService.price),
        category: currentService.category,
        serviceProvider: currentService.serviceProvider,
        status: currentService.status, // Include status in the data sent to the API
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        fetchData(); // Refresh data after update
        setCurrentService({
          name: "",
          description: "",
          price: "",
          category: "",
          serviceProvider: "",
          status: "", // Reset status to default
        });
        setEditMode(false);
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        setAlert({
          show: true,
          message: "Failed to save service.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving service:", error);
      setAlert({
        show: true,
        message: "Error occurred while saving the service.",
        type: "error",
      });
    }
  };



  const sendEmail = async (recipientEmail) => {
    const templateParams = {
      from_name: 'Siham', // Vous pouvez personnaliser ceci
      to_name: recipientEmail,
      message: 'C\'est une opportunité d\'investissement stratégique à ne pas manquer. Profitez de ce moment favorable pour maximiser vos rendements.',
    };

    try {
      const result = await emailjs.send(
          'service_h2s9jg9',        // Your EmailJS Service ID
          'template_a3tq92a',       // Your EmailJS Template ID
          templateParams,           // The email parameters
          'JDQMJ7rG1uTncNQ4w'       // Your EmailJS User ID
      );
      console.log('Email envoyé:', result.text);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
  };

  const handleActivateService = async (service) => {
    const { _id, serviceProvider } = service;
    const email = serviceProvider?.email; // Accès sûr à l'email

    if (!email) {
      setAlert({
        show: true,
        message: "Service provider email not found.",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/services/activer/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "active", // Changer le statut en 'actif'
          email: email, // Envoyer l'email avec le changement de statut
        }),
      });

      if (response.ok) {
        await sendEmail(email);  // Envoyer l'email une fois que le service est activé
        fetchData(); // Rafraîchir la liste des services
        setAlert({
          show: true,
          message: "Service activated successfully and email sent.",
          type: "success",
        });
      } else {
        setAlert({
          show: true,
          message: "Failed to activate service.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error activating service:", error);
      setAlert({
        show: true,
        message: "Error occurred while activating the service.",
        type: "error",
      });
    }
  };




  // Function to handle the "Attends" state and show the alert
  const handleAttend = (service) => {
    setAlert({
      show: true,
      message: `Le service "${service.name}" est en attente.`,
      type: "info",
    });
  };

  const columns = [
    { Header: "Name", accessor: "name", width: "20%" },
    { Header: "Description", accessor: "description", width: "30%" },
    { Header: "Price", accessor: "price", width: "15%" },
    { Header: "Status", accessor: "status", width: "15%" },
    { Header: "Email", accessor: "serviceProvider.email", width: "15%" },
    { Header: "User Name", accessor: "serviceProvider.name", width: "15%" },
    {
      Header: "Actions",
      accessor: "actions",
      width: "20%",
      Cell: (cellProps) => (
          <ActionCell
              row={cellProps.row}
              onEdit={(service) => {
                setCurrentService(service);
                setEditMode(true);
              }}
              onDelete={async (id) => {
                try {
                  await fetch(`http://localhost:5000/api/services/services/${id}`, {
                    method: "DELETE",
                  });
                  fetchData(); // Refresh data after deletion
                } catch (error) {
                  console.error("Error deleting service:", error);
                }
              }}
              onActivate={handleActivateService} // Pass the handleActivateService function to ActionCell
              onAttend={handleAttend} // Pass the handleAttend function
          />
      ),
    },
  ];

  return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                {alert.show && (
                    <MDBox mb={3}>
                      <MDAlert color={alert.type}>{alert.message}</MDAlert>
                    </MDBox>
                )}
                <MDBox pt={3}>
                  <MDBox p={3}>
                    <Grid container spacing={3}>
                      {/* Other input fields */}
                      <Grid item xs={12}>
                        <MDBox
                            p={3}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                              backgroundColor: "#2fc0e0",
                              borderRadius: 1,
                              boxShadow: 2,
                            }}
                        >
                          <MDTypography
                              variant="h5"
                              color="black"
                              fontWeight="bold"
                          >
                            Voici l'ensemble des notifications relatives aux services créés
                          </MDTypography>
                        </MDBox>

                        {editMode && (
                            <MDButton
                                variant="outlined"
                                color="info"
                                onClick={() => {
                                  setEditMode(false);
                                  setCurrentService({
                                    name: "",
                                    description: "",
                                    price: "",
                                    category: "",
                                    serviceProvider: "",
                                    status: "", // Reset status to default
                                  });
                                }}
                                sx={{ ml: 2 }}
                            >
                              Cancel
                            </MDButton>
                        )}
                      </Grid>
                    </Grid>
                  </MDBox>
                  <DataTable
                      table={{ columns, rows: services }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
  );
}

export default Notifications;
