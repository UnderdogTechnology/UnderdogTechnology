system.cmp.nav = {
    controller: function(args) {
        var speed = 250;
        
        var ctrl = {
            active: {
                item: args.activeItem,
                parent: args.activeItem
            },
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
                
                Velocity(util.qq('.nav'), {
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
            changeRoute: function(item, evt) {
                // TODO: not the cleanest solution, look into using css transitionend event
                evt.preventDefault();
                
                ctrl.active.item = item;
                
                ctrl.hide();
                
                Velocity(util.q('.header'), {
                    fontSize: '0px'
                }, speed).then(function(el) {
                    
                    Velocity(el[0], {
                        fontSize: '1.6em'
                    }, speed);
                
                    m.route(item.url);
                });
            },
            showChildren: function(item, evt) {
                evt.preventDefault();
                
                ctrl.active.parent = item;
                
                Velocity(util.q('.nav-two'), {
                    left: 0
                }, speed);
                
                util.shadeElem({
                    update: '.nav-heading',
                    from: '.inverse-' + item.class.replace(' ', '.'),
                    attr: 'color',
                    percent: .1
                })
            },
            hideChildren: function() {
                Velocity(util.q('.nav-two'), {
                    left: -300
                }, speed);
            },
            isActive: function(item, active) {
                
                if(item.name == active) {
                    return true;
                }
                
                var cFound = [];
                
                if(item.children) {
                    cFound = item.children.map(function(e, i){
                        if(e.name == active){
                            return true;
                        }
                    });
                }
                
                return cFound.indexOf(true) > -1;
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
                class: args.headerClass,
                onclick: ctrl.toggle
            }),
            m('div.nav.nav-one', [
                m('ul', [
                    items.map(function(item, index) {
                        return m('li', {
                                role: 'presentation'
                            },
                            m('a', {
                                class: (ctrl.isActive(item, ctrl.active.item.name) ? '' : 'inverse-') + item.class,
                                href: item.url,
                                onclick: (item.children ? ctrl.showChildren.bind(this, item) : ctrl.changeRoute.bind(this, item))
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
                m('div.nav-heading', {
                    class: 'inverse-' + ctrl.active.parent.class,
                    onclick: ctrl.hideChildren
                }, [
                    m('i.fa.fa-chevron-left'),
                    m('span', ctrl.active.parent.name)
                ]),
                m('ul', [
                    (ctrl.active.parent.children || []).map(function(child, index) {
                        return m('li', {
                                role: 'presentation',
                            },
                            m('a', {
                                class: (ctrl.isActive(child, ctrl.active.item.name) ? '' : 'inverse-') + child.class,
                                href: child.url,
                                onclick: ctrl.changeRoute.bind(this, child)
                            }, [
                                m('i.nav-icon', {
                                    class: child.icon
                                }),
                                m('span.itemName', child.name)
                            ])
                        );
                    })
                ])
            ])
        ]);
    }
};
