system.cmp.footer = {
    controller: function(args) {
        var ctrl = {};
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.footer', ['Underdog Technology 2016', m('i.fa.fa-copyright')]);
    }
};
