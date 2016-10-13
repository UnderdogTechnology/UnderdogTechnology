app.cmp.story = {
    controller: function(args) {
        // Cached variables
        var _ = {};
            
        var ctrl = {
            dialogue: function(id) {
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
            input: function(e) {
                var input = e.target.value;
                
                if(/^~!/.test(input)) {
                    var command = input.replace('~!', '').trim();
                    
                    switch(command) {
                        case 'restart':
                        case 'start':
                            start();
                            break;
                        case 'change name':
                            ctrl.characters('narrator').speak('What would you like to change your name to?', function(response) {
                                ctrl.characters('narrator').speak('Your name has been changed to ' + (ctrl.characters(_.about).name = response))
                            });
                            break;
                        default:
                            try {
                                eval('console.log(' + command + ')');
                                ctrl.characters('narrator').speak('Check the console for results.');
                            } catch(e){
                                ctrl.characters('narrator').speak('Command not found.');
                            }
                            break;
                    }
                } else if(_.dialogue && _.dialogue.cb) {
                    _.dialogue.cb(input);
                }
                
                e.target.value = '';
            }
        };
        
        var start = function() {
            _ = {};
            
            _.dialogs = app.model.dialogs();
            _.characters = app.model.characters();
            
            _.chapters = app.model.chapters();
            loadChapter('intro');
            
            _.encounters = app.model.encounters();
            loadEncounter('intro');
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
                _.dialogue = _.dialogs.add({
                    text: line,
                    character: this.id,
                    cb: cb || null
                });
                
                ctrl.encounter.dialogue.push(_.dialogue.id);
                
                return _.dialogue;
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
        
        start();
        return ctrl;
    },
    view: function(ctrl, args) {
        
        return m('div.story',
            m('div.prompt', [
                m('input[type=text].input', {
                    onchange: ctrl.input
                }),
                m('div.output', ctrl.encounter.dialogue.map(function(id){
                    var dialogue = ctrl.dialogue(id);
                    return m('p', [
                        m('span', ctrl.characters(dialogue.character).name),
                        m('span', ': '),
                        m('span', dialogue.text)
                    ]);
                }))
            ])
        );
    }
};