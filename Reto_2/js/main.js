window.onload = () => {
    inicializar();

    document.querySelector('#btnAgregarMascota').addEventListener('click', agregarMascotaClick);
    document.querySelector('#btnGuardarMascota').addEventListener('click', guardarMascotaClick);
    document.querySelector('#btnCerrarModalMascota').addEventListener('click', cerrarModalMascotaClick);
    document.querySelector('#fileImagen').addEventListener('change', fileImagenChange);
}

var inicializar = () => {
    listarMascota();

    let url = `./data/paises.json`;
    fetch(url)
        .then(r => r.json())
        .then(cargarListaPaises);
};

var cargarListaPaises = (data) => {
    if (data == null) return;

    let options = data.map(x => `<option value="${x.id}">${x.name}</option>`).join('');

    document.querySelector('#selPais').innerHTML = options;
}

var obtenerListaMascota = () => localStorage.listaMascota == null ? [] : JSON.parse(localStorage.listaMascota);

var validarMascota = () => {

};

var agregarMascotaClick = (e) => {
    e.preventDefault();
    limpiarDatos();
    abrirModal('NUEVA MASCOTA');
};

var cerrarModalMascotaClick = (e) => {
    e.preventDefault();
    document.querySelector('#modalRegistro').classList.remove('open');
};

var obtenerIdMascota = () => {
    let listaMascota = obtenerListaMascota();
    let id = 1;
    if (listaMascota.length == 0) return id;
    let listaId = listaMascota.map(x => x.id);
    id = Math.max(...listaId) + 1;
    return id;
};

var guardarMascotaClick = (e) => {
    e.preventDefault();

    let id = document.querySelector('#modalRegistro').getAttribute('data-id');

    let registro = {};

    let listaMascota = obtenerListaMascota();

    let index = -1;

    if (id != null) {
        registro = listaMascota.find(x => x.id == id);
        index = listaMascota.findIndex(x => x.id == id);
    } else id = obtenerIdMascota();

    registro.id = id;
    registro.nombre = document.querySelector('#txtNombre').value;
    registro.descripcion = document.querySelector('#txtDescripcion').value;
    registro.telefono = document.querySelector('#txtTelefono').value;
    registro.correo = document.querySelector('#txtCorreo').value;
    registro.imagen = document.querySelector('#imgImagen').getAttribute('src');

    let idPais = document.querySelector('#selPais').value;

    registro.pais = idPais == null ? null : {
        id: idPais,
        nombre: document.querySelector('#selPais option:checked').textContent
    };


    if (index == -1) listaMascota.push(registro);
    else listaMascota[index] = registro;

    localStorage.listaMascota = JSON.stringify(listaMascota);

    listarMascota();

    document.querySelector('#modalRegistro').classList.remove('open');
};

var editarMascotaClick = (e) => {
    e.preventDefault();
    abrirModal('EDITAR MASCOTA');
    let id = e.currentTarget.getAttribute('data-id');
    let listaMascota = obtenerListaMascota();
    let item = listaMascota.find(x => x.id == id);

    document.querySelector('#modalRegistro').setAttribute('data-id', item.id);
    document.querySelector('#txtNombre').value = item.nombre;
    document.querySelector('#txtDescripcion').value = item.descripcion;
    document.querySelector('#txtTelefono').value = item.telefono;
    document.querySelector('#txtCorreo').value = item.correo;
    document.querySelector('#imgImagen').setAttribute('src', item.imagen);
    if (item.pais == null) document.querySelector('#selPais option:first-child').selected = true;
    else document.querySelector('#selPais').value = item.pais.id;
};

var eliminarMascotaClick = (e) => {
    e.preventDefault();
    let data = {
        id: e.currentTarget.getAttribute('data-id')
    }
    confirmar('Mensaje', '¿Está seguro que desea eliminar el registro?', 'Sí', 'No', confirmarEliminarMascota, cancelarEliminarMascota, data);
};

var confirmarEliminarMascota = (e) => {
    let id = e.id;
    let listaMascota = obtenerListaMascota();
    let index = listaMascota.findIndex(x => x.id == id);
    listaMascota.splice(index, 1);
    localStorage.listaMascota = JSON.stringify(listaMascota);
    listarMascota();
}

var cancelarEliminarMascota = (e) => {

}

var listarMascota = () => {
    let listaMascota = obtenerListaMascota();

    let elementoLista = document.querySelector('#lstMascota');

    if (listaMascota.length == 0) {
        elementoLista.innerHTML = '<ul>No hay mascotas registradas</ul>';
        return;
    }

    let content = listaMascota.map(renderMascota).join('');

    elementoLista.innerHTML = `<ul>${content}</ul>`;

    document.querySelectorAll('.btnEliminarMascota').forEach(x => x.addEventListener("click", eliminarMascotaClick));
    document.querySelectorAll('.btnEditarMascota').forEach(x => x.addEventListener("click", editarMascotaClick));
    document.querySelectorAll('.cards .content ul li').forEach(x => x.addEventListener('mouseover', cardMouseOver));
    document.querySelectorAll('.cards .content ul li').forEach(x => x.addEventListener('mouseout', cardMouseOut));
};

var limpiarDatos = () => {
    document.querySelector('#modalRegistro').removeAttribute('data-id');
    document.querySelector('#txtNombre').value = '';
    document.querySelector('#txtDescripcion').value = '';
    document.querySelector('#txtTelefono').value = '';
    document.querySelector('#txtCorreo').value = '';
    document.querySelector('#selPais option:first-child').selected = true;
    document.querySelector('#fileImagen').value = '';
    document.querySelector('#imgImagen').setAttribute('src', './images/default-image.png');
}

var renderMascota = (data) => {
    let campoNombre = `<span class="nombreMascota">${data.nombre}</span>`;
    let campoDescripcion = `<p class="descripcionMascota">${data.descripcion}</p>`;
    let campoTelefono = `<span class="telefonoMascota">${data.telefono}</span>`;
    let campoCorreo = `<span class="correoMascota">${data.correo}</span>`;
    let campoTelefonoCorreo = `<div class="telefonoCorreoMascota">${campoTelefono} | ${campoCorreo}</div>`
    let campoPais = `<span class="paisMascota">${data.pais == null ? null : data.pais.nombre}</span>`;
    let btnEditar = `<a href="#" class="btnEditarMascota" data-id="${data.id}">Editar</a>`;
    let btnEliminar = `<a href="#" class="btnEliminarMascota" data-id="${data.id}">Eliminar</a>`
    let opciones = `<div class="opcionesMascota hide">${btnEditar}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${btnEliminar}</div>`;
    let campoImagen = data.imagen == null ? '' : `<img src='${data.imagen}'>`;

    let contentRender = `<li>${opciones}${campoImagen}${campoNombre}${campoTelefonoCorreo}${campoPais}${campoDescripcion}</li>`;

    return contentRender;
};

var abrirModal = (titulo) => {
    document.querySelector('#tituloModal').textContent = titulo;
    document.querySelector('#modalRegistro').classList.add('open');
    document.querySelector('#txtNombre').focus();
};

var confirmar = (titulo, mensaje, textButtonConfirm, textButtonCancel, callbackConfirm, callbackCancel, data) => {
    let body = document.body;
    let confirmElement = document.createElement('div');
    confirmElement.setAttribute('id', 'confirm');
    confirmElement.classList.add('confirm');
    let tituloContent = `<div class="header"><h3>${titulo}</h3></div>`;
    let mensajeContent = `<div class="content"><p>${mensaje}</p></div>`;
    let btnConfirm = `<button data-confirm="true">${textButtonConfirm}</button>`;
    let btnCancel = `<button data-confirm="false">${textButtonCancel}</button>`;
    let opcionesContent = `<div class="footer">${btnConfirm}${btnCancel}</div>`;
    let contentConfirm = `<div class="main">${tituloContent}${mensajeContent}<hr>${opcionesContent}</div>`;
    confirmElement.innerHTML = contentConfirm;
    body.appendChild(confirmElement);
    confirmElement.querySelector('button[data-confirm="true"]').addEventListener('click', () => {
        confirmElement.remove();
        callbackConfirm(data);
    });
    confirmElement.querySelector('button[data-confirm="false"]').addEventListener('click', () => {
        confirmElement.remove();
        callbackCancel(data);
    });
};

var fileImagenChange = function(e) {
    var tgt = e.currentTarget || window.event.srcElement,
        files = tgt.files;

    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function() {
            document.querySelector('#imgImagen').src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }
};

var cardMouseOver = (e) => {
    e.currentTarget.querySelector('.opcionesMascota').classList.remove('hide');
    e.currentTarget.classList.add('shadow');
}

var cardMouseOut = (e) => {
    e.currentTarget.querySelector('.opcionesMascota').classList.add('hide');
    e.currentTarget.classList.remove('shadow');
}