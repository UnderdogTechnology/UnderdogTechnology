app.model.story.emotions = function(em){
    var _ = {
        add: function(emo, val) {
            if(!_.hasOwnProperty(emo) || isNaN(val)) return false;
        
            return (_[emo] += val);
        },
        subtract: function(emo, val) {
            if(!_.hasOwnProperty(emo) || isNaN(val)) return false;
            
            return (_[emo] -= val);
        },
        set: function(emo, val) {
            if(!_.hasOwnProperty(emo) || isNaN(val)) return false;
            
            return (_[emo] = val);
        },
        outliers: function() {
            var topVal,
                topEmotions = [];
            for(var attr in _){
                if(_.hasOwnProperty(attr) && !isNaN(_[attr]) && (!topVal || topVal && topVal < _[attr])) {
                    topVal = _[attr];
                }
            }
            
            for(var attr in _) {
                if(_.hasOwnProperty(attr) && !isNaN(_[attr]) && topVal == _[attr]) {
                    topEmotions.push(attr);
                }
            }
            
            return topEmotions;
        }
    };
    
    // Set defaults
    _.anger          = 0;
    _.fear           = 0;
    _.joy            = 0;
    _.sadness        = 0;
    
    // Set meta
    for(var attr in em) {
        if(em.hasOwnProperty(attr))
            _[attr] = em[attr];
    }
    
    return _;
};