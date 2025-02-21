import userModel from "../../../DB/model/User.model.js";
import messageModel from "../../../DB/model/message.model.js";
import { asyncHandler } from "../../../utils/errors/error.js";
import { sucessResponseHandling } from "../../../utils/response/sucess.response.js";

export const sendMessage=asyncHandler(async(req,res,next)=>{
    const {message,recipientId}=req.body
    if (! await userModel.findOne({_id:recipientId,isDeleted:false})) {
        return next(new Error("user not found",{cause:404}))
    }
   const newMessage=await messageModel.create({message,recipientId})

return sucessResponseHandling({res,message:"done",status:201,data:{message:newMessage}})
})