system.cmp.planit.find = {
    controller: function(args) {
        var ctrl = {};
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.planit', 
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup([
                    m('label', 'Category'),
                    m('select.form-control')
                ]),
                m.component(system.cmp.dBox, {
                    header: 'Filter',
                    class: 'planit',
                    content: [
                        mutil.formGroup([
                            m('label', 'Name'),
                            m('input[type="text"].form-control', {
                                placeholder: 'Name'
                            })
                        ]),
                        mutil.formGroup([
                            m('label', 'Cost'),
                            m('select.form-control')
                        ]),
                        mutil.formGroup([
                            m('label', 'Min People'),
                            m('input[type="number"].form-control', {
                                placeholder: 'Min People'
                            })
                        ]),
                        mutil.formGroup([
                            m('label', 'Max People'),
                            m('input[type="number"].form-control', {
                                placeholder: 'Max People'
                            })
                        ])
                    ]
                }),
                mutil.formControls([
                    m('a.pure-button.btn.secondary', 'Find All'),
                    m('a.pure-button.btn.primary.planit', 'Random')
                ])
            ])
        );
    }
};
