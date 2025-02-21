export const sucessResponseHandling=({res,message='done',data={},status=200}={})=>{
return res.status(status).json({message,data:{...data}})
}