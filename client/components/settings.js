system.cmp.settings = {
    controller: function(args) {
        var ctrl = {
            isChecked: m.prop(false)
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        
        return m('div.settings', [
            mutil.createSwitch(['Yes', 'No'], ctrl.isChecked(), 'Testing', m.withAttr('checked', ctrl.isChecked))
        ]);
    }
};
