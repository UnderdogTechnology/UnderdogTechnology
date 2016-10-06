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
        if(!args || !args.update || !args.attr) return false;
        var update = args.update;
        var from = args.from;
        
        if(typeof update === 'string') update = util.q(args.update);
        if(typeof from === 'string') from = util.q(args.from);
        
        var color = args.color || window.getComputedStyle(from || update)[args.attr];
        
        if(!color) return false;
        
        update.style.background = color.replace('rgb','rgba').replace(')', ',' + (args.percent || .1) + ')');
        
        return true;
    },
    findNavItem: function(route, navItems) {
        var found;
        (navItems || app.globalNavItems).some(function(item) {
            if(item.url === route) {
                found = item;
            } else if(item.children) {
                found = util.findNavItem(route, item.children);
            }
            if(found) return true;
        });
        return found;
    },
    isValid: function(type, value) {
        if(value) {
            var regex = null,
                message = '',
                valueTwo = null,
                arePasswordsValid = true;
            
            switch(type) {
                case 'email':
                    regex = /[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{1,3}/;
                    message = 'Email must be supplied in the correct format.';
                    break;
                case 'password':
                    regex = /[A-Za-z0-9]{8}/;
                    if (Array.isArray(value)) {
                        valueTwo = value[1];
                        value = value[0]
                    }
                    message = 'Password must be supplied in the correct format.';
                    break;
                case 'username':
                    regex = /[A-Za-z0-9]{5,15}/;
                    message = 'Username must be alphanumeric and between 5 and 15 characters.';
                    break;
                default:
                    return false;
            }
            
            if(valueTwo) {
                arePasswordsValid = (valueTwo === value && regex.test(valueTwo));
                message = "Passwords must match";
            }
            
            if(regex.test(value) && arePasswordsValid) return { isValid: true };
            
        } else {
            switch(type) {
                case 'email':
                    message = 'Email is a required field.';
                    break;
                case 'password':
                    message = 'Password is a required field.';
                    break;
                case 'username':
                    message = 'Username is a required field.';
                    break;
                default:
                    return false;
            }
        }
        
        return {
            isValid: false,
            message: message
        };
    }
};

/**
 ** Velocity Specific Utilities
 **/
 
 var speed = 275;
 
 var vutil = {
    changeRoute: function(href) { 
        var navItem = util.findNavItem(href),
            header = util.q('.header span');
            
        Velocity(util.q('.content'), 'fadeOut', speed)
        Velocity(util.q('.loading'), 'fadeIn', speed)
        util.q('.header').className = 'header ' + navItem.class;
        util.q('.nav-btn.fa.fa-bars').className = 'nav-btn fa fa-bars ' + navItem.class;
        Velocity(header, {
                fontSize: 0
            }, speed).then(function(el) {
                
            el[0].textContent = navItem.name;
            Velocity(el[0], 'reverse', speed).then(function() {
                m.route(href);
            });
        })
    }    
 }
 ;
 
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
    withValidate: function(attr, type, prop, submit) {
        return function(evt) {
            var value = evt.target.value;
            prop(value);
            if(!value && !submit) return;
            var status = util.isValid(type, value);
            if(status && !status.isValid) {
                app.shared.alert.add({ type: 'error', message: status.message, icon: 'fa-pencil'});
            }
        };
    },
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