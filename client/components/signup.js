system.cmp.signUp = {
    controller: function(args) {
        var count = 0;
        var ctrl = {
            form: {
                username: m.prop(null),
                email: m.prop(null),
                password: m.prop(null),
                cPassword: m.prop(null)
            },
            signUp: function() {
                system.shared.alertWrapper.add({
                    message:'Pie is pretty good' + count++,
                    type: 'success'
                })
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
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup([
                    m('label', 'Username'),
                    m('input[type="text"].form-control', {
                        placeholder: 'Username',
                        value: ctrl.form.username(),
                        onblur: mutil.withValidate('value', 'username', ctrl.form.username, args.alert),
                        class: ctrl.isValid('username', ctrl.form.username())
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Email'),
                    m('input[type="text"].form-control', {
                        placeholder: 'Email',
                        value: ctrl.form.email(),
                        onblur: mutil.withValidate('value', 'email', ctrl.form.email, args.alert),
                        class: ctrl.isValid('email', ctrl.form.email())
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Password',
                        value: ctrl.form.password(),
                        onblur: mutil.withValidate('value', 'password', ctrl.form.password, args.alert),
                        class: ctrl.isValid('password', [ctrl.form.password(), ctrl.form.cPassword()])
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Confirm Password'),
                    m('input[type="password"].form-control', {
                        placeholder: 'Confirm Password',
                        value: ctrl.form.cPassword(),
                        onblur: mutil.withValidate('value', 'password', ctrl.form.cPassword, args.alert),
                        class: ctrl.isValid('password', [ctrl.form.cPassword(), ctrl.form.password()])
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
