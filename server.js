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

class contenedor3{
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
class contenedor{
    constructor(){
        this.productos=[]
        this.id=1
        
    }

    save(object){
        //traer el contenido del archivo y preguntar si tiene algo,si no se pone objet id en 1
        //si hay contenido se recorre y se guarda el id del ultimo y se le suma uno y al objeto.id se le asigna lo guardad
            
        object.id=this.id
        this.productos.push(object)
        this.id++
        return this.id
        
    }
    getbyid(number){
        let resultado=null
              let bandera=0
              for(let i = 0;i <this.productos.length;i++){
              if (info[i].id==number){
                resultado = this.productos[i]
                bandera=1
                }} 
              if (bandera===0){
                resultado=null      
              }
              
           return resultado
    }//funciona
    getAll(){
      return this.productos
    }//funciona
    deleteById(number){
         let bandera=-1
        for(let i = 0;i <this.productos.length;i++){
             if (this.productos[i].id===number){
                this.productos.splice(i,1)
                bandera=1
                }
         }if (bandera===-1){
            console.log("el elemento no se encuentra en el array")
            }
    }//funciona
    deleteAll(){
    this.productos=[]
    }//funciona

}

const apiClass= new contenedor("ejemplo")
const chat= new contenedor("chats")
chat.save({
    email: "nico@email",
    message: "hola" 
})
app.get('/productos',(req,res)=>{
const produc= apiClass.getAll()
  res.render('form.ejs',{produc})
  //res.render('chat.ejs',{produc})
})

app.post('/productos',(req, res)=>{
    //console.log(req.body)
    apiClass.save(req.body)
    //let productos=await apiClass.getAll()
    //console.log(productos)
    res.redirect('/productos')
})

io.on('connection',(client) => {
    console.log("cliente se conecto")
    client.emit("messages",chat)
    client.on("newMessage",async(msg)=>{
        chat.save(msg)
        io.sockets.emit("messageAdded",msg)
    })
 });
 server.listen(8080,(req,res)=>{
    console.log("funciona")
})