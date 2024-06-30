import {
  getAuth,
} from "firebase/auth";
import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('email'),
  password: Yup.string().required().min(6).label('password')
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('email'),
  password: Yup.string().required().min(6).label('password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'confirm Password must match password.')
    .required('confirm password is required.')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('please enter a registered email')
    .label('email')
    .email('enter a valid email')
});

// Function to get the current user's Firebase token
export const getFirebaseToken = async () => {
  const user = getAuth().currentUser;
  if (user) {
    return await user.getIdToken();
  } else {
    throw new Error("No user is logged in.");
  }
};