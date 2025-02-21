import { Router, json } from "express";
import * as registrationService from "./service/registration.service.js";
import { login } from "./service/login.service.js";

import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./auth.validation.js";
const router = Router();

router.post(
  "/signup",
  validation(validators.signup),
  registrationService.signup
);
router.patch("/confirm-email", registrationService.confirmationEmail);

router.post("/login", validation(validators.login),login);

export default router;
