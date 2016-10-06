(function() {
    
    function getError(r) {
        if(r.error) {
            var message = 'Something went wrong.';
            switch(r.error) {
                case 'unauthorized':
                    message = 'Username or password is incorrect.';
                    break;
                case 'conflict':
                    message = 'Username is already taken.';
                    break;
                case 'forbidden':
                    message = 'Invalid username.';
                    break;
                case 'not_found':
                    message = 'You don\'t have permission to perform this action.';
                    break;
            }
            app.shared.alert.add({ type: 'error', message: message, icon: 'fa-user-times' });
            m.redraw();
        }
    }
    
    var user = app.model.user = {};
    
    user.current = null;
    
    user.isLoggedIn = function() {
        return !!user.current;
    };
    
    function isValid(ignoreError, userObj) {
        var passed = true;
        userObj = userObj || user.current;
        for(var attr in userObj) {
            if(userObj.hasOwnProperty(attr)) {
                var status =  util.isValid(attr, userObj[attr]);
                if(status && !status.isValid) {
                    passed = false;
                    if(!ignoreError)
                        app.shared.alert.add({ type: 'error', message: status.message, icon: 'fa-pencil' });
                }
            }
        }
        return passed;
    }
    
    user.signIn = function(userObj, route) {
        if(!isValid(false, userObj)) return false;
        user.current = {username: userObj.username};
        return app.db.remote.login(userObj.username.toLowerCase(), userObj.password).then(function() {
            return user.get();
        }).then(function() {
            if(route) vutil.changeRoute(route);
        }).catch(getError);
    };
    
    user.signUp = function (userObj) {
        if(!isValid(false, userObj))  return false;
        
        user.current = {username: userObj.username};
        
        return app.db.remote.signup(userObj.username.toLowerCase(), userObj.password[0], {
            metadata: {
                email: userObj.email
            }
        }).catch(getError);
    };
    
    user.signOut = function() {
        app.db.remote.logout();
        user.current = null;
        return user.current;
    };
    
    user.getSession = function() {
        return app.db.remote.getSession().catch(function() {
            app.shared.alert.add({type:'warning', message: 'Could not connect to the server.'});
            m.redraw();
        });
    };
    
    user.restoreUser = function() {
        if(!app.db.connected) return user.get();
        
        return user.getSession().then(function(sesh) {
            if(!sesh.userCtx.name) return;
            user.current = {
                username: sesh.userCtx.name
            };
            return user.get();
        });
    };
    
    user.get = function() {
        if(!app.db.connected) return app.db.local.get('_local/user').then(function(u){
            user.current = u.user;
        });
        
        return app.db.remote.getUser(user.current.username.toLowerCase()).then(function(u) {
            user.current.serverUser = u;
            return app.db.local.get('_local/user').then(function(r) {
                return app.db.local.put({
                    '_id': r['_id'],
                    '_rev': r['_rev'],
                    user: user.current
                });
            }).catch(function() {
                return app.db.local.put({
                    '_id': '_local/user',
                    user: user.current
                });
            });
        }).catch(getError);
    };
    
    user.update = function(userObj) {
        if(!isValid(true, userObj)) return false;
        var meta = {};
        var promises = [];
        for(var attr in userObj) {
            if(userObj.hasOwnProperty(attr)) {
                if(attr === 'password') {
                    promises.push(app.db.remote.changePassword(user.current.username, userObj.password).then(function() {
                        app.shared.alert.add({type:'success', message: 'Password has been successfully updated.', icon: 'fa-user-times'});
                        m.redraw();
                    }).catch(getError));
                } else if(attr === 'username') {
                    promises.push(app.db.remote.changeUsername(user.current.username, userObj.username).then(function(r){
                        user.current.username = userObj.username;
                        app.shared.alert.add({type:'success', message: 'Password has been successfully updated.', icon: 'fa-user-times'});
                        m.redraw();
                    }).catch(getError));
                } else
                    meta[attr] = userObj[attr];
            }
        }
        if(Object.keys(meta).length) {
            promises.push(app.db.remote.putUser(user.current.username, {
                metadata: meta
            }).then(user.get).catch(getError));
        }
        return promises;
    };

}());