app.cmp.story.home = {
    controller: function(args) {
        // Cached variables
        var _ = {};
            
        var ctrl = {
            dialogs: function(id) {
              return _.dialogs[id];  
            },
            chapters: function(id) {
                return _.chapters[id];
            },
            encounters: function(id) {
                return _.encounters[id];
            },
            characters: function(id) {
                return _.characters[id];
            },
            start: function() {
                _ = {};
                
                _.dialogs = app.model.story.dialogs();
                _.characters = app.model.story.characters();
                
                _.chapters = app.model.story.chapters();
                loadChapter('intro');
                
                _.encounters = app.model.story.encounters();
                loadEncounter('intro');
            }
        };
            
        var loadChapter = function(id) {
            var chapter = _.chapters.add({id: id});
            
            ctrl.chapter = chapter;
            
            return chapter;
        };
        
        var loadEncounter = function(id) {
            ctrl.encounter = _.encounters.add({
                id: id,
                begin: function() {
                    return this.start(ctrl, _);
                }
            });
            
            ctrl.chapter.encounters.push(ctrl.encounter.id);
            
            loadCharacter('narrator');
            
            ctrl.encounter.begin();
            
            return ctrl.encounter;
        };
        
        var loadCharacter = function(id) {
            var speak = function(line, cb) {
                ctrl.dialogue = _.dialogs.add({
                    text: line,
                    character: this.id,
                    cb: cb || null
                });
                
                ctrl.encounter.dialogue.push(ctrl.dialogue.id);
                
                return ctrl.dialogue;
            }
            
            var perform = function(action, cb) {
                ctrl.characters('narrator').speak(this.name + ' has ' + action, cb);
            }
            
            var character = _.characters.add({
                id: id,
                speak: speak,
                perform: perform
            });
            
            ctrl.encounter.with.push(character.id);
            
            if(id !== 'narrator') ctrl.characters('narrator').speak(character.name + ' enters the ' + ctrl.encounter.place)
            
            return character;
        };
        
        ctrl.start();
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.story',
            m.component(app.cmp.story.prompt, {
                story: ctrl
            })
        );
    }
};