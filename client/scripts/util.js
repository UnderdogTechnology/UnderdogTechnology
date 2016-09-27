/* global m,localStorage */
/**
 ** Generic Utilities
 **/
var util = {
    q: function(q, c) {
        return (c || document).querySelector(q);
    },
    qq: function(q, c) {
        return [].slice.call((c || document).querySelectorAll(q));
    },
    extend: function(aObj, bObj) {
        if(Array.isArray(aObj) && !Array.isArray(bObj)) {
                aObj.push(bObj);
        }
        else {
            for(var key in bObj)
            {
                if(Array.isArray(aObj)) {
                    aObj.push(bObj[key]);
                } else if(bObj.hasOwnProperty(key)) {
                    aObj[key] = bObj[key];
                }

            }
        }
        return aObj;
    },
    random: function(obj, cb) {
        var keys = Object.keys(obj),
        ranNum = Math.floor(Math.random() * keys.length);
        if(cb){
            return cb(obj[keys[ranNum]], keys[ranNum], ranNum, obj);
        }
        return obj[keys[ranNum]];
    },
    formatter: function(string, obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                string = string.replace('{' + key + '}', obj[key], 'g');
            }
        }
        return string;
    },
    shadeElem: function(args) {
        if(args) {
            var update = null,
                from = null;
            if(args.update && (update = util.q(args.update))) {
                if(!args.attr) return false;
                
                if(args.from) from = util.q(args.from);
                
                var color = args.color || window.getComputedStyle(from || update)[args.attr];
                
                if(!color) return false;
                
                update.style.background = color.replace('rgb','rgba').replace(')', ',' + (args.percent || .1) + ')');
                
                return true;
            }
        }
        return false;
    }
};

/**
 ** Mithril Specific Utilities
 **/
var mutil = {
    convertRating: function(rating) {
        var i = 0,
            arr = [];

        while (i < 5) {
            arr[arr.length] = m('i', {
                class: (i < rating ? 'fa fa-star' : 'fa fa-star o')
            });
            i++;
        }
        return arr;
    },
    formGroup: function(attrs, children) {
        return m('div.pure-control-group', attrs, children);
    },
    formControls: function(attrs, children) {
        return m('div.pure-controls', attrs, children);
    },
    icon: function(name, children) {
        return m('i.fa.fa-' + name, children);
    },
    createSwitch: function(options, checked, label, cb, attr) {
        return [
            m('label', label),
            m('div.tgl', attr, [
                m('label.tgl-btn', {
                        class: checked ? 'tgl-on' : 'tgl-off'
                    },
                    m('div.tgl-opt.secondary', options[0]),
                    m('div.separator'),
                    m('div.tgl-opt.primary', options[1]),
                    m('input[type="checkbox"].tgl-switch', {
                        checked: checked,
                        onchange: cb
                    }))
            ])
        ];
    }
};

// reusable config attrs
mutil.c = {
    autofocus: function(elem, isInit) {
        elem.focus();
    }
};

/**
 ** Enumerators
 **/

var eutil = function(e, filter) {
    this.costs = [
        {
            'id': 1,
            'name': 'Free'
        }, {
            'id': 2,
            'name': 'Cheap'
        }, {
            'id': 3,
            'name': 'Pricey'
        }
    ];

    var tmp = this[e];

    if(filter) {
        tmp = tmp.filter(function(obj) {
            for(var f in filter) {
                return filter.hasOwnProperty(f) && obj.hasOwnProperty(f) && filter[f] == obj[f];
            }
        });
    }
    return tmp || [];
};