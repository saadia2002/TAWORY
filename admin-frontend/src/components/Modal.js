import React from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

const Modal = ({ children, onClose }) => {
  const handleClose = () => {
    console.log("Fermeture du modal..."); // Log pour la fermeture du modal
    onClose();
  };

  console.log("Modal rendu"); // Log pour indiquer que le modal est rendu

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <MDBox bgColor="white" p={3} borderRadius="md" boxShadow={3} position="relative">
        <MDButton onClick={handleClose} style={{ position: "absolute", top: 10, right: 10 }}>
          X
        </MDButton>
        {children}
      </MDBox>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
