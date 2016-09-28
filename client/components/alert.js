system.cmp.alert = {
    controller: function(args) {
        var speed = 275;
        var ctrl = {
            show: function() {
                setTimeout(function() {
                    Velocity(util.q('.alert'), {
                        bottom:0
                    }, speed).then(function(el) {
                        if(ctrl.alert) {
                            ctrl.hide(null)
                        }
                    })
                }, 1)
                
            },
            hide: function(e) {
                Velocity(util.q('.alert'), {
                    bottom:-55
                }, {delay: (e? 0 : 1500)}, speed)
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        var alert = args.alert();
        
        if(alert) {
            ctrl.show()
        }
        return m('div.alert.' + alert.type, {
                onclick: ctrl.hide
            }, alert.message
        );
    }
};
