
let idVehiculoSeleccionado = null;

function ObtenerVehiculos() {
    fetch("http://localhost:5200/api/CargaVehiculo")
        .then((respuesta) => respuesta.json())
        .then((data) => {
            console.log(data);
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
        tr.insertCell(0).innerHTML = element.id || "";
        tr.insertCell(1).innerHTML = element.marca;
        tr.insertCell(2).innerHTML = element.modelo;
        tr.insertCell(3).innerHTML = element.año;
        tr.insertCell(4).innerHTML = element.patente;
        tr.insertCell(5).innerHTML = element.km;
        tr.insertCell(6).innerHTML = element.fechaIngreso


        // Formato visual para el estado disponible
        let celdaDisponible = tr.insertCell(7);
        if (element.disponible === true || element.disponible === "true") {
            celdaDisponible.innerHTML = '<span class="badge-disponible">Disponible</span>';
        } else {
            celdaDisponible.innerHTML = '<span class="badge-no-disponible">No Disponible</span>';
        }
        let tdAcciones = tr.insertCell(8);
        tdAcciones.classList.add("text-center");

        // Botón Editar
        let editar = document.createElement("button");
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
            console.log("ID Para ELIMINAR:", element.Id);
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

    const modalElement = document.getElementBById('modalRegistrarVehiculo');
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
    try {
        const response = await fetch("http://localhost:5200/api/CargaVehiculo", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(altaVehiculo)
        });

        if (!response.ok) {
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
    document.getElementById("editarFechaIngreso").value = vehiculo.fechaingreso || vehiculo.FechaIngreso || "";
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
        // El método nativo correcto para ocultar un <dialog> es .close()
        modal.close();

        // Limpiamos la variable global por seguridad
        idVehiculoSeleccionado = null;
        console.log("Modal de edición cerrado correctamente.");
    } else {
        console.error("No se encontró el modal con ID 'modalEditarVehiculo' para cerrar.");
    }
}


function EliminarVehiculo(idVehiculoSeleccionado) {
          vehiculo.id = idVehiculoSeleccionado;
    if (!confirm(`¿Estás seguro de que querés eliminar el vehículo con ID: ${idVehiculoSeleccionado}?`)) {
        return; // Si cancela, frena la función acá
    }

    fetch(`http://localhost:5200/api/CargaVehiculo/${idVehiculoSeleccionado}`, {
        method: "DELETE"
    })
        .then((respuesta) => {
            // Verificamos si el servidor aceptó el borrado (status 200 al 299)
            if (respuesta.ok) {
                alert("Vehículo eliminado con éxito.");
                ObtenerVehiculos(); // Recargamos la tabla
            } else {
                alert("No se pudo eliminar el vehículo.");
            }
        })
        .catch((error) => {
            console.error("Error en la petición de borrado:", error);
        });

}
