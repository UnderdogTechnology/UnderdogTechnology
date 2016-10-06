/* global app,util,m,eutil */
app.cmp.results = {
    controller: function(args) {
        var settings = args.settings,
            model = args.model;
        var ctrl = {
            model: model,
            pageturners: m.prop(settings.pageturner),
            curPage: args.curPage || m.prop(0),
            pageSize: m.prop(settings.pagesize),
            resultSet: args.resultSet,
            selected: args.selected,
            form: args.form,
            createPageturners: function() {
                var curPage = ctrl.curPage(),
                    pageturners = ctrl.pageturners(),
                    lastPage = ctrl.resultSet() ? Math.ceil(ctrl.resultSet().length / ctrl.pageSize() - 1):0;

                 if(typeof pageturners == 'object') {
                    return pageturners.map(function(text){
                        if(typeof text == 'string') {
                            return m('td',{
                                onclick: function() {
                                    var addFirstLast = pageturners.length >= 4;

                                    switch(this.innerText) {
                                        case pageturners[0]:
                                            if(addFirstLast) {
                                                ctrl.curPage(0);
                                            } else if(curPage > 0){
                                                ctrl.curPage(--curPage);
                                            }
                                            break;
                                        case pageturners[1]:
                                            if(curPage > 0 && addFirstLast){
                                                ctrl.curPage(--curPage);
                                            } else if(curPage < lastPage){
                                                ctrl.curPage(++curPage);
                                            }
                                            break;
                                        case pageturners[pageturners.length - 2]:
                                            if(curPage < lastPage && addFirstLast){
                                                ctrl.curPage(++curPage);
                                            }
                                            break;
                                        case pageturners[pageturners.length - 1]:
                                            if(addFirstLast) {
                                                ctrl.curPage(lastPage);
                                            } else if(curPage < lastPage){
                                                ctrl.curPage(++curPage);
                                            }
                                            break;
                                    }
                                }
                            }, text);
                        } else {
                            return util.range(1, lastPage + 1, function(i) {
                                if(i >= curPage && (curPage + 2) >= i) {
                                    return m('td',{
                                        class: curPage + 1 == i ? 'page-selected' : '',
                                        onclick: function() {
                                            ctrl.select();
                                            ctrl.curPage(i - 1);
                                        }
                                    }, i);
                                }
                            });
                        }
                    });
                } else {
                    return util.range(1, lastPage + 1, function(i) {
                        if(i == 1 || i >= curPage - 1 && (curPage + 3) >= i || i == lastPage + 1) {
                            return m('td',{
                                class: curPage + 1 == i ? 'page-selected' : '',
                                onclick: function() {
                                    ctrl.curPage(i - 1);
                                }
                            }, (i == lastPage + 1 && i != curPage + 1? '..' : '') + i + (i == 1 && i != curPage + 1 ? '..' : ''));
                        }
                    });
                } 
            },
            selectedAct: m.prop(),
            select: function(id){
                if(id && ctrl.selected()['id'] != id) {
                    var catId = ctrl.form().category().toString(),
                        resultSet = ctrl.resultSet();
                        
                    ctrl.selected(model.a.get({
                        'id': id,
                        'category_id': catId != '-1' ? catId : null
                    })[0]);
                } else {
                        ctrl.selected({});
                }
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        if(ctrl.resultSet() == 'loading') {
                //return m('div', 'Loading...');
                return m('img.loading', {
                    src: './images/loading.gif'
                });
        }
        return m('div.results', [
            m('table.pure-table.pure-table-horizontal',{
                    hidden: !(ctrl.resultSet() && ctrl.resultSet().length)
                }, [
                m('thead.primary',
                    m('tr', [
                        m('td', 'Name'),
                        m('td', 'Cost'),
                        m('td', 'Min'),
                        m('td', 'Max')
                    ])
                ),
                m('tbody', util.forEach(ctrl.resultSet(), function(activity, key, obj, i){
                    var start = ctrl.curPage() * ctrl.pageSize();
                    if(ctrl.pageSize() <= 0 || (i >= start && i < start + ctrl.pageSize())) {
                        return m('tr.result-row', {
                            onclick: ctrl.select.bind(null, activity.id),
                            class: ctrl.selected()['id'] == activity.id ? 'secondary' : ''
                        }, [
                            m('td', activity.name),
                            m('td', eutil('costs', {'id': activity.cost})[0].name),
                            m('td', activity.players.min),
                            m('td', activity.players.max)
                        ]);
                    }
                }))
            ]),
            m('table.pagination', {
                hidden: !(ctrl.pageSize() > 0 && ctrl.resultSet() && ctrl.resultSet().length > ctrl.pageSize())
            }, [
                m('tr', ctrl.createPageturners())
            ])
        ]);
    }
};