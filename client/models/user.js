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
            system.shared.alert.add({type: 'error', message: message, icon: 'fa fa-lg fa-user-times' });
            m.redraw();
        }
    }
    
    var user = {};
    
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
                        system.shared.alert.add({ type: 'error', message: status.message, icon: 'fa fa-lg fa-pencil' });
                }
            }
        }
        return passed;
    }
    
    user.signIn = function(userObj, route) {
        user.current = userObj;
        if(!isValid()) return false;
        system.db.remote.login(user.current.username.toLowerCase(), user.current.password).then(function() {
            return user.get();
        }).then(function() {
            if(route) vutil.changeRoute(route);
        }).catch(getError);
        return user.current;
    };
    
    user.signUp = function (userObj, route) {
        user.current = userObj;
        if(!isValid())  return false;
        
        system.db.remote.signup(user.current.username.toLowerCase(), user.current.password[0], {
            metadata: {
                email: user.current.email
            }
        }).then(function(){
            return user.get();
        }).then(function(){
            if(route) vutil.changeRoute(route);
        }).catch(getError);
        return user.current;
    };
    
    user.signOut = function() {
        system.db.remote.logout();
        user.current = null;
        return user.current;
    };
    
    user.getSession = function() {
        return system.db.remote.getSession().catch(function() {
            system.shared.alert.add({type:'warning', message: 'Could not connect to the server.', icon: 'fa fa-lg fa-user-times'});
            m.redraw();
        });
    };
    
    user.restoreUser = function() {
        return user.getSession().then(function(sesh) {
            if(!sesh.userCtx.name) return;
            user.current = {
                username: sesh.userCtx.name
            };
            return user.get();
        });
    };
    
    user.get = function() {
        return system.db.remote.getUser(user.current.username.toLowerCase()).then(function(u) {
            user.current.serverUser = u;
        }).catch(getError);
    };
    
    user.update = function(userObj) {
        if(!isValid(true)) return false;
        var meta = {};
        var promises = [];
        for(var attr in userObj) {
            if(userObj.hasOwnProperty(attr)) {
                if(attr === 'password') {
                    promises.push(system.db.remote.changePassword(user.current.username, userObj.password).then(function() {
                        system.shared.alert.add({type:'success', message: 'Password has been successfully updated.', icon: 'fa fa-lg fa-user-times'});
                        m.redraw();
                    }).catch(getError));
                } else if(attr === 'username') {
                    promises.push(system.db.remote.changeUsername(user.current.username, userObj.username).then(function(r){
                        user.current.username = userObj.username;
                        system.shared.alert.add({type:'success', message: 'Password has been successfully updated.', icon: 'fa fa-lg fa-user-times'});
                        m.redraw();
                    }).catch(getError));
                } else
                    meta[attr] = userObj[attr];
            }
        }
        if(Object.keys(meta).length) {
            promises.push(system.db.remote.putUser(user.current.username, {
                metadata: meta
            }).then(user.get).catch(getError));
        }
        return promises;
    };
    
    system.model.user = user;

}());