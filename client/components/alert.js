system.cmp.alert = {
    controller: function(args) {
        var speed = 275;
        var ctrl = {
            lastMessage: m.prop(''),
            show: function() {
                var alertElem = util.q('.alert');
                if(!alertElem) return;
                ctrl.lastMessage(args.alert().message);
                Velocity(alertElem, 'stop');
                Velocity(alertElem, {
                    bottom:0
                }, speed).then(function(el) {
                    ctrl.hide(3500);
                })
            },
            hide: function(del) {
                var alertElem = util.q('.alert');
                if(!alertElem) return;
                var alert = args.alert() || {};
                if(!alert.cb) {
                    if(!del) {
                        Velocity(alertElem, 'stop');
                    }
                    Velocity(alertElem, {
                        bottom:-55
                    }, {delay: del}, speed).then(function(){
                        ctrl.lastMessage('');
                    });
                }
                
                system.shared.alertWrapper(alert);
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        var alert = args.alert || {};
        
        if(alert.message) {
            ctrl.show();
        } else {
            ctrl.hide();
        }
        
        return m('div.alert.' + alert.type, {
                onclick: ctrl.hide.bind(this, 0)
            }, alert.message
        );
    }
};
