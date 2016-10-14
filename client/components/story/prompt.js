app.cmp.story.prompt = {
    controller: function(args) {
        var story = args.story;
        
        var ctrl = {
            input: function(e) {
                var text = e.target.value;
                if(/^~!/.test(text)) {
                    var command = text.replace('~!', '').trim();
                    
                    switch(command) {
                        case 'restart':
                        case 'start':
                            start();
                            break;
                        case 'change name':
                            story.characters('narrator').speak('What would you like to change your name to?', function(response) {
                                story.characters('narrator').speak('Your name has been changed to ' + (story.characters(story.about).name = response))
                            });
                            break;
                        default:
                            try {
                                eval('console.log(' + command + ')');
                                story.characters('narrator').speak('Check the console for results.');
                            } catch(e){
                                story.characters('narrator').speak('Command not found.');
                            }
                            break;
                    }
                } else if(story.dialogue && story.dialogue.cb) {
                    story.dialogue.cb(text);
                }
                
                e.target.value = '';
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
                    m('span', story.characters(dialogue.character).name),
                    m('span', ': '),
                    m('span', dialogue.text)
                ]);
            }))
        ])
    }
}