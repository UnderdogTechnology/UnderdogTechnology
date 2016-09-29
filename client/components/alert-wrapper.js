system.cmp.alertWrapper = {
    controller: function(args) {
        var ctrl = {
            alerts: m.prop([]),
            find: function(alert, alerts) {
                alerts = alerts || ctrl.alerts();
                
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
                alerts = alerts || ctrl.alerts();
                
                var index = ctrl.find(alert, alerts);
                if(index > -1) alerts = alerts.splice(index, 1);
                
                ctrl.alerts(alerts);
            },
            add: function(alert, alerts) {
                alerts = alerts || ctrl.alerts();
                
                if(ctrl.find(alert, alerts) == -1) alerts.push(alert);
                
                ctrl.alerts(alerts);
            }
        };
        system.shared.alertWrapper = {
            add: ctrl.add,
            remove: ctrl.remove
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        var alerts = ctrl.alerts();
        console.log(alerts);
        return m('div.alert-wrapper', alerts.map(function(a) {
            return m.component(system.cmp.alert, 
                util.extend(ctrl, {
                    alert: a
                })
            );
        }));
    }
};
