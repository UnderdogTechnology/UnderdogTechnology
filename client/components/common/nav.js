system.cmp.nav = {
    controller: function(args) {
        var speed = 275;
        var ctrl = {
            active: {
                item: args.activeItem,
                parent: args.activeItem
            },
            visible: args.visible || m.prop(false),
            show: function() {
                Velocity(util.q('.nav-container .overlay'), 'fadeIn', speed);
                
                Velocity(util.q('.nav-one'), {
                    left: 0
                }, speed);
                
                ctrl.active.parent = ctrl.getParent(args.activeItem);
                
                if(ctrl.active.item !== ctrl.active.parent) {
                    Velocity(util.q('.nav-two'), {
                       left: 0
                    }, speed);
                    util.shadeElem({
                        update: '.nav-heading',
                        from: '.inverse-' + ctrl.active.parent.class.replace(' ', '.'),
                        attr: 'color',
                        percent: .1
                    });
                }
                
                ctrl.visible(true);
            },
            hide: function() {
                Velocity(util.q('.nav-container .overlay'), 'fadeOut', speed);
                
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
                evt.preventDefault();
                
                ctrl.hide();
                
                vutil.changeRoute(item.url, item.name);
            },
            showChildren: function(item, evt) {
                evt.preventDefault();
                
                ctrl.active.parent = item;
                
                Velocity(util.q('.nav-two'), {
                    left: 0
                }, speed);
                
                util.shadeElem({
                    update: '.nav-heading',
                    from: '.inverse-' + ctrl.active.parent.class.replace(' ', '.'),
                    attr: 'color',
                    percent: .1
                });
            },
            hideChildren: function() {
                Velocity(util.q('.nav-two'), {
                    left: -300
                }, speed);
            },
            isActive: function(item, active) {
                
                if(item.url === active) {
                    return true;
                }
                
                var cFound = [];
                
                if(item.children) {
                    cFound = item.children.map(function(e, i){
                        if(e.url === active){
                            return true;
                        }
                    });
                }
                
                return cFound.indexOf(true) > -1;
            },
            getParent: function(target, list) {
                var parent;
                list = list || system.globalNavItems;
                list.some(function(item) {
                   if(target.url === item.url) {
                       parent = item;
                       return true;
                   }
                   if(item.children && ctrl.getParent(target, item.children)) {
                       parent = item;
                       return true;
                   }
                });
                return parent;
            }
        };
        ctrl.active.parent = ctrl.getParent(args.activeItem);
        return ctrl;
    },
    view: function(ctrl, args) {
        var isLoggedIn = system.model.user.isLoggedIn();
        return m('div.nav-container', [
            m('div.overlay', {
                onclick: ctrl.hide
            }),
            m('h1.header', {
                class: ctrl.active.item.class
            }, m('span', ctrl.active.item.name)),
            m('span.nav-btn.fa.fa-bars', {
                class: ctrl.active.item.class,
                onclick: ctrl.toggle
            }),
            m('div.nav.nav-one', [
                m('ul', [
                    args.items.map(function(item, index) {
                        if((item.auth && !isLoggedIn) || (item.auth === false && isLoggedIn)) return;
                        return m('li', {
                                role: 'presentation'
                            },
                            m('a', {
                                class: (ctrl.isActive(item, ctrl.active.item.url) ? '' : 'inverse-') + item.class,
                                href: item.url,
                                onclick: item.onclick ? function(e) {
                                    e.preventDefault();
                                    ctrl.hide();
                                    item.onclick();
                                } : (item.children ? ctrl.showChildren.bind(this, item) : ctrl.changeRoute.bind(this, item))
                            }, [
                                m('i.nav-icon', {
                                    class: item.icon
                                }),
                                m('span.itemName', item.name),
                                (item.children ? m('i.fa.fa-chevron-right.nav-show-children'): null)
                            ])
                        );
                    })
                ]),
                m.component(system.cmp.footer, {})
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
                        if((child.auth && !isLoggedIn) || (child.auth === false && isLoggedIn)) return;
                        return m('li', {
                                role: 'presentation',
                            },
                            m('a', {
                                class: (ctrl.isActive(child, ctrl.active.item.url) ? '' : 'inverse-') + child.class,
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
