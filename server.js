const express=require('express')
const app= express()
const {createServer}= require('http')
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
const socketIo = require('socket.io')
const server=createServer(app)
const io =socketIo(server)


app.set('views', './public')
app.set('view engine', 'ejs')
const fs=require('fs')
//crear la clase
class contenedor{
  constructor(archivo){
      this.archivo=`./${archivo}.txt`
      this.id=1
      fs.writeFileSync(`./${archivo}.txt`,"[]")
  }

  save=async(object)=>{
     let path=this.archivo
  
          try{
            const contenido= await fs.promises.readFile(path,'utf-8')
            
            let info =JSON.parse(contenido)
                  
           object.id=this.id
            info.push(object)
            fs.writeFileSync(path,JSON.stringify(info,null,2))
            this.id++
            return this.id
          }
          catch(err){
              console.log("error de lectura",err)
          }
     
  }
  getbyid= async(number)=>{
      let resultado=null
      
            const contenido= await fs.promises.readFile(this.archivo,'utf-8')
            let bandera=0
            let info= JSON.parse(contenido)
            for(let i = 0;i <info.length;i++){
            if (info[i].id==number){
                resultado = info[i]
                
                bandera=1
                  }  } 
            if (bandera===0){
                resultado=null
                  
            }
            
         return resultado
  }//funciona
  getAll=async()=>{
      
    const contenido= await fs.promises.readFile(this.archivo,'utf-8')
    let info=JSON.parse(contenido)
    
    
    return info
  }//funciona
  deleteById(number){
      let info=""
      
      fs.readFile(this.archivo,'utf-8',(error,contenido)=>{
          if (error){
              console.log("no se pudo leer el archivo")
          }else{
              info =JSON.parse(contenido)
              console.log(info)
              let bandera=-1
              for(let i = 0;i <info.length;i++){
                  if (info[i].id===number){
                      info.splice(i,1)
                      bandera=1
                      fs.writeFileSync(this.archivo,JSON.stringify(info,null,2))
                      console.log(info)
                        }
              } if (bandera===-1){
                  console.log("el elemento no se encuentra en el archivo")
                  }
          }
      }) 
  }//funciona
  deleteAll(){
      fs.readFile(this.archivo,'utf-8',(error,contenido)=>{
          if (error){
              console.log("no se pudo leer el archivo")
          }else{ 
             let info =JSON.parse(contenido)
             console.log(info)
              info.splice(0,info.length)
              fs.writeFileSync(this.archivo,JSON.stringify(info,null,2))
              console.log(info)
          }
      })
  }//funciona

}

const apiClass= new contenedor("ejemplo")
const chat= new contenedor("chats")
 
app.get('/productos',async (req,res)=>{
const produc=await apiClass.getAll()
  res.render('form.ejs',{produc})
  //res.render('chat.ejs',{produc})
})



io.on('connection',async(client) => {
    const produc=await apiClass.getAll()//guardo todos los productos y mensajes en una variable
    const messages=await chat.getAll()
    console.log("cliente se conecto")
    client.emit("messages",messages)//emito al cliente los mensajes y productos
    client.emit("products",produc)
    
    //escucho el nuevo mensaje recibido del cliente, lo guardo en una variable con el resto de los mensajes y lo emito a todos
    client.on("newMessage",async(msg)=>{
        await chat.save(msg)
        const messages=await chat.getAll()
        io.sockets.emit("messageAdded",messages)
        console.log(msg)
    })
    //escucho el nuevo producto recibido del cliente, lo guardo en una variable con el resto de los productos y lo emito a todos
    client.on("newProduct",async(pro)=>{
        await apiClass.save(pro)
        const produc=await apiClass.getAll()
        io.sockets.emit("productAdded",produc)
    })
 });
 server.listen(8080,(req,res)=>{
    console.log("funciona")
})
