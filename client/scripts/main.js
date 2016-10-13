/* global util,m */
(function() {
    var app = window.app = window.app || {};
    
    var db = app.db = {
        local: new PouchDB('localdb', {skipSetup: true}),
        remote: new PouchDB('http://' + (location.host || 'localhost').split(':')[0] + ':5984/remotedb', {skipSetup: true}),
        connected: true
    };
    
    db.remote.info().then(function() {
        db.local.sync(db.remote, {live: true, retry: true}).on('error', console.log.bind(console));
    }).catch(function(){
        db.connected = false;
    });
    
    var cmp = app.cmp = {
        common: {},
        planit: {},
        shopper: {}
    };
    
    var model = app.model = {};
    
    app.shared = {
        user: null
    };
    
    var deps = {
        // MODELS
        '/models/': [
            'user',
            // STORY
            'story/chapters', 'story/encounters', 'story/characters', 'story/dialogue', 'story/emotions'
        ],
        // COMPONENTS
        '/components/': [
            // COMMON
            'common/footer', 'common/nav', 'common/alert', 'common/detail-box', 'common/switch',
            // UNDERDOG
            'home', 'settings', 'sign-up', 'sign-in',
            // PLAN-IT
            'plan-it/find', 'plan-it/edit',
            // STORY
            'story/index'
        ]
    };
    
    var layout = function(item) {
        return {
            controller: function(args) {
                document.title = item.name;
                var ctrl = {};
                var isLoggedIn = app.model.user.isLoggedIn();
                
                if((item.auth && !isLoggedIn) || (item.auth === false && isLoggedIn)) {
                    // TODO: Set warning message 'You do not have access to view this page.'
                    m.route('/');
                }
                
                return ctrl;
            },
            view: function(ctrl, args) {
                return m('div.underdog-technology', [
                    m.component(cmp.common.nav, {
                        activeItem: item,
                        items: app.globalNavItems
                    }),
                    m('div.content', m.component(item.component, args[0])),
                    m('div.loading',
                        m('img', {
                            src: '/images/loading.gif'
                        })
                    ), m.component(cmp.common.alert, {})
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
        }, {
            name: 'Story',
            url: '/story',
            icon: 'fa fa-bookmark fa-lg',
            class: 'primary story',
            component: cmp.story,
            auth: false
        }, 
        // AUTHENTICATED ROUTES
        {
            name: 'Plan.it',
            icon: 'fa fa-rocket fa-lg',
            class: 'primary planit',
            auth: true,
            slogan: 'Randomize your choice.',
            children: [
                {
                    name: 'Find',
                    url: '/plan-it/find',
                    icon: 'fa fa-search fa-lg',
                    class: 'primary planit',
                    auth: true,
                    component: cmp.planit.find
                },
                {
                    name: 'Edit',
                    url: '/plan-it/edit',
                    icon: 'fa fa-pencil-square-o fa-lg',
                    class: 'primary planit',
                    auth: true,
                    component: cmp.planit.edit
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
                app.model.user.signOut();
                vutil.changeRoute('/sign-in');
            }
        }];
        return rNavs;
    };
    
    var loadRoutes = function() {
        // restore user
        app.model.user.restoreUser().then(function() {
            // fetch the nav items
            app.globalNavItems = loadNavItems();
            // apply the layout to each component in the nav and create the core route object
            var routes = {};
            app.globalNavItems.forEach(function(item) {
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
        });
    };
    
    // load models, then components
    app.loadModules(deps, loadRoutes);
    
}());
