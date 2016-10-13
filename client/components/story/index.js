app.cmp.story = {
    controller: function(args) {
        var curChapter,
            curEncounter;
            
        var ctrl = {
            start: function() {
                // TODO: Load all chapters, encounters and characters, refecence by unique Ids 'intro', 'bar', etc.
                ctrl.chapters = app.model.chapters();
                loadChapter('intro');
                
                ctrl.encounters = new app.model.encounters();
                loadEncounter('bar');
                
                ctrl.characters = app.model.characters();
                loadCharacter();
                
                var player = ctrl.characters.add({
                   role: 'Player',
                   name: 'Divide'
                });
                
                ctrl.about = player.id;
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
               dialogue: new app.model.dialogue()
            });
            
            encounter.with = [];
            
            curEncounter = encounter;
            
            curChapter.encounters.push(encounter.id);
            
            return encounter;
        };
        
        var loadCharacter = function() {
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
        ctrl.start();
        
        return m('div.story',[
            m('div.output'),
            m('input[type=text]')
        ]);
    }
};