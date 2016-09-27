/* global util,m */
(function() {
    var system = window.system = window.system || {};

    var cmp = system.cmp = {
        planit: {}
    };
    var model = system.model = {};
    
    var deps = {
        // MODELS
        'models/': [],
        // COMPONENTS
        'components/': ['nav', 'home', 'planit/find']
    };
    
    var layout = function(item, nav) {
        return {
            controller: function(args) {
                m.redraw.strategy('diff');
                document.title = item.name;
            },
            view: function(ctrl, args) {
                return m('div.underdog-technology', [
                    m('h1.header', {
                        class: item.class
                    }, item.name),
                    m.component(cmp.nav, {
                        activeItem: item,
                        headerClass: item.class,
                        items: nav
                    }),
                    m('div.content', m.component(item.component, {}))
                ]);
            }
        };
    }
    ;
    
    var loadNavItems = function() {
        return m.prop([{
            name: 'Home',
            url: '/',
            icon: 'fa fa-home fa-lg',
            class: 'primary',
            component: cmp.home
        }, {
            name: 'Plan.it',
            icon: 'fa fa-rocket fa-lg',
            class: 'primary planit',
            children: [
                {
                    name: 'Find',
                    url: '/plan-it',
                    icon: 'fa fa-search fa-lg',
                    class: 'primary planit',
                    component: cmp.planit.find
                }
            ]
        }]);
    }
    ;
    
    var loadRoutes = function() {
        // fetch the nav items
        var navItems = loadNavItems();
        // apply the layout to each component in the nav and create the core route object
        var routes = {};
        navItems().forEach(function(item) {
            if(item.children) {
                item.children.forEach(function(child){
                   routes[child.url] = layout(child, navItems);
                });
            } else {
                routes[item.url] = layout(item, navItems);
            }
        });
        // add any extra non-core routes
        util.extend(routes, {});
        // use hash for routing, NOTE: we'll probably change this to slash later once it's hosted
        m.route.mode = 'pathname';
        
        m.route(document.body, '/', routes);
    }
    ;
    
    // load models, then components
    system.loadModules(deps, loadRoutes);
}
());
