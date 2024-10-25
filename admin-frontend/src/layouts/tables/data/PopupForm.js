import React, { useState } from "react";

// The PopupForm component
function PopupForm({ user, closePopup }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  return (
    <div>
      {/* Your form goes here */}
      <button onClick={closePopup}>Close</button>
    </div>
  );
}

// Export the component
export default PopupForm;
