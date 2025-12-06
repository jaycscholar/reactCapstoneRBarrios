import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function BasicFormHandling() {
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
    
  });

  const [errors, setErrors] = useState({
    userName: false,
    password: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let formValid = true;
    const errorsCopy = { ...errors };


    for (const field in formValues) {
      if (!formValues[field]) {
        formValid = false;
        errorsCopy[field] = true;
      }
    }
    setErrors(errorsCopy);

    if (formValid) {
      console.log("Form submitted with values: ", formValues);

    }
  };

  const { isSignedIn, signIn, signOut } = useAuth();

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userName">User Name: </label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formValues.userName}
          onChange={handleChange}
        />

        {errors.userName && <div className="error">Please enter your user name</div>}
      </div>

      <div>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />

        {errors.password && (
          <div className="error">Please enter your password</div>
        )}
      </div>

{isSignedIn ? (
        <button type="button" onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <button type="button" className="btn-dark" onClick={signIn}>
          Sign In
        </button>
      )}

    </form>


  );
}
export default BasicFormHandling;
