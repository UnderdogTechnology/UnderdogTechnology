app.cmp.home = {
    controller: function(args) {
        var ctrl = {};
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.home', [
            m('h2', 'Welcome to Underdog Technology!')
        ]);
    }
};
