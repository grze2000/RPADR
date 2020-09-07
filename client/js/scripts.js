$(() => {
    const socket = io();
    let control = false;
    let canvas = $("#canvas")[0];
    let wsavc = new WSAvcPlayer(canvas, "webgl");
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"

    const keys = {
        87: 'up',
        38: 'up',
        65: 'left',
        37: 'left',
        83: 'down',
        40: 'down',
        68: 'right',
        39: 'right'
    }

    socket.on('connect', () => {
        console.log('Connected');
        wsavc.connect(protocol + '//' + window.location.host + ':3000/video');
    });

    socket.on('status', data => {
        control = data.control;
        $('#role').text(control ? 'Operator' : 'Widz');
        $('#users').text(data.users);
        if(control) {
            $('body').addClass('green');
            $('.control').addClass('active');
        }
    });

    socket.on('distance', distance => {
        $('#distance').text(distance);
    });

    socket.on('disconnect', () => {
        wsavc.disconnect();
        let gl = canvas.getContext("webgl");
        gl.clearColor(106.0, 206.0, 252.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT)
        $("#users").text("0");
        $("#distance").text("0");
        $(".control").removeClass("active");
        $("body").removeClass("green");
    });

    $(document).on('keydown keyup', e => {
        if(!control || e.originalEvent.repeat) return;
        if(e.which in keys) {
            socket.emit(e.type, keys[e.which]);
        }
        $(`.${keys[e.which]} img`).css('opacity', e.type === 'keydown' ? 1 : 0.5);
    });
});
