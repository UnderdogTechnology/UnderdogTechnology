app.model.characters = function(list) {
    var curId = 0;
    
    var newCharacter = function(o) {
        if(!o || o && (!o['role'])) return false;
        
        var character = {};
        
        // Set defaults
        character.state      = 'Conscious';
        character.emotions   = app.model.emotions();
        
        // Set meta
        for(var attr in o) {
            if(o.hasOwnProperty(attr))
                character[attr] = o[attr];
        }
        
        return character;
    };
    
    var _ = {
        add: function(o) {
            return _.set(o);
        },
        remove: function(id) {
            if(!_.hasOwnProperty(id)) return false;
            
            return (delete _[id]);
        },
        set: function(o) {
            if(!o) return false;
            
            var character = new newCharacter(o);
            
            if(!Object.keys(character).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            character.id = id;
            
            return (_[id] = character);
        },
        find: function(o) {
            if(!o) return false;
            
            if(o.id && _[o.id]) return _[o.id];
            var character;
            for(var id in _) {
                if(_.hasOwnProperty(id)) {
                    var match = true;
                    
                    character = _[id];
                    for(var attr in o) {
                        if(o.hasOwnProperty(attr) && character.hasOwnProperty(attr) && o[attr] !== character[attr]){
                            match = false;
                            break;
                        }
                    }
                    
                    if(match) break;
                    else character = null;
                }
            }
            return character;
        }
    };
    
    if(list) {
        for(var character in list) {
            if(list.hasOwnProperty(character)) {
                _.add(list[character]);
            }
        }
    }
    
    return _;
}