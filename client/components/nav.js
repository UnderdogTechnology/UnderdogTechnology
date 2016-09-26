system.cmp.nav = {
    controller: function(args) {
        var speed = 250;
        
        var ctrl = {
            activeChildren: [],
            visible: args.visible || m.prop(false),
            show: function() {
                Velocity(util.q('.overlay'), "fadeIn", speed);
                
                Velocity(util.q('.nav-one'), {
                    left: 0
                }, speed);
                
                ctrl.visible(true);
            },
            hide: function() {
                Velocity(util.q('.overlay'), "fadeOut", speed);
                
                Velocity(util.q('.nav-one'), {
                    left: -300
                }, speed);
                
                ctrl.visible(false);
            },
            toggle: function() {
                if (ctrl.visible()) {
                    ctrl.hide();
                } else {
                    ctrl.show();
                }
            },
            changeRoute: function(elem, isInit, ctx) {
                if (!isInit) {
                    elem.onclick = function(evt) {
                        // TODO: not the cleanest solution, look into using css transitionend event
                        evt.preventDefault();
                        
                        ctrl.hide();
                        
                        setTimeout(function() {
                            m.route(elem.getAttribute('href'));
                        }, 300);
                    };
                }
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        var items = args.items();
        
        return m('div.nav-container', [
            m('div.overlay', {
                onclick: ctrl.hide
            }),
            m('span.nav-btn.fa.fa-bars', {
                class: args.activeClass,
                onclick: ctrl.toggle
            }),
            m('div.nav.nav-one', [
                m('ul', [
                    items.map(function(item, index) {
                        return m('li', {
                                role: 'presentation',
                            },
                            m('a', {
                                class: (item.name == args.active ? '' : 'inverse-') + item.activeClass,
                                href: item.url,
                                config: ctrl.changeRoute
                            }, [
                                m('i.nav-icon', {
                                    class: item.icon
                                }),
                                m('span.itemName', item.name),
                                (item.children ? m('i.fa.fa-chevron-right.nav-show-children'): null)
                            ])
                        );
                    })
                ])
            ]), m('div.nav.nav-two', [
                m('span', args.active),
                m('ul', [
                    ctrl.activeChildren.map(function(item, index) {
                        return m('li', {
                                role: 'presentation',
                            },
                            m('a', {
                                class: (item.name == args.active ? '' : 'inverse-') + item.activeClass,
                                href: item.url,
                                config: ctrl.changeRoute
                            }, [
                                m('i.nav-icon', {
                                    class: item.icon
                                }),
                                m('span.itemName', item.name)
                            ])
                        );
                    })
                ])
            ])
        ]);
    }
};
