app.cmp.common.switch = {
    controller: function(args) {
        var ctrl = {};
        return ctrl;
    }, view: function(ctrl, args) {
        return m('div.tgl-container', [
            m('label.tgl-label', args.label),
            m('div.tgl', args.attribute, [
                m('label.tgl-btn', {
                        class: args.param() ? 'tgl-on' : 'tgl-off'
                    },
                    m('div.tgl-opt.secondary', args.options[0]),
                    m('div.separator'),
                    m('div.tgl-opt.primary', args.options[1]),
                    m('input[type="checkbox"].tgl-switch', {
                        checked: args.param(),
                        onchange: m.withAttr('checked', args.param)
                    }))
            ])
        ]);
    }
};