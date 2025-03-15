import mongoose, { Schema,Types,model } from "mongoose";

const messageSchema=new Schema({
    message:{
        type:String,
        require:true,
        minlength:5,
        maxlength:50000,
        trim:true
    },recipientId:{type:Types.ObjectId,ref:"User",require:true},
    pin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const messageModel = mongoose.models.Message || model("Message",messageSchema)
export default messageModel