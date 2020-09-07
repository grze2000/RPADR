$(() => {
    const socket = io();
    let control = false;

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

    $(document).on('keydown keyup', e => {
        if(!control || e.originalEvent.repeat) return;
        if(e.which in keys) {
            socket.emit(e.type, keys[e.which]);
        }
        $(`.${keys[e.which]} img`).css('opacity', e.type === 'keydown' ? 1 : 0.5);
    });
});
