app.model.chapters = function() {
    
    var curId = 0;
    
    var newChapter = function(o) {
        if(!o) return false;
        
        var chapter = {};
        
        for(var attr in o) {
            if(o.hasOwnProperty(attr));
                chapter[attr] = o[attr];
        }
        
        return chapter;
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
            
            var chapter = new newChapter(o);
            
            if(!Object.keys(chapter).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            chapter.id = id;
            
            return (this[id] = chapter);
        }
    };
    
    return _;
}