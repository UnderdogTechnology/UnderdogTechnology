app.model.encounters = function(init) {
    var curId = 0;
    
    var newEncounter = function(o) {
        if(!o || o && !o.hasOwnProperty('place')) return false;
        
        var encounter       = {};
        
        // Set defaults
        encounter.with      = [];
        encounter.dialogue  = [];
        
        // Set meta
        for(var attr in o) {
            if(o.hasOwnProperty(attr))
                encounter[attr] = o[attr];
        }
        
        return encounter;
    };
    
    var _ = {
        add: function(o) {
            if(!o) return false;
            
            if(o.id && index[o.id]) util.extend(o, index[o.id]);
            
            return _.set(o);
        },
        remove: function(id) {
            if(!_.hasOwnProperty(id)) return false;
            
            return (delete _[id]);
        },
        set: function(o) {
            if(!o) return false;
            
            var encounter = newEncounter(o);
            
            if(!Object.keys(encounter).length) return false;
            
            var id = o.id || curId++;
            
            encounter.id = id;
            
            return (_[id] = encounter);
        },
        get: function(o) {
            if(!o) return false;
            
            if(o.id && _[o.id]) return _[o.id];
            
            var encounter;
            for(var id in _) {
                if(_.hasOwnProperty(id)) {
                    var match = true;
                    encounter = _[id];
                    
                    for(var attr in o) {
                        if(o.hasOwnProperty(attr) && encounter.hasOwnProperty(attr) && o[attr] !== encounter[attr]){
                            match = false;
                            break;
                        }
                    }
                    
                    if(match) break;
                    else encounter = null;
                }
            }
            return encounter;
        }
    };
    
    var index = {
        'intro': {
            place: 'Head',
            start: function(story, tmp) {
                story.characters('narrator').speak('Hello... What\'s your name?', function(response) {
                    var player = tmp.characters.add({
                        id: 'me',
                        name: response,
                        role: 'Player',
                        party: []
                    });
                    
                    story.characters('narrator').speak('Nice to meet you, ' + player.name + '!');
                })
            }
        }
    };
    
    return _;
}