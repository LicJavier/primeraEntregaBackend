import config from "../config/config.js";
import fs from 'fs/promises'
import moment from "moment";
class Contenedor{
    constructor(){
        this.archivoUrl = config.db.location;
    }
}


class Productos{
    constructor(ruta){
        this.ruta = ruta;
    }
    async getAll(){
        //Object[] - Devuelve un array con los objetos presentes en el archivo.
        try {
            const objetos = await fs.readFile(this.ruta, 'utf-8' );
            return JSON.parse(objetos);
        } catch (error) {
            console.log(error);
            return [];   
        }
    };
    async save(object){
        //Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            const guardar = await this.getAll();
            let idNuevo; 
            guardar.length === 0 ? idNuevo = 1 : idNuevo = guardar[guardar.length - 1 ].id + 1;
            const objetoNuevo = {id: idNuevo, timestamp: moment().format('MMMM Do YYYY, h:mm:ss a') , ...object};
            guardar.push(objetoNuevo);
            await fs.writeFile(this.ruta, JSON.stringify(guardar, null,2))
            return idNuevo;
        } catch (error) {
            return [];
        }
    }
    async getById(Number){
        //Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            const guardar = await this.getAll();
            let nuevoObjeto = guardar.filter( elemento => elemento.id == Number);
            return nuevoObjeto;
        } catch (error) {
            return [];
        }
    };
    
    async deleteById(Number){
        //void - Elimina del archivo el objeto con el id buscado.
        try {
            const elementos = await this.getAll();
            const borrarElemento = elementos.findIndex(elemento=> elemento.id == Number);
            borrarElemento == -1
            ? console.log("No se encontro el elemento") 
            : elementos.splice(borrarElemento,1)
            await fs.writeFile(this.ruta, JSON.stringify(elementos, null,2))
            return (`Objeto ${Number} eliminado`)
        } catch (error) {
            
        }
    };
    async deleteAll(){
        // void - Elimina todos los objetos presentes en el archivo.
        try {
            let borrar = [];
            await fs.writeFile(this.ruta, JSON.stringify(borrar, null,1))
            return [];
        } catch (error) {
            return [];
        }
    };
    async putObject(object , id){
        //Number - Recibe un objeto y un id, lo guarda en el archivo.
        try {
            const guardar = await this.getAll();
            guardar.splice(guardar.findIndex(e=>e.id==id),1)
            const objetoNuevo = {id: id, ...object};
            guardar.push(objetoNuevo);
            await fs.writeFile(this.ruta, JSON.stringify(guardar, null,2))
            return objetoNuevo;
        } catch (error) {
            return [];
        }
    };
}

export default Productos;

class Carrito{
    constructor(ruta){
        this.ruta = ruta;
    }
    async getAll(){
        //Object[] - Devuelve un array con los objetos presentes en el archivo.
        try {
            const objetos = await fs.readFile(this.ruta, 'utf-8' );
            return JSON.parse(objetos);
        } catch (error) {
            console.log(error);
            return [];   
        }
    };
    async save(object){
        //Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try {
            const guardar = await this.getAll();
            let idNuevo; 
            guardar.length === 0 ? idNuevo = 0 : idNuevo = guardar[guardar.length - 1 ].id + 1;
            const objetoNuevo = { id: idNuevo , timestampCarrito: moment().format('MMMM Do YYYY, h:mm:ss a')  , productos: [object] };
            guardar.push(objetoNuevo);
            await fs.writeFile(this.ruta, JSON.stringify(guardar, null,2))
            return objetoNuevo;
        } catch (error) {
            return [];
        }
    }
    async getById(Number){
        //Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try {
            const guardar = await this.getAll();
            let nuevoObjeto = guardar.filter( elemento => elemento.id == Number);
            if (nuevoObjeto.length === 0) {
                nuevoObjeto = null;
            }
            return nuevoObjeto;
        } catch (error) {
            return [];
        }
    };
    
    async deleteById(Number){
        //void - Elimina del archivo el objeto con el id buscado.
        try {
            const elementos = await this.getAll();
            const borrarElemento = elementos.findIndex(elemento=> elemento.id === Number);
            borrarElemento == -1
            ? console.log("No se encontro el elemento") 
            : elementos.splice(borrarElemento,1)
            await fs.writeFile(this.ruta, JSON.stringify(elementos, null,2))
            return (`Objeto ${Number} eliminado`)
        } catch (error) {
            
        }
    };
    async deleteAll(){
        // void - Elimina todos los objetos presentes en el archivo.
        try {
            let borrar = [];
            await fs.writeFile(this.ruta, JSON.stringify(borrar, null,1))
            return [];
        } catch (error) {
            return [];
        }
    };
    async postProducto(object , id){
        //Number - Recibe un objeto y un id, lo guarda en el archivo.
        try {
            const guardar = await this.getAll();
            const carritoViejo = await this.getById( id );
            guardar.splice(guardar.findIndex( e => e.id == parseInt(id)) , 1 );
            carritoViejo[0].productos.push( object[0] );
            console.log(carritoViejo[0].productos)
            guardar.push(carritoViejo[0]);
            await fs.writeFile(this.ruta, JSON.stringify(guardar, null,2));
            return carritoViejo;
        } catch (error) {
            return [];
        }
    };
    async deleteProductById( cartId , productId ){
        //void - Elimina el producto de un carrito con el id buscado.
        try {
            const elementos = await this.getAll();
            const indexCart = elementos.findIndex( e => e.id == cartId );
            const carrito = elementos.filter(elemento=> elemento.id == cartId );
            console.log(carrito[0].productos.findIndex((elemento)=>{
                elemento.id = 5;
            }  ))
            const productoEliminable = carrito[0].productos.findIndex((elemento)=>{
                elemento.id = productId;
            }  );
            productoEliminable == -1
            ? console.log("No se encontro el elemento") 
            : elementos[indexCart].splice( productoEliminable ,1 )
            await fs.writeFile(this.ruta, JSON.stringify(elementos, null,2))
            return (`Objeto ${Number} eliminado`)
        } catch (error) {
            
        }
    };
    async putObject( object , id ){
        //Number - Recibe un objeto y un id, lo guarda en el archivo.
        try {
            const guardar = await this.getAll();
            guardar.splice( guardar.findIndex( e => e.id == id ) , 1 )
            const objetoNuevo = object;
            guardar.push( objetoNuevo[0] );
            await fs.writeFile( this.ruta , JSON.stringify( guardar , null , 2 ))
            return objetoNuevo;
        } catch ( error ) {
            return [];
        }
    };
}

export { Carrito };