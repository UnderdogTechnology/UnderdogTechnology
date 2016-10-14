app.cmp.story.prompt = {
    controller: function(args) {
        var story = args.story;
        
        var ctrl = {
            interpreter: function(command) {
                var commands = {
                    'restart': {
                        regArr: [/^(re)?start$/i],
                        execute: story.start
                    },
                    'change name': {
                        regArr: [/change\s?(my\s)?name/i],
                        execute: function() {
                            var name = command.split('to')[1];
                            if(name) {
                                story.characters('narrator').speak('Your name has been changed to ' + (story.characters(story.about).name = name.trim()) + '.');
                            } else {
                                story.characters('narrator').speak('What would you like to change your name to?', function(response) {
                                    story.characters('narrator').speak('Your name has been changed to ' + (story.characters(story.about).name = response.trim()) + '.');
                                });
                            }
                        }
                    }
                }
                // Command matches key
                if(commands[command]) {
                    commands[command].execute();
                    return true;
                }
                
                // TODO: write interpret question function and seperate interpret command into own function
                if(/^can[\w\d\s]*\?$/i.test(command)) {
                    story.characters('narrator').speak('Of course.');
                    command = command.replace(/\?$/,'');
                }
                
                // Look for command using regex
                for(var key in commands) {
                    if(commands.hasOwnProperty(key)) {
                        for(var ex in commands[key].regArr) {
                            if(commands[key].regArr.hasOwnProperty(ex) && commands[key].regArr[ex].test(command)){
                                commands[key].execute();
                                return true;
                            }
                        }
                    }
                }
                
                return false;
            },
            input: function(e) {
                var text = e.target.value;
                e.target.value = '';
                
                if(ctrl.interpreter(text)) return true;
                
                if(story.dialogue && story.dialogue.cb) {
                    story.dialogue.cb(text);
                } else {
                    story.characters('narrator').speak('Command not found.');
                }
            }
        }
        
        return ctrl;
    },
    view: function(ctrl, args) {
        var story = args.story;
        return m('div.prompt', [
            m('input[type=text].input', {
                onchange: ctrl.input
            }),
            m('div.output', story.encounter.dialogue.map(function(id){
                var dialogue = story.dialogs(id);
                return m('p', [
                    m('span', dialogue.text)
                ]);
            }))
        ])
    }
}