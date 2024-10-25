import Joi from "joi";

// Define the Joi validation schema for contact creation and update
const contactSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is required",
  }),

  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be atleast 3 characters",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().max(255).required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.max": "Email must not exceed 255 characters",
    "any.required": "Email is required",
  }),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(6)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain only digits",
      "string.base": "Phone number must be a string",
      "string.min": "Phone number must be min 10 characters",
      "string.max": "Phone number must not exceed 20 characters",
      "any.required": "Phone number is required",
    }),

  address: Joi.string().optional().allow(null, "").messages({
    "string.base": "Address must be a string",
  }),

  is_deleted: Joi.boolean().optional().default(false).messages({
    "boolean.base": "is_deleted must be a boolean value",
  }),

  created_at: Joi.date().optional().messages({
    "date.base": "Created at must be a valid date",
  }),

  updated_at: Joi.date().optional().messages({
    "date.base": "Updated at must be a valid date",
  }),
});

export default contactSchema;
