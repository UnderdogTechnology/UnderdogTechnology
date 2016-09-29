system.cmp.signIn = {
    controller: function(args) {
        var ctrl = {
            form: {
                username: m.prop(''),
                password: m.prop('')
            },
            signIn: function() {
                args.alert({
                    type: 'error',
                    message: 'Something is Ron'
                })
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
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.form.password(),
                        onchange: m.withAttr('value', ctrl.form.password)
                    })
                ]),
                mutil.formControls([
                    m('a.pure-button.btn.primary', {
                        onclick: ctrl.signIn
                    },'Sign In'),
                    m('a.pure-button.btn.secondary', {
                        onclick: vutil.changeRoute.bind(this, '/')
                    }, 'Sign Up')
                ])
            ])
        ]);
    }
};
