
let idVehiculoSeleccionado = null;
let listaVehiculosExistentes =[];

function ObtenerVehiculos() {
    fetch("http://localhost:5200/api/CargaVehiculo")
        .then((respuesta) => respuesta.json())
        .then((data) => {
            console.log(data);
            listaVehiculosExistentes = data;
            mostrarVehiculo(data);
        })
        .catch((error) => {
            console.log(error);
        });

}
function mostrarVehiculo(data) {
    const tbody = document.getElementById("tablaVehiculo");
    tbody.innerHTML = "";

    data.forEach((element) => {
        let tr = tbody.insertRow();
      
  let tdMarca = tr.insertCell(0);
        tdMarca.innerHTML = element.marca;
        tdMarca.setAttribute("data-label", "Marca");

        let tdModelo = tr.insertCell(1);
        tdModelo.innerHTML = element.modelo;
        tdModelo.setAttribute("data-label", "Modelo");

        let tdAnio = tr.insertCell(2);
        tdAnio.innerHTML = element.año;
        tdAnio.setAttribute("data-label", "Año");

        let tdPatente = tr.insertCell(3);
        tdPatente.innerHTML = element.patente;
        tdPatente.setAttribute("data-label", "Patente");

        let tdKm = tr.insertCell(4);
        tdKm.innerHTML = element.km;
        tdKm.setAttribute("data-label", "Km");

        let tdFecha = tr.insertCell(5);
        tdFecha.innerHTML = element.fechaIngreso;
        tdFecha.setAttribute("data-label", "Fecha Ingreso");

        // Formato visual para el estado disponible
     let celdaDisponible = tr.insertCell(6);
        celdaDisponible.setAttribute("data-label", "Estado");
        if (element.disponible === true || element.disponible === "true") {
            celdaDisponible.innerHTML = '<span class="badge-disponible">Disponible</span>';
        } else {
            celdaDisponible.innerHTML = '<span class="badge-no-disponible">No Disponible</span>';
        }
        let tdAcciones = tr.insertCell(7);
        tdAcciones.classList.add("text-center");

        // Botón Editar
        let editar =  document.createElement("button");
        editar.textContent = "Editar";
        editar.classList.add("btn", "btn-warning", "btn-sm", "me-2", "text-dark");
        editar.onclick = function () {
            CargarDatosEnModal(element);
        };

        // Botón Eliminar
        let eliminar = document.createElement("button");
        eliminar.textContent = "Eliminar";
        eliminar.classList.add("btn", "btn-danger", "btn-sm");

        eliminar.onclick = function () {

            if (element.disponible === true || element.disponible === "true") {
                alert("No es posible eliminar un Vehiculo donde su estado es DISPONIBLE.");
                console.log("Bloqueado:no es posible eliminar este Vehiculo.");
                return;
            }
            console.log("ID Para ELIMINAR:", element.id);
            EliminarVehiculo(element.id);
        };

        // botones  misma celda de "Acciones"
        tdAcciones.appendChild(editar);
        tdAcciones.appendChild(eliminar);
    });
};

ObtenerVehiculos();


// 1. FUNCIÓN PARA CREAR (POST)

async function AbrirModalInscribirVehiculos() {

    document.getElementById("Marca").value = "";
    document.getElementById("Modelo").value = "";
    document.getElementById("Año").value = "";
    document.getElementById("Patente").value = "";
    document.getElementById("Km").value = "";
    document.getElementById("FechaIngreso").value = "";
    document.getElementById("Disponible").checked = false;

    const modalElement = document.getElementById('modalRegistrarVehiculo');
    if (modalElement) {
        if (window.bootstrap) {
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.modalElement(modalElement);
            modal.show();
        } else if (typeof modalElement.showModal === 'function') {
            modalElement.showModal();
        }
    }



}


async function InscribirVehiculo() {


    var altaVehiculo = {
        Marca: document.getElementById("Marca").value.trim().toUpperCase(),
        Modelo: document.getElementById("Modelo").value.trim().toUpperCase(),
        Año: document.getElementById("Año").value.trim(),
        Patente: document.getElementById("Patente").value.trim().toUpperCase(),
        Km: document.getElementById("Km").value.trim(),
        fechaingreso: document.getElementById("FechaIngreso").value.trim(),
        Disponible: document.getElementById("Disponible").checked
    };

    //VALIDACION CAMPOS EN BLANCO
    if ((altaVehiculo.Marca === "") ||
        (altaVehiculo.Modelo === "") ||
        (altaVehiculo.Año === "") ||
        (altaVehiculo.Patente === "")
        ) {
        alert("Debe completar todos los campos para poder registrar un Vehiculo");
        return;
    } 
    //Validacion Anio. 
    let añoNumerico = parseInt(altaVehiculo.Año, 10);
    let añoActual = new Date().getFullYear();
    
    if(isNaN(añoNumerico) ||añoNumerico <1900 || añoNumerico > añoActual ){
        alert("El año no puede ser menor que 1900 y mayor que el actual. ");
        console.log("Error al ingresar el año.");
        return;
    }
     //VALIDACION PATENTE (3)LETRAS(3)DIGITOS
    let formatoPatente = /^[A-Z]{3}\d{3}$/;
    if(!formatoPatente.test(altaVehiculo.Patente)){
        alert("Debe insertar el Numero de placa de esta manera Ej:AAA123");
        console.log("El formato de la patente insertada esta mal.");
        return;
    }

    let patenteRepetida = listaVehiculosExistentes.some(
        vehiculo => vehiculo.patente.trim().toUpperCase() === altaVehiculo.Patente
    );
    if (patenteRepetida){ 
        alert("Error: La patente ya se encuentra registrada en otro vehiculo.");
        console.log("Intento de registro de patente duplicada", altaVehiculo.Patente);
        return;       
    }

   
    //VALIDACION KM(-)
    if (altaVehiculo.Km < 0) {
        alert("No es posible inscribir un vehiculo con Km Negativos");
        console.log("Los km no pueden ser negativos");
        return;
    }

    //VALIDACION PARA LA FECHA
    let formatoFechaValida = /^\d{4}-\d{2}-\d{2}$/;
    if(!formatoFechaValida.test(altaVehiculo.fechaingreso)){
        alert("El formato de la fecha es incorrecto debe usar YYYY-MM-DD.");
        console.log("Error al insertar fecha, formato incorecto.");
        return;
    }

   


    try {
        const response = await fetch("http://localhost:5200/api/CargaVehiculo", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(altaVehiculo)
        });

        if (!response.ok) {
            alert("Todos los campos debe estar completos")
            console.error("Error al crear:", await response.text());
            return;
        }
        console.log("Alta del Auto creada correctamente");

        const modalElement = document.getElementById('modalRegistrarVehiculo');
        if (modalElement) {
            if (window.bootstrap && bootstrap.Modal.getInstance(modalElement)) {
                bootstrap.Modal.getInstance(modalElement).hide();
            } else if (typeof modalElement.close === 'function') {
                modalElement.close();
            }
        }

        LimpiarFormulario()
        ObtenerVehiculos();
    }
    catch (error) {
        console.error("Error de red", error);
    }
    function LimpiarFormulario() {
        document.getElementById("Marca").value = "";
        document.getElementById("Modelo").value = "";
        document.getElementById("Año").value = "";
        document.getElementById("Patente").value = "";
        document.getElementById("Km").value = "";
        document.getElementById("FechaIngreso").value = "";
        document.getElementById("Disponible").checked = false;
    }

}

// 2. FUNCIÓN PARA ACTUALIZAR (PUT)
function CargarDatosEnModal(vehiculo) {

    idVehiculoSeleccionado = vehiculo.id;


    document.getElementById("editarMarca").value = vehiculo.marca || "";
    document.getElementById("editarModelo").value = vehiculo.modelo || "";
    document.getElementById("editarAño").value = vehiculo.año || "";
    document.getElementById("editarPatente").value = vehiculo.patente || "";
    document.getElementById("editarKm").value = vehiculo.Km || vehiculo.km || "";
    document.getElementById("editarFechaIngreso").value = vehiculo.fechaingreso ||  "";
    document.getElementById("editarDisponible").checked = (vehiculo.disponible === true || vehiculo.disponible === "true");

    const modal = document.getElementById("modalEditarVehiculo");
    if (modal) {
        modal.showModal();
    }
}

async function GuardarCambiosEditar() {

    if (!idVehiculoSeleccionado) {
        alert("Error: No se ha seleccionado ningun Vehiculo.");
        return;
    }


    var vehiculoActualizado = {
        Id: idVehiculoSeleccionado,
        Marca: document.getElementById("editarMarca").value.trim().toUpperCase(),
        Modelo: document.getElementById("editarModelo").value.trim().toUpperCase(),
        Año: document.getElementById("editarAño").value.trim(),
        Patente: document.getElementById("editarPatente").value.trim().toUpperCase(),
        Km: document.getElementById("editarKm").value.trim(),
        fechaingreso: document.getElementById("editarFechaIngreso").value.trim(),
        Disponible: document.getElementById("editarDisponible").checked
    };
//VALIDACION PARA Campos Vacios
      if ((vehiculoActualizado.Marca === "") ||
        (vehiculoActualizado.Modelo === "") ||
        (vehiculoActualizado.Año === "") ||
        (vehiculoActualizado.Patente === "")||
        (vehiculoActualizado.fechaingreso ==="")
        ) {
        alert("Debe completar todos los campos para poder registrar un Vehiculo");
        return;
    } 

          //Validacion Anio. 
    let añoNumerico = parseInt(vehiculoActualizado.Año, 10 );
    let añoActual = new Date().getFullYear();
    
    if(isNaN(añoNumerico) ||añoNumerico <1900 || añoNumerico > añoActual ){
        alert("El año no puede ser menor que 1900 y mayor que el actual. ");
        console.log("Error al ingresar el año.");
        return;
    }
    //VALIDACION PARA KM(-)
    if (vehiculoActualizado.Km < 0) {
        alert("No es posible inscribir un vehiculo con Km Negativos");
        console.log("Los km no pueden ser negativos");
        return;
    }
       //VALIDACION PATENTE (3)LETRAS(3)DIGITOS
    let formatoPatente = /^[A-Z]{3}\d{3}$/;
    if(!formatoPatente.test(vehiculoActualizado.Patente)){
        alert("Debe insertar el Numero de placa de esta manera Ej:AAA123");
        console.log("El formato de la patente insertada esta mal.");
        return;
    }


    // VALIDACION PATENTE REPETIDA
   let patenteRepetidaEditar = listaVehiculosExistentes.some(
        vehiculo => vehiculo.patente &&
                vehiculo.patente.trim().toUpperCase() === vehiculoActualizado.Patente && 
                vehiculo.id !== idVehiculoSeleccionado 
    );
    if (patenteRepetidaEditar){
        alert("Error: no se puede guardar los cambios porque la patente ya pertenece a otro vehiculo registrado.");
        console.log("Intento de duplicacion de patente en edicion", vehiculoActualizado.patente);
        return;
    }

        // VALIDACION PARA LA FECHA

   
    let formatoFechaValida = /^\d{4}-\d{2}-\d{2}$/;  
    if(!formatoFechaValida.test(vehiculoActualizado.fechaingreso)){
        alert("El formato de la fecha es incorrecto debe usar YYYY-MM-DD.");
        console.log("Error al insertar fecha, formato incorecto.");
        return;
    }

 
  


    try {
        const respuesta = await fetch(`http://localhost:5200/api/CargaVehiculo/${idVehiculoSeleccionado}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vehiculoActualizado)
        });


        if (respuesta.ok) {
            alert("Vehiculo Actualizado con Exito")

            const modal = document.getElementById("modalEditarVehiculo");
            if (modal) {
                modal.close();
            }
            idVehiculoSeleccionado = null;
            ObtenerVehiculos();
        } else {
            const detalleError = await respuesta.text();
            console.error("Detalle del rechazo del servidor:", detalleError);
            alert("No se pudo Actualizar el Vehiculo");
        }

    } catch (error) {
        console.error("Error en la peticion:", error);
    }
}


function abrirModalEditar(id) {
    const modal = document.getElementById("modalEditarVehiculo");
    console.log("Cargar Datos del vehiculo" + id);

    modal.showModal();
}


function cerrarModal() {
    const modal = document.getElementById("modalEditarVehiculo");
    if (modal) {

        modal.close();


        idVehiculoSeleccionado = null;
        console.log("Modal de edición cerrado correctamente.");
    } else {
        console.error("No se encontró el modal con ID 'modalEditarVehiculo' para cerrar.");
    }
}


function EliminarVehiculo(idVehiculoSeleccionado) {

    if (!confirm(`¿Estás seguro de que querés eliminar el vehículo con ID: ${idVehiculoSeleccionado}?`)) {
        return;

    }

    fetch(`http://localhost:5200/api/CargaVehiculo/${idVehiculoSeleccionado}`, {
        method: "DELETE"
    })
        .then((respuesta) => {

            if (respuesta.ok) {
                alert("Vehículo eliminado con éxito.");
                ObtenerVehiculos();
            } else {
                alert("No se pudo eliminar el vehículo.");
            }
        })
        .catch((error) => {
            console.error("Error en la petición de borrado:", error);
        });

}
