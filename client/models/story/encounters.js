app.model.encounters = function(init) {
    var curId = 0;
    
    var newEncounter = function(o) {
        if(!o || o && !o.hasOwnProperty('type')) return false;
        
        var encounter = {};
        
        // Set defaults
        encounter.with = [];
        
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
            
            return _.set(o);
        },
        remove: function(id) {
            if(!_.hasOwnProperty(id)) return false;
            
            return (delete _[id]);
        },
        set: function(o) {
            if(!o) return false;
            
            var encounter = new newEncounter(o);
            
            if(!Object.keys(encounter).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            encounter.id = id;
            
            return (_[id] = encounter);
        }
    };
    
    return _;
}