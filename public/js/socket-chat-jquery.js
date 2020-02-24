var params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre');
let sala = params.get('sala');

//referencias de jquery
let divUsuarios = $('#divUsuarios');
let formEnviar = $('#formEnviar');
let txtmensaje = $('#mensaje');
let divChatbox = $('#divChatbox');



// funciones para renderizar usuarios
function renderizarUsuarios(personas) {

    console.log(personas);


    var html = '';

    html += '<li>';
    html += '<a href = "javascript:void(0)"class = "active" > Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';


    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a class="text-center" data-id="' + personas[i].id + '" href="javascript:void(0)"><span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}


function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        /* html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'; */
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {

        html += '<li class="animated fadeIn">';

        /* if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        } */

        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//listeners , escuchas de jquery
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();

    if (txtmensaje.val().trim().length === 0) {
        return;
    }

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtmensaje.val()
    }, function(mensaje) {
        txtmensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

});