import { Router } from "express";
import { deleteAllMessages, deleteMessage, forgetPassword, freezeProfile, pinMessage, profile, reActiveProfile, resetPassword, shareProfile, unFreezeProfile, unPinMessage, updatePassword, updatePhone, updateProfile, verifyCode } from "./services/user.services.js";
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
// delete one message
router.delete("/:messageId",authentication(),authorization(endpoint.profile),deleteMessage)



router.patch("/forgetPassword",validation(validators.forgetPassword),forgetPassword)
router.patch("/verifyCode",validation(validators.verifyCode),verifyCode)
router.patch("/resetPassword",validation(validators.resetPassword),resetPassword)

// delete all messages
router.patch("/all-messages",authentication(),authorization(endpoint.profile),deleteAllMessages)
router.patch("/pin-message/:messageId",authentication(),authorization(endpoint.profile),pinMessage)
router.patch("/unPin-message/:messageId",authentication(),authorization(endpoint.profile),unPinMessage)





export default router