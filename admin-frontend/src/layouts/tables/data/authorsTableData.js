import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Modal from "components/Modal"; // Assure-toi d'avoir un composant Modal

export default function Data() {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      console.log("Fetching user data...");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
      const data = await response.json();
      console.log("Data received:", data);

      const formattedData = data.map((user) => {
        const imageUrl = user.image ? `/img/${user.image}` : "/img/OIP (11).jpeg"; // Default image path

        return {
          email: user.email,
          author: <Author image={imageUrl} name={user.name} email={user.email} />,
          function: (
            <Job
              title={user.role}
              description={`Date de naissance: ${new Date(user.dateOfBirth).toLocaleDateString()}`}
            />
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={user.role === "user" ? "En ligne" : "Hors ligne"}
                color={user.role === "user" ? "success" : "dark"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </MDTypography>
          ),
          action: (
            <>
              <MDButton color="primary" onClick={() => handleUpdate(user)}>
                Modifier
              </MDButton>
              <MDButton color="error" onClick={() => handleDelete(user.email)}>
                Supprimer
              </MDButton>
            </>
          ),
        };
      });

      setRows(formattedData);
      console.log("Formatted data set in rows:", formattedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const handleUpdate = (user) => {
    console.log("Utilisateur sélectionné pour mise à jour :", user);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Fermeture du modal.");
    setShowModal(false);
    setSelectedUser(null);
  };

  // Fetch data on component mount
  useEffect(() => {
    console.log("Component mounted, fetching data...");
    fetchData();
  }, []);

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  Job.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  // Log the state of modal to check why it might not show
  console.log("Modal state:", showModal, "Selected User:", selectedUser);

  // Determine if the modal should be visible and log that
  const isModalVisible = showModal && selectedUser !== null;
  console.log("Is modal visible?", isModalVisible);

  return {
    columns: [
      { Header: "author", accessor: "author", width: "45%", align: "left" },
      { Header: "function", accessor: "function", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "date de naissance", accessor: "employed", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows,
    modal: isModalVisible && (
      <Modal onClose={handleCloseModal}>
        <h2>Modifier</h2>
        <div>
          <p>
            <strong>Nom :</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email :</strong> {selectedUser.email}
          </p>
          <MDButton color="secondary" onClick={handleCloseModal}>
            Fermer
          </MDButton>
        </div>
      </Modal>
    ),
  };
}
