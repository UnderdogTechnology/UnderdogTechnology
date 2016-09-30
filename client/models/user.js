var user = function(user) {
    if(user.username || user.username === '')
        this.username   = user.username;
    if(user.password || user.password === '')
        this.password   = user.password;
    if(user.email || user.email === '')
        this.email      = user.email;
}

user.prototype.isValid = function (ignoreError) {
    var passed = true;
    for(var attr in this) {
        if(this.hasOwnProperty(attr)) {
            var status =  util.isValid(attr, this[attr]);
            if(status && !status.isValid) {
                passed = false;
                if(!ignoreError)
                    system.shared.alert.add({ type: 'error', message: status.message, icon: 'fa fa-lg fa-pencil' });
            }
        }
    }
    return passed;
}

user.prototype.signIn = function() {
    if(this.isValid()) {
        system.db.remote.login(this.username.toLowerCase(), this.password).catch(function(r) {
            if(r.error) {
                var message = 'Something went wrong';
                if(r.error === 'unauthorized')
                    message = 'Username or password is incorrect'
                
                system.shared.alert.add({type: 'error', message: message, icon: 'fa fa-lg fa-user-times' });
                m.redraw();
            }
        });
    }
}

user.prototype.signUp = function () {
    if(this.isValid()) {
        var err = '';
        system.db.remote.signup(this.username.toLowerCase(), this.password[0], {
            metadata: {
                email: this.email
            }
        }).catch(function(r) {
            if(r.error) {
                var message = 'Something went wrong.'
                
                if(r.error === 'conflict') {
                    message = "Username is already taken."
                }
                if(r.error === 'forbidden') {
                    message = 'Invalid username.'
                }
                system.shared.alert.add({type: 'error', message: message, icon: 'fa fa-lg fa-user-times' });
                m.redraw();
            }
        });
    }
}

user.prototype.signOut = function() {
    system.db.remote.logout();
}

user.prototype.getUser = function() {
    if(this.isValid(true)) {
        system.db.remote.getUser(this.username);
    }
}

system.model.user = user;