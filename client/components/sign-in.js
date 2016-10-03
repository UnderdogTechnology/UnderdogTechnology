system.cmp.signIn = {
    controller: function(args) {
        var ctrl = {
            username: m.prop(null),
            password: m.prop(null),
            isValid: function(type,value) {
                if(value === null || value[0] === null) return '';
                var status = util.isValid(type, value);
                return status && status.isValid ? 'success' : 'error';
            },
            signIn: function(e) {
                e.preventDefault();
                system.model.user.signIn({
                    username: ctrl.username() || '',
                    password: ctrl.password() || ''
                }, '/');
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.signup', [
            m('form.center-form.pure-form.pure-form-aligned', {
                onsubmit: ctrl.signIn
            },[
                mutil.formGroup([
                    m('label', 'Username'),
                    m('input[type="text"].form-control', {
                        placeholder: 'Username',
                        value: ctrl.username(),
                        onblur: mutil.withValidate('value', 'username', ctrl.username),
                        onchange: m.withAttr('value', ctrl.username),
                        class: ctrl.isValid('username', ctrl.username())
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.password(),
                        onblur: mutil.withValidate('value', 'password', ctrl.password),
                        onchange: m.withAttr('value', ctrl.password),
                        class: ctrl.isValid('password', ctrl.password())
                    })
                ]),
                mutil.formControls([
                    m('button[type=submit].pure-button.btn.primary', 'Sign In'),
                    m('a.pure-button.btn.secondary', {
                        onclick: vutil.changeRoute.bind(this, '/sign-up')
                    }, 'Sign Up')
                ])
            ])
        ]);
    }
};
