app.cmp.signUp = {
    controller: function(args) {
        var ctrl = {
            username: m.prop(null),
            email: m.prop(null),
            password: m.prop(null),
            cPassword: m.prop(null),
            signUp: function(evt) {
                evt.preventDefault();
                app.model.user.signUp({
                    username: ctrl.username() || '',
                    password: [ctrl.password() || '', ctrl.cPassword() || ''],
                    email: ctrl.email() || ''
                }, '/')
            },
            isValid: function(type, value) {
                if(value === null || value[0] === null) return '';
                var status = util.isValid(type, value);
                return status && status.isValid ? 'success' : 'error';
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.signup', [
            m('form.center-form.pure-form.pure-form-aligned', {
                    onsubmit: ctrl.signUp
            }, [
                mutil.formGroup([
                    m('label', 'Username'),
                    m('input[type="text"].form-control', {
                        autocorrect: 'off',
                        autocapitalize: 'none',
                        placeholder: 'Username',
                        value: ctrl.username(),
                        onchange: mutil.withValidate('value', 'username', ctrl.username),
                        class: ctrl.isValid('username', ctrl.username())
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Email'),
                    m('input[type="text"].form-control', {
                        placeholder: 'Email',
                        value: ctrl.email(),
                        onchange: mutil.withValidate('value', 'email', ctrl.email),
                        class: ctrl.isValid('email', ctrl.email())
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.password(),
                        onchange: mutil.withValidate('value', 'password', ctrl.password),
                        class: ctrl.isValid('password', [ctrl.password(), ctrl.cPassword()])
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Confirm Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Confirm Password',
                        value: ctrl.cPassword(),
                        onchange: mutil.withValidate('value', 'password', ctrl.cPassword),
                        class: ctrl.isValid('password', [ctrl.cPassword(), ctrl.password()])
                    })
                ]),
                mutil.formControls([
                    m('button[type=submit].pure-button.btn.primary', 'Sign Up'),
                    m('a.pure-button.btn.secondary', {
                        onclick: vutil.changeRoute.bind(this, '/sign-in')
                    }, 'Sign In')
                ])
            ])
        ]);
    }
};
