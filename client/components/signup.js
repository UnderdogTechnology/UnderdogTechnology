system.cmp.signUp = {
    controller: function(args) {
        var ctrl = {
            form: {
                username: m.prop(''),
                email: m.prop(''),
                password: m.prop(''),
                cPassword: m.prop('')
            },
            signUp: function() {
                
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.signup', [
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup([
                    m('label', 'Username'),
                    m('input[type="text"].form-control', {
                        placeholder: 'Username',
                        value: ctrl.form.username(),
                        onchange: m.withAttr('value', ctrl.form.username)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Email'),
                    m('input[type="email"].form-control', {
                        placeholder: 'Email',
                        value: ctrl.form.email(),
                        onchange: m.withAttr('value', ctrl.form.email)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.form.password(),
                        onchange: m.withAttr('value', ctrl.form.password)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Confirm Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Confirm Password',
                        value: ctrl.form.cPassword(),
                        onchange: m.withAttr('value', ctrl.form.cPassword)
                    })
                ]),,
                mutil.formControls([
                    m('a.pure-button.btn.primary', {
                        onclick: ctrl.signUp
                    }, 'Sign Up'),
                    m('a.pure-button.btn.secondary', {
                        onclick: vutil.changeRoute.bind(this, '/sign-in')
                    }, 'Sign In')
                ])
            ])
        ]);
    }
};
