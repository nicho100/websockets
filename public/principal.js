const socket=io()
socket.on("messages",data=>{
let html=""
data.forEach(message => {
 html= `${html}
<li><b style="color:blue">${message.email}</b>[<em style="color:brown">${message.date}</em>]:<em style="color:green">${message.message}</em></li>`
});
document.getElementById("chatContent").innerHTML=`<ul>${html}</ul>`
})

let prod=[]
socket.on("product",(data)=>{
    prod =data
    for(let i=0;i<prod.lenght;i++){
     html=html +`
     <tr>
    <td>${prod[i].name}></td>
    <td><${prod[i].price}></td>
    <td><img src=<${prod[i].thumbnail}></td>
    </tr>`   
    }
   document.querySelector("#product").innerHTML=html 
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
function addProduct(that){
    const message={
        name:that.name.value,
        price:that.price.value,
        thumbnail:that.thumbnail.value
    }
    socket.emit("newProduct",message)
}
