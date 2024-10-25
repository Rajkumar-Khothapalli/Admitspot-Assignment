import Joi from "joi";

// Define the Joi validation schema for contact creation and update
const contactUpdateSchema = Joi.object({
  defaultName: Joi.string().min(3).max(100).messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be atleast 3 characters",
    "string.max": "Name must not exceed 100 characters",
  }),

  defaultEmail: Joi.string().email().max(255).messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.max": "Email must not exceed 255 characters",
  }),

  defaultphoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(6)
    .max(20)
    .messages({
      "string.pattern.base": "Phone number must contain only digits",
      "string.base": "Phone number must be a string",
      "string.min": "Phone number must be min 10 characters",
      "string.max": "Phone number must not exceed 20 characters",
    }),

  defaultAddress: Joi.string().optional().allow(null, "").messages({
    "string.base": "Address must be a string",
  }),

  defaultTimezone: Joi.string().optional().allow(null, "").messages({
    "string.base": "timezone must be a string",
  }),
});

export default contactUpdateSchema;
