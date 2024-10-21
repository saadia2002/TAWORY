import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Validation pour la structure de row
const RowShape = PropTypes.shape({
  _id: PropTypes.string.isRequired, // Validation pour l'ID
  original: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Validation pour original._id
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string, // Validation pour l'icône (si tu l'utilises)
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
  row: RowShape.isRequired, // Assure que row est validé
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCurrentCategory({ ...currentCategory, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", currentCategory.name);
      formData.append("description", currentCategory.description);

      // Si l'image est présente, la convertir en base64
      if (currentCategory.image) {
        const base64Image = await convertToBase64(currentCategory.image);
        formData.append("image", base64Image);
      }

      console.log("Creating category with data:", {
        name: currentCategory.name,
        description: currentCategory.description,
        image: currentCategory.image, // Affiche le nom du fichier image
      });

      const response = await fetch("http://localhost:5000/api/categories/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchCategories();
        setCurrentCategory({ name: "", description: "", image: null });
        setPreviewImage(null);
        setEditMode(false);
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Fonction pour convertir l'image en base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", currentCategory.name);
      formData.append("description", currentCategory.description);
      if (currentCategory.image) {
        formData.append("image", currentCategory.image);
      }

      // Log des données avant l'envoi
      console.log("Updating category with data:", {
        name: currentCategory.name,
        description: currentCategory.description,
        image: currentCategory.image ? currentCategory.image.name : null, // Affiche le nom du fichier image
      });

      const response = await fetch(`http://localhost:5000/api/categories/${currentCategory._id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        fetchCategories();
        setCurrentCategory({ name: "", description: "", image: null });
        setPreviewImage(null);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const columns = [
    { Header: "Name", accessor: "name", width: "25%" },
    { Header: "Description", accessor: "description", width: "45%" },
    {
      Header: "Actions",
      accessor: "actions",
      width: "30%",
      Cell: (cellProps) => (
        <ActionCell
          row={cellProps.row}
          onEdit={(category) => {
            setCurrentCategory(category);
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
                  Categories Management
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Category Name"
                        fullWidth
                        value={currentCategory.name}
                        onChange={(e) =>
                          setCurrentCategory({
                            ...currentCategory,
                            name: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Description"
                        fullWidth
                        value={currentCategory.description}
                        onChange={(e) =>
                          setCurrentCategory({
                            ...currentCategory,
                            description: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="file"
                        label="Upload Image"
                        fullWidth
                        onChange={handleImageChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{ width: "100px", height: "100px" }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        onClick={editMode ? handleUpdate : handleCreate}
                      >
                        {editMode ? "Update Category" : "Add Category"}
                      </MDButton>
                      {editMode && (
                        <MDButton
                          variant="outlined"
                          color="info"
                          onClick={() => {
                            setEditMode(false);
                            setCurrentCategory({ name: "", description: "", image: null });
                            setPreviewImage(null);
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
                  table={{ columns, rows: categories }}
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

export default Categories;
