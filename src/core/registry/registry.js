import Path from "path";
import IPC from "../communication/IPC";
var globalModulePath;
/**
 * A class to track all the modules, and handle module requests
 */
class Registry{
    /**
     * Request modules to handle the passed data and establish a connection with these modules
     * @param  {{type:String, execute:String|function, data:Object, source:Module}} data The information on how to handle the data
     * @return {Promise} The Promise that shall return the channels created to communicate with the modules
     */
    static requestHandle(data){
        if(!request.use) request.use = "all";
        return this.__request(request, "handle");
    }
    static requestModule(request){
        if(!request.use) request.use = "one";
        return this.__request(request, "module");
    }
    /**
     * Registers a module in the registry such that it can be requested by other modules
     * @param  {Class} Class The class of the module you want to register
     * @param  {{type:String, filter:function(request)}} classListener An event you would like this module to act on
     * @return {Undefined} The method returns no useful information
     */
    static register(Class, ...classListeners){
        // Set the path of the module
        Class.modulePath = globalModulePath;

        // Register the module itself
        this.modules[Class.modulePath] = {
            class: Class,
            listeners: classListeners
        };

        // Register all the listeners
        classListeners.forEach(listener=>{
            // Keep a connection with the module itself
            listener.module = Class;

            // Add to the list of listeners for this request type
            const listeners = this.__getListeners(listener.type);
            listeners.listeners.push(listener);
        });
    }

    // Protected methods
    static loadModule(path){
        if(!this.modules[path]){
            globalModulePath = path;
            require(this.__getModulesPath(path));
        }
        return this.modules[path] && this.modules[path].class;
    }
    static loadAllModules(){
        //TODO make a module loader
    }

    // Protected methods
    static _registerModuleInstance(moduleInstance){
        return new Promise((resolve, reject)=>{
            const requestPath = moduleInstance.getPath();
            IPC.send("Registry.registerModuleInstance", {
                requestPath: requestPath.toString(true)
            }, 0).then(responses=>{
                const ID = responses[0];
                requestPath.getModuleID().ID = ID;
                resolve(ID);
            });
        });
    }
    static _deregisterModuleInstance(moduleInstance){
        return new Promise((resolve, reject)=>{
            const requestPath = moduleInstance.getPath();
            IPC.send("Registry.deregisterModuleInstance", {
                requestPath: requestPath.toString(true)
            }, 0).then(responses=>{
                resolve();
            });
        });
    }

    // Private methods
    /**
     * Creates the listener variable for a certain type if necessary, and returns it
     * @param  {String} type The request type to return the listener of
     * @return {{type:String, listeners:[{module:Module, filter:function(request)}, ...]}} An object that tracks the listeners for a certain request type
     */
    static __getListeners(type){
        // Create listeners type variable if not available
        if(!this.listeners[type])
            this.listeners[type] = {
                type: type,
                listeners: []
            };

        // Return listener type
        return this.listeners[type];
    }
    /**
     * Returns the relative path from this class to the modules directory
     * @param  {String} [path=""] The path to append to the modules directory
     * @return {String}           The relative path to the directory
     */
    static __getModulesPath(path=""){
        return Path.join("..", "..", "modules", path);
    }

    static __getModules(request){
        // Get the module listeners to handle this type of request
        const listenerType = this.__getListeners(request.type);

        // Map modules with their priority to this particular request
        const priorities = listenerType.listeners.map(listener=>{
            return {
                priority:listener.filter(request),
                module:listener.module
            };
        }).filter(priority=>priority.priority>0);

        // Sort the results
        priorities.sort((a,b)=>b.priority-a.priority);

        // Determine what modules to return
        if(request.use=="all"){
            return priorities.map(a=>a.module);
        }else if(typeof(request.use)=="Function"){
            return priorities.filter(request.use).map(a=>a.module);
        }else{
            return priorities[0] && priorities[0].module;
        }
    }
    static __resolveRequest(requestID, modules){
        // Check if there is a request that goes by this ID
        const request = this.requests[requestID];
        if(request){
            // Delete the request as we are answering it now
            delete this.requests[requestID];

            // Resolve request by simply returning the module if it was a module request,
            //      or instanciate a module and return a channel on a handle request
            if(request.type=="module"){
                request.resolve(modules);
            }else if(request.type=="handle"){
                //TODO make handle requests instantiate modules and return channels
                modules.forEach(module=>{

                });
            }
        }
    }
    static __request(request, type){
        // Attach extra data to the request
        const ID = this.requests.ID++;
        request.ID = ID;
        request = {
            requestData: request,
            type: "module"
        };

        // Create a promise to return, and make it resolvable from the request
        const promise = new Promise((resolve, reject)=>{
            request.resolve = resolve;
        });

        // Store the request such that it can later be resolved
        this.requests[ID] = request;

        // Retrieve the modules to resolve the request
        if(IPC._isRenderer()){
            // Send a command to the main window to look for modules to resolve the request
            IPC.send("Registry.request", request.requestData, 0);
        }else{
            // Directly resolve the request as we have access to all modules
            const modules = this.__getModules(request.data);
            this.__resolveRequest(ID, modules);
        }

        // Return the Promise
        return promise;
    }

    /**
     * The initial setup method to be called by this file itself, initialises the static fields of the class
     * @return {Undefined} The method returns no useful information
     */
    static __setup(){
        // Stores the listeners for handle and module requests, indexed by type
        this.listeners = {};

        // Stores the registered modules themselves, indexed by path
        this.modules = {};

        // Stores the requests that are currently awaiting to be answered
        this.requests = {ID:0};

        // Set up the IPC listeners in the renderers and main process to allow renderers to request modules
        if(IPC._isRenderer()){
            // Resolve the request when the main process returns the modules
            IPC.on("Registry.returnRequest", event=>{
                const data = event.data;

                this.__resolveRequest(data.requestID, data.modules);
            });
        }else{
            // Filter out possible modules in this window to handle the handle request
            IPC.on("Registry.request", event=>{
                const source = event.sourceID;
                const request = event.data;

                // Retrieve the priority mapping
                const modules = this.__getModules(request);

                // Return the mapping of modules and their priorities
                IPC.send("Registry.returnRequest", {modules:modules, requestID:request.ID}, source);
            });


            // Stores lists of unique module instance request paths, indexed by request paths
            this.moduleInstancePaths = {};

            // Listen for module instances being registered
            IPC.on("Registry.registerModuleInstance", event=>{
                const requestPath = new RequestPath(event.data.requestPath);
                let paths = this.moduleInstancePaths[requestPath.toString()];
                if(!paths)
                    paths = this.moduleInstancePaths[requestPath.toString()] = {};

                let IDS = Object.values(paths).map(path=>path.getModuleID().ID);
                let ID = 0;
                while(IDS.indexOf(ID)!=-1) ID++;
                requestPath.getModuleID().ID = ID;
                this.moduleInstancePaths[requestPath.toString()] = requestPath;
                return ID;
            });

            // Listen for module instances being deregistered
            IPC.on("Registry.deregisterModuleInstance", event=>{
                const requestPath = new RequestPath(event.data.requestPath);
                let paths = this.moduleInstancePaths[requestPath.toString()];
                if(paths){
                    delete paths[requestPath.toString(true)];
                }
            });
        }


    }
};
Registry.__setup();
export default Registry;
