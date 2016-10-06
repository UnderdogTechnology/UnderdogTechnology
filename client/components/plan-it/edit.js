app.cmp.planit.edit = {
    controller: function(args) {
        var ctrl = {
            costs: ['Free', 'Cheap', 'Pricey'],
            name: m.prop(null),
            cost: m.prop(0),
            min: m.prop(null),
            max: m.prop(null),
            clear: function() {
                ctrl.name(null);
                ctrl.cost(0);
                ctrl.min(null);
                ctrl.max(null);
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
                mutil.formGroup([
                    m('label', 'Name'),
                    m('input[type="text"].form-control', {
                        placeholder: 'Name',
                        value: ctrl.name(),
                        onchange: m.withAttr('value', ctrl.name)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Cost'),
                    m('select.form-control', {
                        value: ctrl.cost(),
                        onchange: m.withAttr('value', ctrl.cost)
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
                        value: ctrl.min(),
                        onchange: m.withAttr('value', ctrl.min)
                    })
                ]),
                mutil.formGroup([
                    m('label', 'Max People'),
                    m('input[type="number"].form-control', {
                        placeholder: 'Max People',
                        value: ctrl.max(),
                        onchange: m.withAttr('value', ctrl.max)
                    })
                ]),
                mutil.formControls([
                    m('a.pure-button.btn.secondary', {
                        onclick: ctrl.clear
                    }, 'Cancel'),
                    m('a.pure-button.btn.primary.planit', 'Submit')
                ])
            ])
        );
    }
};
