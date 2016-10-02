system.cmp.dBox = {
    controller: function(args) {
        var ctrl = {
            contentHeight: m.prop(null),
            hidden: m.prop(true),
            getContentHeight: function(e) {
                var height = window.getComputedStyle(util.q('.d-box-content', e.currentTarget.parentNode))['height'];
                ctrl.contentHeight(parseInt(height.slice(0, height.length - 2)) + 35 + 20);
            },
            show: function(evt) {
                ctrl.getContentHeight(evt);
                ctrl.hidden(false);
            },
            hide: function() {
              ctrl.hidden(true);
            },
            toggle: function(evt) {
                if(ctrl.hidden()) {
                    ctrl.show(evt);
                } else {
                    ctrl.hide(evt);
                }
                m.redraw();
            }
        };
        return ctrl;
    }, view: function(ctrl, args) {
        return m('div.d-box', {
                class: ctrl.hidden() ? 'd-box-hidden' : '', 
                style: {
                    height: (ctrl.hidden() ? 35 : ctrl.contentHeight() || 35) + 'px'
                }
            },
            m('div.d-box-header.primary', {
                    onclick: ctrl.toggle  
                },
                m('i.d-box-knob', {
                    class: 'fa fa-chevron-down'
                }),
            args.header),
            m('div.d-box-content', {
            }, args.content)
        )
    }
};