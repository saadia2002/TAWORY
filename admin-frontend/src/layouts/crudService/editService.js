// src/layouts/crudService/EditService.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function EditService({ open, handleClose, service, onSave }) {
  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price);
  const [description, setDescription] = useState(service.description);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice(service.price);
      setDescription(service.description);
    }
  }, [service]);

  const handleSave = () => {
    const updatedService = { ...service, name, price, description };
    onSave(updatedService); // Appeler la fonction onSave avec les données mises à jour
    handleClose(); // Fermer la modal
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Service Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price"
          fullWidth
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditService.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  service: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditService;
