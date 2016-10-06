app.cmp.common.footer = {
    controller: function(args) {
        var ctrl = {};
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.footer', args.text || m.trust('Underdog Technology &copy; 2016'));
    }
};
