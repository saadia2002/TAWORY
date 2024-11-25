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

const RowShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  original: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
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
  const [providers, setProviders] = useState([]); // Prestataires
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
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      const filteredProviders = data.filter((user) => user.role === "prestataire");
      setProviders(filteredProviders);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchProviders();
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
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

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
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
      }
    } catch (error) {
      console.error("Error saving service:", error);
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
          onDelete={async (id) => {
            try {
              await fetch(`http://localhost:5000/api/services/services/${id}`, {
                method: "DELETE",
              });
              fetchServices();
            } catch (error) {
              console.error("Error deleting service:", error);
            }
          }}
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
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <select
                        value={currentService.serviceProvider}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            serviceProvider: e.target.value,
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
                          Select Service Provider
                        </option>
                        {providers.map((provider) => (
                          <option key={provider._id} value={provider._id}>
                            {provider.name}
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
                    <Grid item xs={12}>
                      <MDButton variant="gradient" color="info" onClick={handleCreateOrUpdate}>
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
