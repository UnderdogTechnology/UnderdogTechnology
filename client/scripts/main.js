/* global util,m */
(function() {
    var system = window.system = window.system || {};
    
    var db = system.db = {
        local: new PouchDB('localdb'),
        remote: new PouchDB('http://' + (location.host || 'localhost').split(':')[0] + ':5984/remotedb', {skipSetup: true})
    };
    
    db.local.sync(db.remote, {live: true, retry: true}).on('error', console.log.bind(console));
    
    var cmp = system.cmp = {
        planit: {}
    };
    
    var model = system.model = {};
    
    system.shared = {
        user: null
    };
    
    var deps = {
        // MODELS
        '/models/': ['user'],
        // COMPONENTS
        '/components/': ['nav', 'home', 'alert', 'detail-box', 'switch', 'planit/find', 'settings', 'sign-up', 'sign-in']
    };
    
    var layout = function(item) {
        return {
            controller: function(args) {
                document.title = item.name;
                
                var ctrl = {};
                
                return ctrl;
            },
            view: function(ctrl, args) {
                return m('div.underdog-technology', [
                    m.component(cmp.nav, {
                        activeItem: item,
                        items: system.globalNavItems
                    }),
                    m('div.content', m.component(item.component, args[0])),
                    m('div.loading',
                        m('img', {
                            src: '/images/loading.gif'
                        })
                    ), m.component(cmp.alert, {})
                ]);
            }
        };
    };
    
    var loadNavItems = function() {
        var rNavs = [
        // PUBLIC ROUTES
        {
            name: 'Home',
            url: '/',
            icon: 'fa fa-home fa-lg',
            class: 'primary',
            component: cmp.home
        }, {
            name: 'Sign Up',
            url: '/sign-up',
            icon: 'fa fa-user-plus fa-lg',
            class: 'primary',
            auth: false,
            component: cmp.signUp
        }, {
            name: 'Sign In',
            url: '/sign-in',
            icon: 'fa fa-sign-in fa-lg',
            class: 'primary',
            auth: false,
            component: cmp.signIn
        // AUTHENTICATED ROUTES
        }, {
            name: 'Plan.it',
            icon: 'fa fa-rocket fa-lg',
            class: 'primary planit',
            auth: true,
            children: [
                {
                    name: 'Find',
                    url: '/plan-it/find',
                    icon: 'fa fa-search fa-lg',
                    class: 'primary planit',
                    component: cmp.planit.find
                }
            ]
        }, {
            name: 'Settings',
            url: '/settings',
            icon: 'fa fa-wrench fa-lg',
            class: 'primary',
            auth: true,
            component: cmp.settings
        }, {
            name: 'Sign Out',
            icon: 'fa fa-sign-out fa-lg',
            auth: true,
            class: 'primary',
            onclick: function(e) {
                system.model.user.signOut();
                vutil.changeRoute('/sign-in');
            }
        }];
        return rNavs;
    };
    
    var loadRoutes = function() {
        // restore user
        system.model.user.restoreUser();
        // fetch the nav items
        system.globalNavItems = loadNavItems();
        // apply the layout to each component in the nav and create the core route object
        var routes = {};
        system.globalNavItems.forEach(function(item) {
            if(item.children) {
                item.children.forEach(function(child){
                   routes[child.url] = layout(child);
                });
            } else {
                routes[item.url] = layout(item);
            }
        });
        // add any extra non-core routes
        util.extend(routes, {});
        // use hash for routing, NOTE: we'll probably change this to slash later once it's hosted
        m.route.mode = 'pathname';
        
        m.route(document.body, '/', routes);
    };
    
    // load models, then components
    system.loadModules(deps, loadRoutes);
    
}());
