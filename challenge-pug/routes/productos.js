const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
    destination:function(request, file, cb){
        cb(null,path.join(__dirname,"../uploads"))
    },
    filename:function(request, file, cb){
        cb(null,file.originalname)
    }
})
const upload = multer({ storage });




// OBTENER TODOS LOS PRODUCTOS
router.get("/", (request, response)=>{
    fs.readFile(path.join(__dirname,"../public", "db.json"),(error, data)=>{
        if(error){
            console.log(error)
            response.status(404).json({ error:"Ocurrio un error" })
        }else{
            const products = JSON.parse(data).map(item => {
                const image = `http://${request.headers.host}/images/${item.image}`;
                return {
                    id:item.id,
                    title:item.title,
                    price:item.price,
                    image
                }
            })
            
            response.render("productos.pug",{ products })
        }
    })
    
})

// OBTENER PRODUCTOS DETERMINADOS
router.get("/:id", (request, response)=>{
    fs.readFile(path.join(__dirname,"../public", "db.json"),(error, data)=>{
        if(error){
            console.log(error)
            response.status(404).json({ error:"Ocurrio un error" })
        }else{
            let product = JSON.parse(data).find(item => item.id === parseInt(request.params.id));
            !product 
                ? response.json({ error:"Producto no encontrado" })
                : response.json(product) 
        }
    })
})

// CARGAR UN PRODUCTO
router.post("/", upload.single("myFile") ,(request, response)=>{
    if(!request.file){
        response.status(400).json({ error: "No envio archivos" });
        return;
    }
    fs.readFile(path.join(__dirname,"../public", "db.json"), (error, data)=>{
        if(error){
            console.log(error);
            response.status(404).json({ error:"Ocurrio un error" })
        }else{
            let totalProducts = JSON.parse(data);
            const maxId = Math.max(...JSON.parse(data).map(item =>item.id))+1;
            const newProduct = {
                id:maxId,
                title:request.body.title,
                price:request.body.price,
                image:request.file.originalname
            }
            totalProducts = [...totalProducts, newProduct];
            fs.writeFile(path.join(__dirname,"../public", "db.json"), JSON.stringify(totalProducts),(error)=>{
                if(error){
                    console.log(error);
                    response.status(404).json({ error: "Ocurrio un error al agregar" });
                    return;
                }
                response.status(200).json(totalProducts);
            })
        }
    })
    
})


// MODIFICAR UN PRODUCTO
router.put("/:id", upload.single("myFile") ,(request, response)=> {
    fs.readFile(path.join(__dirname,"../public", "db.json"),(error, data)=> {
        if(error){
            response.status(404).json({error:"No se encontro el archivo"})
        }else{
            let getProducts = JSON.parse(data);
            const getIndex = getProducts.findIndex(item => item.id === parseInt(request.body.select));
            const update = {
                id:parseInt(request.body.select),
                title:request.body.title,
                price:request.body.price,
                image:request.file.originalname
            }
            getProducts[getIndex] = update;
            fs.writeFile(path.join(__dirname,"../public", "db.json"), JSON.stringify(getProducts),(error)=>{
                if(error){
                    console.log(error);
                    response.status(404).json({ error: "Ocurrio un error al agregar" });
                    return;
                }
                response.status(200).json({actualizacion:"Exitosa"});
            })
            
        }
    })
    
})

// ELIMINAR UN PRODUCTO
router.delete("/:id", (request, response)=>{
    fs.readFile(path.join(__dirname,"../public", "db.json"),(error, data)=>{
        if(error){
            response.status(404).json({ error:"No se encontro el archivo" });
        }else{
            const filterData = JSON.parse(data).filter(item => item.id !== parseInt(request.params.id));
            fs.writeFile(path.join(__dirname,"../public", "db.json"), JSON.stringify(filterData),(error)=>{
                if(error){
                    console.log(error);
                    response.status(404).json({ error: "Ocurrio un error al agregar" });
                    return;
                }
                response.status(200).json({actualizacion:"Exitosa"});
            })
        }
    })
})




module.exports = router;