import React, { useState } from "react";
import PropTypes from "prop-types"; // Pour la validation des props
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField"; // Pour les champs de texte
import { styled } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const CreateService = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour créer un service ici
    console.log("Service créé :", { name, price, description });

    // Réinitialiser les champs de formulaire
    setName("");
    setPrice("");
    setDescription("");
    handleClose(); // Fermer le modal après la soumission
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Créer un service
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nom du service"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Prix"
            margin="normal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

// Validation des props
CreateService.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateService;
