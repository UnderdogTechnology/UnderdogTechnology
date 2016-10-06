app.cmp.planit.find = {
    controller: function(args) {
        var ctrl = {
            costs: ['Free', 'Cheap', 'Pricey'],
            filter: {
                name: m.prop(null),
                cost: m.prop(0),
                min: m.prop(null),
                max: m.prop(null),
                clear: function() {
                    ctrl.filter.name(null);
                    ctrl.filter.cost(0);
                    ctrl.filter.min(null);
                    ctrl.filter.max(null);
                }
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.planit', 
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup([
                    m('label', 'Category'),
                    m('select.form-control')
                ]),
                m.component(app.cmp.common.dBox, {
                    onhide: ctrl.filter.clear,
                    header: 'Filter',
                    class: 'planit',
                    content: [
                        mutil.formGroup([
                            m('label', 'Name'),
                            m('input[type="text"].form-control', {
                                placeholder: 'Name',
                                value: ctrl.filter.name(),
                                onchange: m.withAttr('value', ctrl.filter.name)
                            })
                        ]),
                        mutil.formGroup([
                            m('label', 'Cost'),
                            m('select.form-control', {
                                value: ctrl.filter.cost(),
                                onchange: m.withAttr('value', ctrl.filter.cost)
                            }, ctrl.costs.map(function(c, i) {
                                return m('option', {
                                    value: i
                                }, c)
                            }))
                        ]),
                        mutil.formGroup([
                            m('label', 'Min People'),
                            m('input[type="number"].form-control', {
                                placeholder: 'Min People',
                                value: ctrl.filter.min(),
                                onchange: m.withAttr('value', ctrl.filter.min)
                            })
                        ]),
                        mutil.formGroup([
                            m('label', 'Max People'),
                            m('input[type="number"].form-control', {
                                placeholder: 'Max People',
                                value: ctrl.filter.max(),
                                onchange: m.withAttr('value', ctrl.filter.max)
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
