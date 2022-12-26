const socket=io()
socket.on("messages",data=>{
let html=""
data.forEach(message => {
 html= `${html}
<li><em>${message.email}</em>:${message.text}</li>`
});
document.getElementById("chatContent").innerHTML=`<ul>${html}</ul>`
})




socket.on("messageAdded",(message)=>{
    html=`${html}
    <li><em>${message.email}</em>:${message.text}</li>`
})
function sendMessage(that){
    const message={
        email:that.email.value,
        message:that.message.value,
        date:new Date().toLocaleString()
    }
    socket.emit("newMessage",message)
}