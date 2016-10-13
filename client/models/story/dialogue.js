app.model.dialogue = function() {
    var curId = 0;
    
    var newLine = function(o) {
        if(!o) return false;
        
        var line = {};
        
        // Set meta
        for(var attr in o) {
            if(o.hasOwnProperty(attr))
                line[attr] = o[attr];
        }
        
        return line;
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
            
            var line = newLine(o);
            
            if(!Object.keys(line).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            line.id = id;
            
            return (_[id] = line);
        }
    };
    
    return _;
}