module.exports = void ((GLB) => {
    GLB.requireAbsolute = (id) => {return require(require.main.path + "/" + id)};
    Object.prototype.with = function(obj) { Object.assign(this,obj); return this; };
    Object.prototype.withClone = function(obj) { let j = this; Object.assign(j,obj); return j; };
    Object.prototype.onto = function(func) { func.call(this,this); return this; };
    Object.prototype.ontoClone = function(func) { let j = this; func.call(j,j); return j; };
    Object.prototype.dispose = function() { delete this; }
    Array.prototype.any = function() { return this.length > 0 };
    String.prototype.toUpperCaseFirstLetter = function() { return this.charAt(0).toUpperCase()+this.slice(1) }

    GLB.swallow = function(func) { try { return func.call(this); } catch { return undefined; } };
    GLB.skip = function(func) {return func.call(this);};
    GLB.swallowCatch = function(func) { try { return func.call(this); } catch (error) { return error; } };

    GLB.bullet = function(func) { return new Promise((res,rej) => {try{func().then(res,()=>rej(undefined))}catch{try{func();res()}catch{rej(undefined)}}}) }
    GLB.bulletCatch = function(func) { return new Promise((res,rej) => {try{func().then(res,rej)}catch{try{func();res()}catch(rx){rej(rx)}}}) }

    GLB.isset = function(e) { return !(e === null || e === undefined); };
    GLB.isnotset = function(e) { return (e === null || e === undefined); };
    GLB.unset = function(e) { delete e; };

    GLB.tasking = {
        delay: function(delay){return new Promise((resolve) => {setTimeout(resolve,delay);});},
        desync: function(func) { return new Promise( function(resolv,rej) { setTimeout(function() { try { resolv(func.call(this)); } catch(err) { rej(err); } } ,1) } ); },
        queueMicrotask: GLB.queueMicrotask
    };

    GLB.getCurrentDate = function(e) { 
        let st = new Date();
        return {
            LongDateString: (st.getFullYear() + '-' +('0' + (st.getMonth()+1)).slice(-2)+ '-' +  ('0' + st.getDate()).slice(-2) + ' '+st.getHours().toString().padStart(2,"0")+ ':'+('0' + (st.getMinutes())).slice(-2)+ ':'+st.getSeconds().toString().padStart(2,"0")+ ':'+st.getMilliseconds().toString().padStart(4,"0")),
            Milliseconds: st.getTime()
        };
    };
    
    // setIntervalACR (Accurate Interval)
    (() => {
        GLB.setIntervalACR = function(workFunc, interval) {
            var that = this;
            var expected, timeout;
            this.interval = interval; 
            this.intervalDisposer = function() {
                clearTimeout(timeout);
            }
            function intervalStepper() {
                var drift = Date.now() - expected;
                workFunc();
                expected += that.interval;
                timeout = setTimeout(intervalStepper, Math.max(0, that.interval-drift));
            }
            expected = Date.now() + this.interval;
            timeout = setTimeout(intervalStepper, this.interval);
            return this;
        }
        GLB.clearIntervalPrototype = GLB.clearInterval;
        GLB.clearInterval = (idfx) => {
            if (typeof idfx.intervalDisposer !== 'undefined') idfx.intervalDisposer();
            else clearIntervalPrototype(idfx);
        };
    })();

    // log (Better Log)
    (() => {
        const mark = (nme = undefined) => {
            if (process.verbose) return '\x1b[' + (process.color || 34) + 'm[' + (nme ? nme : process.title) + " \x1b[33m" + getCurrentDate().LongDateString + '\x1b[' + (process.color || 34) + 'm]';
            else return '\x1b[' + (process.color || 34) + 'm[' + (nme ? nme : process.title) + ']';
        }
        const more = function() { const h = this; return {
            // Here are the logging functions
            logNext: function(...args) {return GLB.log.call({ident: h.ident + "│ "}, h.ident+ "│", ...args)},
            logEnd: function(...args) {return GLB.log.call({ident: h.ident + "  "}, h.ident+ "┕", ...args)},
            verboseNext: function(...args) {return GLB.verbose.call({ident: h.ident + "│ "}, h.ident+ "│", ...args)},
            verboseEnd: function(...args) {return GLB.verbose.call({ident: h.ident + "  "}, h.ident+ "┕", ...args)},
            errorNext: function(...args) {return GLB.error.call({ident: h.ident + "│ "}, h.ident+ "│\x1b[31m", ...args)},
            errorEnd: function(...args) {return GLB.error.call({ident: h.ident + "  "}, h.ident+ "┕\x1b[31m", ...args)},
        }}
        GLB.ansify = {
            black: (t) => {return "\x1b[30m" + t + "\x1b[0m";},
            red: (t) => {return "\x1b[31m" + t + "\x1b[0m";},
            green: (t) => {return "\x1b[32m" + t + "\x1b[0m";},
            yellow: (t) => {return "\x1b[33m" + t + "\x1b[0m";},
            blue: (t) => {return "\x1b[34m" + t + "\x1b[0m";},
            magenta: (t) => {return "\x1b[35m" + t + "\x1b[0m";},
            cyan: (t) => {return "\x1b[36m" + t + "\x1b[0m";},
            white: (t) => {return "\x1b[37m" + t + "\x1b[0m";},
            reset: (t) => {return "\x1b[0m" + t + "\x1b[0m";}
        }

        console.baseLog = console.log;
        console.baseError = console.error;
        console.log = (...args) => console.baseLog(mark(this.pname || undefined) + ' \x1b[37m', ...args, '\x1b[0m');
        console.error = (...args) => console.baseError(mark(this.pname || undefined) + ' \x1b[31m', ...args, '\x1b[0m');

        GLB.log = function(...args) { console.baseLog(mark(this.pname || undefined) + ' \x1b[37m', ...args, '\x1b[0m');return more.call({ident:(this.ident === undefined ? "" : this.ident)}); };
        GLB.verbose = function(...args) { if (process.verbose) console.baseLog(mark(this.pname || undefined) + ' \x1b[37m', ...args, '\x1b[0m'); return more.call({ident:(this.ident === undefined ? "" : this.ident)}); };
        GLB.error = function(...args) { console.baseError(mark(this.pname || undefined) + ' \x1b[31m', ...args, '\x1b[0m'); return more.call({ident:(this.ident === undefined ? "" : this.ident)}); };
        GLB.errorCat = (i) => {
            var spl = i.toString().split("\n");; 
            if (spl.length > 1){
                var kStart = spl.shift();
                var kEnd = spl.pop();
                const vLog = verbose("\x1b[31m" + kStart);
                spl.forEach(kl => {
                    vLog.verboseNext("\x1b[31m" + kl);
                });
                vLog.verboseEnd("\x1b[31m" + kEnd);
            } else {verbose("\x1b[31m" + i);}
        }
        GLB.debug = (c,i) => {
            var spl = i.split("\n");
            if (spl.length > 1){
                var kStart = spl.shift();
                var kEnd = spl.pop();
                const vLog = verbose("\x1b[36m" + `<${c}> ` + "\x1b[35m" + kStart);
                spl.forEach(kl => {
                    vLog.verboseNext("\x1b[35m" + kl);
                });
                vLog.verboseEnd("\x1b[35m" + kEnd);
            } else {verbose("\x1b[36m" + `<${c}> ` + "\x1b[35m" + i);};
        }
        GLB.catArray = (arr, fn) => {var k = "";arr.forEach(e => {k = k + fn(e);});return k;};
    })();

    // khandle (Process Kill Handler)
    (() => {
        var forceShut = false;
        var hooks = [];
        GLB.addKillHook = (func) => { hooks.push(func); }
        GLB.removeKillHook = (func) => { delete hooks[hooks.indexOf(func)]; }
        function exitHandler(...args) {
            hooks.forEach(hook => hook());
            if (args[1][(process.verbose ? "stack" : "message")] !== undefined) errorCat(args[1][(process.verbose ? "stack" : "message")]);
            else if (args[1] !== undefined) errorCat(args[1]);
            if (forceShut === true) process.exit();
            forceShut = args[0];
        }
        process.on('exit', exitHandler.bind(null, false));
        process.on('SIGINT', exitHandler.bind(null, true));
        process.on('SIGUSR1', exitHandler.bind(null, false));
        process.on('SIGUSR2', exitHandler.bind(null, false));
        process.on('uncaughtException', exitHandler.bind(null, false));
    })();
    return 0;
})(typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis));