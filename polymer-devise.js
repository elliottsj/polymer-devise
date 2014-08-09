(function () {
  /**
   * The default paths.
   */
  var paths = {
    login: '/users/sign_in.json',
    logout: '/users/sign_out.json',
    register: '/users.json'
  };

  /**
   * The default HTTP methods to use.
   */
  var methods = {
    login: 'POST',
    logout: 'DELETE',
    register: 'POST'
  };

  /**
   * Set to true if 401 interception of the provider is not desired
   */
  var ignoreAuth = false;

  /**
   * The parsing function used to turn a $http
   * response into a "user".
   *
   * Can be swapped with another parsing function
   * using
   *
   *  angular.module('myModule', ['Devise']).
   *  config(function(AuthProvider) {
   *      AuthProvider.parse(function(response) {
   *          return new User(response.data);
   *      });
   *  });
   */
  var _parse = function(response) {
    return response.data;
  };

  Polymer('polymer-devise', {
    /**
     * The Auth service's current user.
     * This is shared between all instances of Auth
     * on the scope.
     */
    _currentUser: null,

    /**
     * The `loginMethod` attribute sets the HTTP method used to login
     *
     * @attribute loginMethod
     * @type string
     * @default 'POST'
     */
    loginMethod: 'POST',

    /**
     * The `loginPath` attribute sets the path used to login
     *
     * @attribute loginPath
     * @type string
     * @default '/users/sign_in.json'
     */
    loginPath: '/users/sign_in.json',

    /**
     * The `logoutMethod` attribute sets the HTTP method used to logout
     *
     * @attribute logoutMethod
     * @type string
     * @default 'DELETE'
     */
    logoutMethod: 'DELETE',

    /**
     * The `logoutPath` attribute sets the path used to logout
     *
     * @attribute logoutPath
     * @type string
     * @default '/users/sign_out.json'
     */
    logoutPath: '/users/sign_out.json',

    /**
     * The `registerMethod` attribute sets the HTTP method used to register
     *
     * @attribute registerMethod
     * @type string
     * @default 'POST'
     */
    registerMethod: 'POST',

    /**
     * The `registerPath` attribute sets the path used to register
     *
     * @attribute registerPath
     * @type string
     * @default '/users.json'
     */
    registerPath: '/users.json',

    ready: function() {
      // Ready is a lifecycle callback.
      // You can do setup work in here.
      // More info: http://www.polymer-project.org/docs/polymer/polymer.html#lifecyclemethods
    },

    /**
     * The Auth service's parsing function.
     * Defaults to the parsing function set in the provider,
     * but may also be overwritten directly on the service.
     */
    parse: _parse,

    /**
     * A login function to authenticate with the server.
     * Keep in mind, credentials are sent in plaintext;
     * use a SSL connection to secure them. By default,
     * `login` will POST to '/users/sign_in.json'.
     *
     * The path and HTTP method used to login are configurable
     * using
     *
     *  angular.module('myModule', ['Devise']).
     *  config(function(AuthProvider) {
             *      AuthProvider.loginPath('path/on/server.json');
             *      AuthProvider.loginMethod('GET');
             *  });
     *
     * @param {Object} [creds] A hash of user credentials.
     * @returns {Promise} A $http promise that will be resolved or
     *                  rejected by the server.
     */
    login: function(creds) {
      var withCredentials = arguments.length > 0,
          loggedIn = service.isAuthenticated();

      creds = creds || {};
      return $http(httpConfig('login', {user: creds}))
          .then(service.parse)
          .then(save)
          .then(function(user) {
            if (withCredentials && !loggedIn) {
              return broadcast('new-session')(user);
            }
            return user;
          })
          .then(broadcast('login'));
    },

    /**
     * A logout function to de-authenticate from the server.
     * By default, `logout` will DELETE to '/users/sign_out.json'.
     *
     * The path and HTTP method used to logout are configurable
     * using
     *
     *  angular.module('myModule', ['Devise']).
     *  config(function(AuthProvider) {
             *      AuthProvider.logoutPath('path/on/server.json');
             *      AuthProvider.logoutMethod('GET');
             *  });
     * @returns {Promise} A $http promise that will be resolved or
     *                  rejected by the server.
     */
    logout: function() {
      var returnOldUser = constant(service._currentUser);
      return $http(httpConfig('logout'))
          .then(reset)
          .then(returnOldUser)
          .then(broadcast('logout'));
    },

    /**
     * A register function to register and authenticate
     * with the server. Keep in mind, credentials are sent
     * in plaintext; use a SSL connection to secure them.
     * By default, `register` will POST to '/users.json'.
     *
     * The path and HTTP method used to login are configurable
     * using
     *
     *  angular.module('myModule', ['Devise']).
     *  config(function(AuthProvider) {
             *      AuthProvider.registerPath('path/on/server.json');
             *      AuthProvider.registerMethod('GET');
             *  });
     *
     * @param {Object} [creds] A hash of user credentials.
     * @returns {Promise} A $http promise that will be resolved or
     *                  rejected by the server.
     */
    register: function(creds) {
      creds = creds || {};
      return $http(httpConfig('register', {user: creds}))
          .then(service.parse)
          .then(save)
          .then(broadcast('new-registration'));
    },

    /**
     * A helper function that will return a promise with the currentUser.
     * Three different outcomes can happen:
     *  1. Auth has authenticated a user, and will resolve with it
     *  2. Auth has not authenticated a user but the server has an
     *      authenticated session, Auth will attempt to retrieve that
     *      session and resolve with its user.
     *  3. Neither Auth nor the server has an authenticated session,
     *      and will reject with an unauthenticated error.
     *
     * @returns {Promise} A $http promise that will be resolved or
     *                  rejected by the server.
     */
    currentUser: function() {
      if (service.isAuthenticated()) {
        return $q.when(service._currentUser);
      }
      return service.login();
    },

    /**
     * A helper function to determine if a currentUser is present.
     *
     * @returns Boolean
     */
    isAuthenticated: function(){
      return !!service._currentUser;
    },


    /**
     * The `author` attribute sets an initial author
     *
     * @attribute author
     * @type string
     * @default 'Dimitri Glazkov'
     */
    author: 'Dimitri Glazkov',

    /**
     * `fancy` is a property that does something fancy.
     *
     * @property fancy
     * @type bool
     * @default false
     */
    fancy: false,

    /**
     * The `sayHello` method will return a greeting.
     *
     * @method sayHello
     * @param {String} greeting Pass in a specific greeting.
     * @return {String} Returns a string greeting.
     */
    sayHello: function(greeting) {
      var response = greeting || 'Hello World!';
      return 'polymer-devise says, ' + response;
    },

    /**
     * The `polymer-devise-lasers-success` event is fired whenever we
     * call fireLasers.
     *
     * @event polymer-devise-lasers-success
     * @param {Object} detail
     *   @param {string} detail.sound An amazing sound.
     */

    /**
     * The `fireLasers` method will fire the lasers. At least
     * it will dispatch an event that claims lasers were fired :)
     *
     * @method fireLasers
     */
    fireLasers: function() {
      this.fire('polymer-devise-lasers-success', { sound: 'Pew pew pew!' });
    }

  });
}());
