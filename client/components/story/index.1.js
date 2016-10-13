(function(){
    var app = window.t = window.t || {
        cmp:{}
    };
    
    app.eResp = function(phrase) {
        var emo = new emotions();
        
        var emotionalTests = {
            'anger'     : [/>:\(/, /slut/, /fuck/],
            'fear'      : [/:O/, /kill/],
            'joy'       : [/:\)/, /sempai/, /love/],
            'sadness'   : [/:\(/, /dead/]
        };
        
        for(var emotion in emotionalTests) {
            if(emotionalTests.hasOwnProperty(emotion)){
                var regexArr = emotionalTests[emotion];
                for(var regex in regexArr) {
                    if(regexArr.hasOwnProperty(regex) && regexArr[regex].test(phrase)) {
                        emo.add(emotion, 1);
                    }
                }
            }
        }
        
        return emo;
    }
    
    app.cmp.story = {
        controller: function(args) {
            var curChapter,
                curEncounter;
            
            
            var ctrl = {
                start: function() {
                    ctrl.chapters = new chapters();
                    loadChapter('intro');
                    
                    ctrl.encounters = new encounters();
                    loadEncounter('bar');
                    
                    ctrl.characters = new characters();
                    loadCharacter();
                    
                    var player = ctrl.characters.add({
                       role: 'Player',
                       name: 'Divide'
                    });
                    
                    ctrl.about = player.id;
                    console.log(ctrl);
                }
            };
                
            var loadChapter = function() {
                var chapter = ctrl.chapters.add({
                    title: 'First Chapter'
                });
                
                chapter.encounters = [];
                
                curChapter = chapter;
                
                return chapter;
            };
            
            var loadEncounter = function() {
                var encounter = ctrl.encounters.add({
                   type: 'Dialogue',
                   dialogue: new dialogue()
                });
                
                encounter.with = [];
                
                curEncounter = encounter;
                
                curChapter.encounters.push(encounter.id);
                
                return encounter;
            };
            
            loadCharacter = function() {
                var speak = function(line) {
                    return curEncounter.dialogue.add({
                        text: line,
                        character: this.id
                    });
                }
                
                var narrator = ctrl.characters.add({
                    name: 'Narrator',
                    role: 'NPC',
                    speak: speak
                });
                
                curEncounter.with.push(narrator.id);
                
                var barKeep = ctrl.characters.add({
                    name: 'Bar Keep',
                    role: 'NPC',
                    speak: speak
                });
                
                curEncounter.with.push(barKeep.id);
                
                return [narrator, barKeep];
            };
            
            return ctrl;
        },
        view: function(ctrl, args) {
            return null
        }
    };

    
    var story = app.story = app.story || function() {
        var curChapter,
            curEncounter;
        
        this.loadChapter = function() {
            var chapter = this.chapters.add({
                title: 'First Chapter'
            });
            
            chapter.encounters = [];
            
            curChapter = chapter;
            
            return chapter;
        };
        
        this.loadEncounter = function() {
            var encounter = this.encounters.add({
               type: 'Dialogue',
               dialogue: new dialogue()
            });
            
            encounter.with = [];
            
            curEncounter = encounter;
            
            curChapter.encounters.push(encounter.id);
            
            return encounter;
        };
        
        this.loadCharacter = function() {
            var speak = function(line) {
                return curEncounter.dialogue.add({
                    text: line,
                    character: this.id
                });
            }
            
            var narrator = this.characters.add({
                name: 'Narrator',
                role: 'NPC',
                speak: speak
            });
            
            curEncounter.with.push(narrator.id);
            
            var barKeep = this.characters.add({
                name: 'Bar Keep',
                role: 'NPC',
                speak: speak
            });
            
            curEncounter.with.push(barKeep.id);
            
            return [narrator, barKeep];
        };
        
        this.start = function() {
            this.chapters = new chapters();
            this.loadChapter('intro');
            
            this.encounters = new encounters();
            this.loadEncounter('bar');
            
            this.characters = new characters();
            this.loadCharacter();
            
            var player = this.characters.add({
               role: 'Player',
               name: 'Divide'
            });
            
            this.about = player.id;
        }
    }
    
    var chapters = function() {
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
        
        this.add = function(o) {
            if(!o) return false;
            
            return this.set(o);
        };
        
        this.remove = function(id) {
            if(!this.hasOwnProperty(id)) return false;
            
            return (delete this[id]);
        };
        
        this.set = function(o) {
            if(!o) return false;
            
            var chapter = new newChapter(o);
            
            if(!Object.keys(chapter).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            chapter.id = id;
            
            return (this[id] = chapter);
        };
        
        return this;
    }
    
    var dialogue = function() {
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
        
        this.add = function(o) {
            if(!o) return false;
            
            return this.set(o);
        };
        
        this.remove = function(id) {
            if(!this.hasOwnProperty(id)) return false;
            
            return (delete this[id]);
        };
        
        this.set = function(o) {
            if(!o) return false;
            
            var line = newLine(o);
            
            if(!Object.keys(line).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            line.id = id;
            
            return (this[id] = line);
        };
        
        return this;
    }
    
    var encounters = function(init) {
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
        
        this.add = function(o) {
            if(!o) return false;
            
            return this.set(o);
        };
        
        this.remove = function(id) {
            if(!this.hasOwnProperty(id)) return false;
            
            return (delete this[id]);
        };
        
        this.set = function(o) {
            if(!o) return false;
            
            var encounter = new newEncounter(o);
            
            if(!Object.keys(encounter).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            encounter.id = id;
            
            return (this[id] = encounter);
        };
        
        return this;
    };
    
    var characters = function(list) {
        var curId = 0;
        
        var newCharacter = function(o) {
            if(!o || o && (!o['role'])) return false;
            
            var character = {};
            
            // Set defaults
            character.state      = 'Conscious';
            character.emotions   = new emotions();
            
            // Set meta
            for(var attr in o) {
                if(o.hasOwnProperty(attr))
                    character[attr] = o[attr];
            }
            
            return character;
        };
        
        this.add = function(o) {
            return this.set(o);
        };
        
        this.remove = function(id) {
            if(!this.hasOwnProperty(id)) return false;
            
            return (delete this[id]);
        };
        
        this.set = function(o) {
            if(!o) return false;
            
            var character = new newCharacter(o);
            
            if(!Object.keys(character).length) return false;
            
            var id = !isNaN(o.id) ? o.id : curId++;
            
            character.id = id;
            
            return (this[id] = character);
        };
        
        this.find = function(o) {
            if(!o) return false;
            
            if(o.id && this[o.id]) return this[o.id];
            var character;
            for(var id in this) {
                
                if(this.hasOwnProperty(id)) {
                    var match = true;
                    
                    character = this[id];
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
        };
        
        if(list) {
            for(var character in list) {
                if(list.hasOwnProperty(character)) {
                    this.add(list[character]);
                }
            }
        }
        
        return this;
    }

    var emotions = function(em){
        this.add = function(emo, val) {
            if(!this.hasOwnProperty(emo) || isNaN(val)) return false;
        
            return (this[emo] += val);
        };
        
        this.subtract = function(emo, val) {
            if(!this.hasOwnProperty(emo) || isNaN(val)) return false;
            
            return (this[emo] -= val);
        };
        
        this.set = function(emo, val) {
            if(!this.hasOwnProperty(emo) || isNaN(val)) return false;
            
            return (this[emo] = val);
        };
        
        this.outliers = function() {
            var topVal,
                topEmotions = [];
            for(var attr in this){
                if(this.hasOwnProperty(attr) && !isNaN(this[attr]) && (!topVal || topVal && topVal < this[attr])) {
                    topVal = this[attr];
                }
            }
            
            for(var attr in this) {
                if(this.hasOwnProperty(attr) && !isNaN(this[attr]) && topVal == this[attr]) {
                    topEmotions.push(attr);
                }
            }
            
            return topEmotions;
        };
        
        // Set defaults
        this.anger          = 0;
        this.fear           = 0;
        this.joy            = 0;
        this.sadness        = 0;
        
        // Set meta
        for(var attr in em) {
            if(em.hasOwnProperty(attr))
                this[attr] = em[attr];
        }
        
        return this;
    };
    
}());