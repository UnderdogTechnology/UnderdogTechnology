(function() {

    var system = window.system = window.system || {};

    var addScript = function(src, cb) {
        var script = document.createElement('script');
        script.onload = cb;
        script.src = src;
        document.head.appendChild(script);
    };

    system.loadModules = function(deps, done) { 

        var dir;
        var loaded = 0;
        var loading = 0;

        var load = function() {
            loaded += 1;
            if (loaded === loading) done();
        };

        for (dir in deps) {
            if (deps.hasOwnProperty(dir)) {
                deps[dir].forEach(function(file) {
                    var src = dir + file + '.js';
                    console.log(++loading, src);
                    addScript(src, load);
                });
            }
        }

    };
}());
