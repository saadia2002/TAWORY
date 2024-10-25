import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    password: "", // Champ mot de passe
    role: "",
    dateOfBirth: "",
    image: null, // Stocke l'objet fichier de l'image
  });
  const [imagePreview, setImagePreview] = useState(null); // Pour afficher l'aperçu de l'image

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentUser({ ...currentUser, image: file.name }); // Stockez le nom de l'image
      setImagePreview(URL.createObjectURL(file)); // Affichez l'aperçu de l'image (si nécessaire)
    }
  };

  const handleCreate = async () => {
    // Vérifiez que les champs requis sont remplis
    if (!currentUser.name || !currentUser.dateOfBirth) {
      console.error("Name and Date of Birth are required");
      return; // Sortir si les champs requis ne sont pas remplis
    }

    try {
      const userData = {
        name: currentUser.name,
        email: currentUser.email,
        password: currentUser.password,
        role: currentUser.role,
        dateOfBirth: currentUser.dateOfBirth, // Gardez la date sous forme de chaîne
        image: currentUser.image, // Utilisez le nom de l'image
      };
      // Afficher le corps de la requête dans la console
      console.log("User Data:", userData);

      const response = await fetch("http://localhost:5000/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Spécifiez que vous envoyez des données JSON
        },
        body: JSON.stringify(userData), // Convertir l'objet utilisateur en JSON
      });

      if (!response.ok) {
        const errorData = await response.json(); // Récupérer les données d'erreur
        console.error("Error creating user:", errorData); // Afficher les erreurs
        return; // Sortir de la fonction si la réponse n'est pas OK
      }

      // Réinitialiser les champs après la création réussie
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const handleUpdate = async () => {
    const updatedUserData = {
      name: currentUser.name,
      email: currentUser.email,
      password: currentUser.password,
      role: currentUser.role,
      dateOfBirth: currentUser.dateOfBirth,
      image: currentUser.image, // Vous pouvez gérer l'image différemment
    };

    console.log("Données à envoyer à l'API:", updatedUserData);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Indique que nous envoyons des données JSON
        },
        body: JSON.stringify(updatedUserData), // Transformez l'objet en chaîne JSON
      });

      if (response.ok) {
        fetchUsers(); // Récupérer les utilisateurs mis à jour
        resetForm(); // Réinitialiser le formulaire si nécessaire
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour de l'utilisateur:", errorData);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
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
    setCurrentUser({ name: "", email: "", password: "", role: "", dateOfBirth: "", image: null });
    setImagePreview(null); // Réinitialisation de l'aperçu
    setEditMode(false);
  };

  const handleEdit = (user) => {
    const formattedDateOfBirth = new Date(user.dateOfBirth).toISOString().split('T')[0]; // Format "yyyy-MM-dd"

    setCurrentUser({
      ...user,
      dateOfBirth: formattedDateOfBirth, // Date au format requis
    });

    setEditMode(true);
    setImagePreview(user.image); // Affiche l'image existante
  };



  const getImagePath = (imageName) => {
    return `/img/${imageName}`; // Changez cela en fonction de la structure de votre projet
  };

  const columns = [
    { Header: "Name", accessor: "name", width: "20%" },
    { Header: "Email", accessor: "email", width: "20%" },
    { Header: "Role", accessor: "role", width: "15%" },
    { Header: "Date of Birth", accessor: "dateOfBirth", width: "20%" },
    {
      Header: "Image",
      accessor: "image",
      width: "15%",
      Cell: ({ value }) => <img src={getImagePath(value)} alt="User" width="50" height="50" />,
    },
    {
      Header: "Actions",
      accessor: "actions",
      width: "10%",
      Cell: ({ row }) => (
          <MDBox display="flex" alignItems="center">
            <MDButton
                variant="outlined"
                color="info"
                onClick={() => handleEdit(row.original)} // Prépare l'édition de l'utilisateur
            >
              Edit
            </MDButton>
            <MDButton
                variant="outlined"
                color="error"
                onClick={() => handleDelete(row.original._id)} // Supprime l'utilisateur
                sx={{ ml: 1 }}
            >
              Delete
            </MDButton>
          </MDBox>
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
                      <Grid item xs={12} md={4}>
                        <MDInput
                            label="User Name"
                            fullWidth
                            value={currentUser.name}
                            onChange={(e) =>
                                setCurrentUser({ ...currentUser, name: e.target.value })
                            }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <MDInput
                            label="Email"
                            fullWidth
                            value={currentUser.email}
                            onChange={(e) =>
                                setCurrentUser({ ...currentUser, email: e.target.value })
                            }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <MDInput
                            label="Password"
                            type="password"
                            fullWidth
                            value={currentUser.password}
                            onChange={(e) =>
                                setCurrentUser({ ...currentUser, password: e.target.value })
                            }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <MDInput
                            label="Role"
                            fullWidth
                            value={currentUser.role}
                            onChange={(e) =>
                                setCurrentUser({ ...currentUser, role: e.target.value })
                            }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <MDInput
                            type="date"
                            label="Date of Birth"
                            fullWidth
                            value={currentUser.dateOfBirth}
                            onChange={(e) =>
                                setCurrentUser({ ...currentUser, dateOfBirth: e.target.value })
                            }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && <img src={imagePreview} alt="Preview" width="100" height="100" />}
                      </Grid>
                    </Grid>
                    <MDBox display="flex" justifyContent="flex-end" mt={3}>
                      <MDButton variant="outlined" color="success" onClick={editMode ? handleUpdate : handleCreate}>
                        {editMode ? "Update User" : "Create User"}
                      </MDButton>
                      <MDButton variant="outlined" color="error" onClick={resetForm} sx={{ ml: 2 }}>
                        Reset
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </MDBox>
                <MDBox>
                  <DataTable
                      table={{ columns, rows: users }}
                      isSorted={false}
                      canSearch
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

UsersManager.propTypes = {
  users: PropTypes.array,
};

export default UsersManager;
