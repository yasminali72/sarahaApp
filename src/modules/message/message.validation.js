import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const sendMessage=joi.object().keys({
    message:joi.string().min(5).max(50000).required(),
    recipientId:generalFields.id.required()
}).required()