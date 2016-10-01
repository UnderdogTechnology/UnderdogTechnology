system.cmp.alert = {
    controller: function(args) {
<<<<<<< HEAD
        var speed = 275,
            key = 0;
        var ctrl = {
            alerts: [],
            timeout: m.prop(),
            timer: function(alerts) {
                clearTimeout(ctrl.timeout());
                ctrl.timeout(setTimeout(function() {
                    if(ctrl.alerts.length < 1) return;
                    
                    m.startComputation();
                    ctrl.alerts[ctrl.alerts.length - 1].hidden = true;
                    m.endComputation();
                    
                    ctrl.alerts.pop();
                    if(ctrl.alerts.length > 0) ctrl.timer();
                }, 3000));
            },
            show: function(el, isInit) {
                if(isInit) return;
                setTimeout(function() {
                    el.classList.add('alert-visible')
                })
            },
            hide: function() {
                ctrl.timer();
                var alerts = ctrl.alerts;
                
                alerts[alerts.length - 1].hidden = true;
                setTimeout(function() {
                    alerts.pop();
                }, 0)
                ctrl.alerts = alerts;
            },
            find: function(alert, alerts) {
                alerts = alerts || ctrl.alerts;
                
                var index = -1;
                
                alerts.forEach(function(el, i) {
                    var match = true;
                    for(var k in alert) {
                        if(k && alert.hasOwnProperty(k) && el.hasOwnProperty(k)) {
                            if (alert[k] != el[k]) match = false;
                        }
                    }
                    if(match) index = i;
                })
                
                return index;
            },
            remove: function(alert, alerts) {
                alerts = alerts || ctrl.alerts;
                
                var index = ctrl.find(alert, alerts);
                if(index > -1) alerts.splice(index, 1);
                
                ctrl.alerts = alerts;
            },
            add: function(alert, alerts) {
                alerts = alerts || ctrl.alerts;
                
                ctrl.remove(alert, alerts);
                
                alert.key = key++;
                
                alerts.push(alert);
                
                ctrl.alerts = alerts;
                
                ctrl.timer();
            }
        };
        system.shared.alert = {
            add: ctrl.add
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        var alerts = ctrl.alerts;
        return m('div.alert-wrapper', alerts.map(function(a,i) {
            return m('div.alert', {
                key: a.key,
                class: a.hidden ? 'alert-hidden' : a.type,
                config: ctrl.show,
                onclick: ctrl.hide
            }, [
                m('i.alert-icon', {
                    class: a.icon
                }),
                m('div.alert-text', a.message)
            ])
        }));
=======
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
>>>>>>> 1b44e82f6c365184541f9a6be46378bfb6bb6d2d
    }
};
