import Productos from '../utils/contenedor.js';
import express from 'express'
const routerProductos = express.Router();

//----------------------------------------------------------------------------------------------
//---------------------------------------DATA BASE----------------------------------------------
//----------------------------------------------------------------------------------------------
const productos = new Productos('./DB/productos.txt');
const administrador = true;
const DB_PRODUCTOS = [];

const usuario = function(req,res,next){
    administrador ? next() : res.status(401).json({ error: 401, descripción: "acceso no permitido, solo administradores" });
}

routerProductos.use(async ( req , res , next )=>{
    if (DB_PRODUCTOS.length === 0) {
        DB_PRODUCTOS.push(await productos.getAll());
    }
    console.log("primero paso por aca");
    next()
})

routerProductos.get('/',( req , res )=>{
    res.status(200).json(DB_PRODUCTOS);
});

routerProductos.get('/:id', [usuario], async ( req , res )=>{
    let id = parseInt(req.params.id);
    let productId = extraerProducto(id);
    let condicional = DB_PRODUCTOS[0].findIndex(e=>e.id == id);
    condicional === -1 ? res.status(404).json({error: 'El producto no se encontro'}) 
    :res.status(200).json(productId);    
});

routerProductos.post('/', [usuario] ,async ( req , res )=>{
    let productoNuevo = await productos.save(req.body);
    DB_PRODUCTOS.push(req.body);
    res.status(201).json({msg: "Producto agregado", data: req.body, id: productoNuevo });
});

routerProductos.put('/:id', [usuario] ,async ( req , res )=>{
    let id = req.params.id;
    let productId = await productos.putObject(req.body,id)
    DB_PRODUCTOS[0].push(productId);
    res.status(201).json({msg: "Producto modificado", data: productId, id: id });
});

routerProductos.delete('/:id', [usuario] ,async ( req , res )=>{
    let id = req.params.id;
    let productId = await productos.deleteById(parseInt(id));
    DB_PRODUCTOS.splice(parseInt(DB_PRODUCTOS.findIndex(e=>e.id == id)),1)
    res.status(202).json({"producto eliminado": productId});
});

function extraerProducto(params) {
    let producto = DB_PRODUCTOS[0].filter(element=> element.id === params);
    return producto;
}


export default routerProductos;