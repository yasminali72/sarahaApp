import { Router } from "express";
import { freezeProfile, profile, reActiveProfile, shareProfile, unFreezeProfile, updatePassword, updatePhone, updateProfile } from "./services/user.services.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { endpoint } from "./user.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './user.validation.js'
const router=Router()

router.get("/profile",authentication(),authorization(endpoint.profile),profile)
router.get("/profile/:userId",validation(validators.shareProfile),shareProfile)

router.patch("/updateProfile",validation(validators.updateProfile),authentication(),authorization(endpoint.profile),updateProfile)
router.patch("/updatePassword",validation(validators.updatePassword),authentication(),authorization(endpoint.profile),updatePassword)
router.patch("/updatePhone",validation(validators.updatePhone),authentication(),authorization(endpoint.profile),updatePhone)
router.delete("/profile",authentication(),authorization(endpoint.profile),freezeProfile)
router.patch("/unFreezeProfile",validation(validators.unFreezeProfile),unFreezeProfile)
router.patch("/reActiveProfile",validation(validators.reActiveProfile),reActiveProfile)




export default router