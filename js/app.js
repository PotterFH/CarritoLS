const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners(){
    //Cuando se de click se agregrara al carrito
    listaCursos.addEventListener('click', agregarCurso);

    //Eliminafr cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Trae los cursos del localstorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') || []);
        carritoHTML();
    })

    //Boton vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        //Se uso una funcion anonima
        articulosCarrito = [];
        limpiarHTML();
    })
}

//Funciones
function agregarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains('agregar-carrito')){
        //console.log('Agregando al carrito...')
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
    
}

//Eliminar un curso del carrito
function eliminarCurso(e){
    //console.log(e.target.classList);
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id'); //Extraer el id

        //Elimina del arreglo de articulos carrito por el data-id
        //Filter con !== traera el arreglo original sin el id que coincida
        //articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        articulosCarrito = articulosCarrito.filter( curso => {
            if(curso.id === cursoId){
                if(curso.cantidad > 1){
                    //console.log(curso.cantidad)
                    curso.cantidad--;
                    return curso;
                    
                }else{
                    delete curso;
                }
            }else{
                return curso;
            }
        });
        carritoHTML();

}
}

//Extraer la informacion del curso al que se le dio click
function leerDatosCurso(curso){
    //console.log(curso);

    //Crerar un objewto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some ( curso => curso.id === infoCurso.id);
    //console.log(existe);
    if(existe){
        //Actualizar la cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++; //Retorna el objeto actualizado
                return curso;
            }else{
                return curso; //Retorna los obnjetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos];
    }else{
            //Agregar elementos al arreglo de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
    //console.log(articulosCarrito)
    }



    carritoHTML();
}

//Muestra el carrito de comprars en el html
function carritoHTML(){

    //Limpiar el HTML
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
        <td> <img src='${curso.imagen}' width='100'> </td>
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad} </td>
        <td>
            <a href='#' class='borrar-curso' data-id='${id}'> X </a>
        </td>
        `;

        //Agrega el HTML en el tbody
        contenedorCarrito.appendChild(row);
    });

    //Sincronizar al storage
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Vacia el carrito
function limpiarHTML() {
    //Forma lenta
    //contenedorCarrito.innerHTML = '';

    //Forma optimizada
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}