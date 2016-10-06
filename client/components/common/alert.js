app.cmp.common.alert = {
    controller: function(args) {
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
        
        app.shared.alert = {
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
                    class: 'fa fa-lg ' + (a.icon || 'fa-exclamation')
                }),
                m('div.alert-text', a.message)
            ])
        }));
    }
};
