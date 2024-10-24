import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Validation for row structure
const RowShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  original: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired, // For display, use the category name
  }).isRequired,
});

const ActionCell = ({ row, onEdit, onDelete }) => (
  <MDBox display="flex" alignItems="center">
    <MDButton variant="text" color="info" onClick={() => onEdit(row.original)}>
      <Icon>edit</Icon>&nbsp;Edit
    </MDButton>
    <MDButton variant="text" color="error" onClick={() => onDelete(row.original._id)}>
      <Icon>delete</Icon>&nbsp;Delete
    </MDButton>
  </MDBox>
);

ActionCell.propTypes = {
  row: RowShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    serviceProvider: "",
  });

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/services/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories"); // Mettez à jour l'URL pour récupérer les catégories
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    try {
      // Assurez-vous que tous les champs sont remplis avant l'envoi
      if (
        !currentService.name ||
        !currentService.description ||
        !currentService.price ||
        !currentService.category
      ) {
        console.error("All fields are required!");
        return;
      }

      // Créez un objet avec les données du service
      const serviceData = {
        name: currentService.name,
        description: currentService.description,
        price: parseFloat(currentService.price), // S'assurer que le prix est un nombre
        category: currentService.category,
        serviceProvider: "653ad6c7f8d9471a948b9f7a",
      };

      console.log("Creating service with data:", serviceData);

      // Envoyez la requête avec un body JSON
      const response = await fetch("http://localhost:5000/api/services/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Spécifie que le corps de la requête est au format JSON
        },
        body: JSON.stringify(serviceData), // Convertit les données en JSON
      });

      if (response.ok) {
        fetchServices(); // Rafraîchit la liste des services après la création
        setCurrentService({
          name: "",
          description: "",
          price: "",
          category: "",
          serviceProvider: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", currentService.name);
      formData.append("description", currentService.description);
      formData.append("price", currentService.price);
      formData.append("category", currentService.category);
      formData.append("serviceProvider", currentService.serviceProvider);

      const response = await fetch(
        `http://localhost:5000/api/services/services/${currentService._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        fetchServices();
        setCurrentService({
          name: "",
          description: "",
          price: "",
          category: "",
          serviceProvider: "",
        });
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/services/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchServices();
        // Show alert
        setAlert({ show: true, message: "Service deleted successfully!", type: "success" });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      // Show alert for error
      setAlert({ show: true, message: "Failed to delete service.", type: "danger" });
    }
  };

  const columns = [
    { Header: "Name", accessor: "name", width: "20%" },
    { Header: "Description", accessor: "description", width: "30%" },
    { Header: "Price", accessor: "price", width: "15%" },
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
          onDelete={handleDelete}
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
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Services Management
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <MDInput
                        label="Service Name"
                        fullWidth
                        value={currentService.name}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            name: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MDInput
                        label="Price"
                        fullWidth
                        type="number"
                        value={currentService.price}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            price: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <select
                        value={currentService.category}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            category: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "4px",
                          borderColor: "#cccccc",
                          fontSize: "0.875rem",
                        }}
                      >
                        <option value="" style={{ fontSize: "0.875rem", color: "#cccccc" }}>
                          Select Category
                        </option>
                        {categories.map((category) => (
                          <option
                            key={category._id}
                            value={category._id}
                            style={{ fontSize: "0.875rem" }}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <MDInput
                        label="Description"
                        fullWidth
                        value={currentService.description}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            description: e.target.value,
                          })
                        }
                        multiline 
                        rows={6} 
                      />
                    </Grid>
                    {/* <Grid item xs={12} md={4}>
                      <MDInput
                        label="Service Provider"
                        fullWidth
                        value={currentService.serviceProvider}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            serviceProvider: e.target.value,
                          })
                        }
                      />
                    </Grid> */}
                    <Grid item xs={12}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        onClick={editMode ? handleUpdate : handleCreate}
                      >
                        {editMode ? "Update Service" : "Add Service"}
                      </MDButton>
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
};

export default ServiceManager;
