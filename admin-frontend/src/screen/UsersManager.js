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

// Define prop types at the top level
const UserShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  dateOfBirth: PropTypes.string,
  image: PropTypes.string,
});

const RowShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  original: UserShape.isRequired,
});

const ImageCell = ({ value }) => {
  return value ? (
    <img
      src={`data:image/jpeg;base64,${value}`}
      alt="user"
      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
    />
  ) : null;
};

ImageCell.propTypes = {
  value: PropTypes.string,
};

const RoleCell = ({ value }) => {
  let bgColor;
  let textColor = "#fff";

  switch (value) {
    case "admin":
      bgColor = "green";
      break;
    case "user":
      bgColor = "orange";
      break;
    case "prestataire":
      bgColor = "blue";
      break;
    default:
      bgColor = "gray";
      textColor = "#000";
  }

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: bgColor,
        color: textColor,
        padding: "6px 12px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "12px",
        textAlign: "center",
        width: "100px", // Largeur fixe pour tous les badges
        minWidth: "100px", // Largeur minimale pour maintenir la consistance
        whiteSpace: "nowrap", // Empêche le texte de passer à la ligne
        overflow: "hidden", // Cache le texte qui dépasse
        textOverflow: "ellipsis", // Ajoute des points de suspension si le texte est trop long
        verticalAlign: "middle", // Alignement vertical
        textTransform: "capitalize", // Première lettre en majuscule
        boxSizing: "border-box", // Inclut padding dans la largeur totale
      }}
    >
      {value}
    </span>
  );
};

const RoleCellWrapper = ({ value }) => <RoleCell value={value} />;

RoleCellWrapper.propTypes = {
  value: PropTypes.string.isRequired,
};

const DateCell = ({ value }) => <span>{new Date(value).toLocaleDateString()}</span>;

DateCell.propTypes = {
  value: PropTypes.string.isRequired,
};
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

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    dateOfBirth: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
      const data = await response.json();
      const usersWithBase64 = data.map((user) => ({
        ...user,
        image: user.image ? user.image : null,
      }));
      setUsers(usersWithBase64);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCurrentUser({ ...currentUser, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", currentUser.name);
      formData.append("email", currentUser.email);
      formData.append("password", currentUser.password);
      formData.append("role", currentUser.role);
      formData.append("dateOfBirth", currentUser.dateOfBirth);

      if (currentUser.image) {
        formData.append("image", currentUser.image);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchUsers();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", currentUser.name);
      formData.append("email", currentUser.email);
      if (currentUser.password) {
        formData.append("password", currentUser.password);
      }
      formData.append("role", currentUser.role);
      formData.append("dateOfBirth", currentUser.dateOfBirth);

      if (currentUser.image instanceof File) {
        formData.append("image", currentUser.image);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUser._id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchUsers();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const resetForm = () => {
    setCurrentUser({
      name: "",
      email: "",
      password: "",
      role: "",
      dateOfBirth: "",
      image: null,
    });
    setPreviewImage(null);
    setEditMode(false);
  };

  const columns = [
    {
      Header: "Image",
      accessor: "image",
      width: "10%",
      Cell: ImageCell,
    },
    { Header: "Name", accessor: "name", width: "20%" },
    { Header: "Email", accessor: "email", width: "25%" },
    {
      Header: "Role",
      accessor: "role",
      width: "15%",
      Cell: RoleCellWrapper,
    },
    {
      Header: "Date of Birth",
      accessor: "dateOfBirth",
      width: "15%",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Actions",
      accessor: "actions",
      width: "15%",
      Cell: (cellProps) => (
        <ActionCell
          row={cellProps.row}
          onEdit={(user) => {
            setCurrentUser({
              ...user,
              password: "", // Clear password for security
              dateOfBirth: new Date(user.dateOfBirth).toISOString().split("T")[0],
            });
            setPreviewImage(user.image ? `data:image/jpeg;base64,${user.image}` : null);
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
                  Users Management
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Name"
                        fullWidth
                        value={currentUser.name}
                        onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Email"
                        fullWidth
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MDInput
                        type="password"
                        label="Password"
                        fullWidth
                        value={currentUser.password}
                        onChange={(e) =>
                          setCurrentUser({ ...currentUser, password: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MDInput
                        type="date"
                        fullWidth
                        value={currentUser.dateOfBirth}
                        onChange={(e) =>
                          setCurrentUser({ ...currentUser, dateOfBirth: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <select
                        value={currentUser.role}
                        onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px",
                          height: "45px",
                          border: "1px solid lightgray", // Bordure gris clair
                          borderRadius: "5px", // Bords arrondis
                          color: "#000", // Texte noir
                          fontSize: "14px", // Taille du texte réduite
                        }}
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="prestataire">Prestataire</option>
                        <option value="user">User</option>
                      </select>
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        fullWidth
                        inputProps={{ accept: "image/*" }}
                      />
                    </Grid>
                    {previewImage && (
                      <Grid item xs={12}>
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <MDBox mt={3} display="flex" justifyContent="flex-end">
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={editMode ? handleUpdate : handleCreate}
                    >
                      {editMode ? "Update User" : "Add User"}
                    </MDButton>
                    {editMode && (
                      <MDButton variant="gradient" color="error" onClick={resetForm} sx={{ ml: 2 }}>
                        Cancel
                      </MDButton>
                    )}
                  </MDBox>
                </MDBox>
                <MDBox>
                  <DataTable
                    table={{ columns, rows: users }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default UsersManager;
