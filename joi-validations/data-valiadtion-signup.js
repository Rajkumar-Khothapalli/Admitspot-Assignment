import Joi from "joi";

//Joi validation schema for user creation and updates
const userSchema = Joi.object({
  username: Joi.string().min(5).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be minimun 5 characters",
    "string.max": "Username must not exceed 30 characters",
    "any.required": "Username is required",
  }),

  name: Joi.string().max(100).required().messages({
    "string.base": "Name must be a string",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().max(255).required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.max": "Email must not exceed 255 characters",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8) // Adjust minimum length as needed
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),

  gender: Joi.string()
    .optional()
    .valid("male", "female", "other") // Specify valid options
    .messages({
      "string.base": "Gender must be a string",
      "any.only": "Gender must be one of the following: male, female, other",
    }),

  created_at: Joi.date().optional().messages({
    "date.base": "Created at must be a valid date",
  }),

  updated_at: Joi.date().optional().messages({
    "date.base": "Updated at must be a valid date",
  }),
});

export default userSchema;
