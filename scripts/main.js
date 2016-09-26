/* global util,m */
(function() {
    var system = window.system = window.system || {};

    var cmp = system.cmp = {};
    var model = system.model = {};
    
    var deps = {
        // MODELS
        'models/': [],
        // COMPONENTS
        'components/': ['nav', 'home']
    };
    
    var layout = function(title, nav, content, activeClass) {
        return {
            controller: function(args) {
                document.title = title;
            },
            view: function(ctrl, args) {
                return m('div.underdog-technology', [
                    m('h1.header', {
                        class: activeClass 
                    }, title),
                    m.component(cmp.nav, {
                        activeClass: activeClass,
                        active: title,
                        items: nav
                    }),
                    m('div.content', m.component(content, args[0]))
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
            activeClass: 'primary',
            component: cmp.home
        }, {
            name: 'Plan.it',
            url: '/plan-it',
            icon: 'fa fa-rocket fa-lg',
            activeClass: 'primary planit',
            children: [
                {
                    name: 'Find',
                    url: '/plan-it/find',
                    icon: 'fa fa-search fa-lg',
                    activeClass: 'primary planit',
                    component: cmp.home
                }
            ],
            component: cmp.home
        }]);
    }
    ;
    
    var loadRoutes = function() {
        // fetch the nav items
        var navItems = loadNavItems();
        // apply the layout to each component in the nav and create the core route object
        var routes = {};
        navItems().forEach(function(item) {
            item.component = layout(item.name, navItems, item.component, item.activeClass);
            routes[item.url] = item.component;
        }
        );
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
