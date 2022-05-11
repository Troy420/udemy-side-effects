import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

// initial state we set for emailState snapshot
const initialState = {
  value: "",
  isValid: false,
};

// We can put this outside the Login component because we dont need any
// data generated inside of the component function
const emailReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        value: action.payload,
        isValid: action.payload.includes("@"),
      };
    case "INPUT_BLUR":
      return {
        value: state.value,
        isValid: state.value.includes("@"),
      };
    default:
      return state;
  }
};

const passReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT":
      return {
        value: action.payload,
        isValid: action.payload.trim().length > 6,
      };
    case "INPUT_BLUR":
      return {
        value: state.value,
        isValid: state.value.trim().length > 6,
      };
    default:
      return state;
  }
};

const Login = () => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, initialState);

  const [passState, dispatchPass] = useReducer(passReducer, initialState);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity");
      setFormIsValid(emailState.isValid && passState.isValid);
    }, 500);

    return () => {
      console.log("CLEAN UP");
      clearTimeout(identifier);
    };
  }, [emailState.isValid, passState.isValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: "USER_INPUT",
      payload: event.target.value,
    });
  };

  const validateEmailHandler = () => {
    dispatchEmail({
      type: "INPUT_BLUR",
    });
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPass({
      type: "USER_INPUT",
      payload: event.target.value,
    });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPass({
      type: "INPUT_BLUR",
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          isValid={emailState.isValid}
          label="E-Mail"
          type="email"
          id="email"
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          isValid={passState.isValid}
          label="password"
          type="password"
          id="password"
          value={passState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
