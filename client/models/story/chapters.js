app.model.chapters = function() {
    
    var curId = 0;
    
    var newChapter = function(o) {
        if(!o) return false;
        
        var chapter = {};
        
        // Set defaults
        chapter.encounters = [];
        
        // Set meta
        for(var attr in o) {
            if(o.hasOwnProperty(attr));
                chapter[attr] = o[attr];
        }
        
        return chapter;
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
            
            var chapter = newChapter(o);
            
            if(!Object.keys(chapter).length) return false;
            
            var id = o.id || curId++;
            
            chapter.id = id;
            
            return (_[id] = chapter);
        }
    };
    
    var index = {
        'intro': {
            title: 'First Chapter'
        }
    };
    
    return _;
}