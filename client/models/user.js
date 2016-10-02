(function() {
    
    function getError(r) {
        if(r.error) {
            console.log(r);
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
    
    // var user = function(user) {
    //     if(user.username || user.username === '')
    //         this.username   = user.username;
    //     if(user.password || user.password === '')
    //         this.password   = user.password;
    //     if(user.email || user.email === '')
    //         this.email      = user.email;
    // };
    
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
        if(!isValid()) return false;
        var cur = user.current = userObj;
        system.db.remote.login(cur.username.toLowerCase(), cur.password).then(function() {
            return user.get();
        }).then(function() {
            if(route) vutil.changeRoute(route);
        }).catch(getError);
        return cur;
    };
    
    user.signUp = function (userObj, route) {
        if(!isValid())  return false;
        
        var cur = user.current = userObj;
        
        system.db.remote.signup(cur.username.toLowerCase(), cur.password[0], {
            metadata: {
                email: cur.email
            }
        }).then(function(){
            return user.get();
        }).then(function(){
            if(route) vutil.changeRoute(route);
        }).catch(getError);
        return cur;
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
        if(!isValid(true)) return false;
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