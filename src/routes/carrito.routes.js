import Productos, { Carrito } from '../utils/contenedor.js';
import express from 'express'

const routerCarrito = express.Router();
const productos = new Productos('./DB/productos.txt');
const carrito = new Carrito('./DB/carrito.txt');
const administrador = true;
const DB_CARRITO = []

const usuario = function( req , res , next ){
    administrador ? next() : res.status(401).json({ error: 401, descripción: "acceso no permitido, solo administradores" });
}
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

routerCarrito.use( async ( req , res , next )=>{
    if (DB_CARRITO.length === 0) {
        DB_CARRITO.push(await carrito.getAll());
    }
    next()
})

routerCarrito.post('/', [usuario] , async ( req , res )=>{
    let productoNuevo = await carrito.save(req.body);
    DB_CARRITO.push(req.body);
    res.status(201).json({ data: productoNuevo, id: productoNuevo.id });
});

routerCarrito.delete('/:id', [usuario] , async ( req , res )=>{
    let id = req.params.id;
    let productId = await carrito.deleteById(parseInt(id));
    DB_CARRITO.splice(DB_CARRITO.findIndex(e=>e.id == id),1)
    res.status(202).json({"producto eliminado": productId});
});

routerCarrito.get('/:id/productos', [usuario], async ( req , res )=>{
    let id = parseInt(req.params.id);
    let productId = extraerProducto(id);
    let condicional = DB_CARRITO[0].findIndex(e=>e.id == id);
    condicional === -1 ? res.status(404).json({error: 'El producto no se encontro'}) 
    :res.status(200).json(productId);    
});

routerCarrito.post('/:id/productos', [usuario] ,async ( req , res )=>{
    const producto = await productos.getById(parseInt(req.body.id));
    const idCarrito = parseInt(req.params.id);
    const actualizacion = await carrito.postProducto( producto , idCarrito );
    res.status(201).json({  data :  actualizacion });
});

routerCarrito.delete('/:id/productos/:id_prod', [usuario] ,async ( req , res )=>{
    
    const id = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod);
    const cart = await carrito.getById(id);
    console.log(cart)
    const indexProduct = cart[0].productos.findIndex( e => e.id === id_prod)
    if (indexProduct === -1) {
        console.log('no se encontro el producto a eliminar');
    } else {
        cart[0].productos.splice( indexProduct , 1 );
        await carrito.putObject( cart , id);
    }
    res.status(202).json({"producto eliminado": cart});
});

function extraerProducto(params) {
    let producto = DB_CARRITO[0].filter(element=> element.id === params);
    return producto;
}


export default routerCarrito;