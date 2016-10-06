app.cmp.settings = {
    controller: function(args) {
        var ctrl = {
            username: m.prop(app.model.user.current.username || null),
            email: m.prop(app.model.user.current.serverUser.email || null),
            password: m.prop(null),
            cPassword: m.prop(null),
            isChecked: m.prop(false),
            isValid: function(type, value) {
                if(value === null || value[0] === null) return '';
                var status = util.isValid(type, value);
                return status && status.isValid ? 'success' : 'error';
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        
        return m('div.settings', [
            m.component(app.cmp.common.dBox, {
                header: 'Account Details',
                content: m('form.center-form.pure-form.pure-form-aligned', [
                    mutil.formGroup([
                        m('label', 'Username'),
                        m('input[type=text].form-control', {
                            autocorrect: 'off',
                            autocapitalize: 'none',
                            readonly: true,
                            placeholder: 'Username',
                            value: ctrl.username(),
                            onchange: mutil.withValidate('value', 'username', ctrl.username),
                            class: ctrl.isValid('username', ctrl.username())
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Email'),
                        m('input[type=text].form-control', {
                            placeholder: 'Email',
                            value: ctrl.email(),
                            onchange: mutil.withValidate('value', 'email', ctrl.email),
                            class: ctrl.isValid('email', ctrl.email())
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'New Password'),
                        m('input[type=password].form-control', {
                            placeholder: 'New Password',
                            value: ctrl.password(),
                            onchange: mutil.withValidate('value', 'password', ctrl.password),
                            class: ctrl.isValid('password', ctrl.password())
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Confirm Password'),
                        m('input[type=password].form-control', {
                            placeholder: 'Confirm Password',
                            value: ctrl.cPassword(),
                            onchange: mutil.withValidate('value', 'password', ctrl.cPassword),
                            class: ctrl.isValid('password', ctrl.cPassword())
                        })
                    ]),
                    mutil.formControls([
                        m('button[type=submit].pure-button.btn.primary', 'Apply'),
                        m('a.pure-button.btn.secondary', 'Cancel')
                    ])
                ])
            }),
            m.component(app.cmp.common.switch, {
                options: ['On', 'Off'],
                param: ctrl.isChecked,
                label: 'Testing'
            }),
        ]);
    }
};
