polymer-devise
==============

A [Polymer][polymer] element to interact with [Devise][devise] authentication. 
Mimics the functionality of [angular_devise][].

## Requirements

This service requires Devise to respond to JSON. To do that, simply add

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  respond_to :html, :json
  # ...
end
```

TODO: Figure out how to do the CSRF token stuff

## Installing

TODO: Register in bower

```bash
bower install elliottsj/polymer-devise --save
```

## Usage

Simple usage with no parameters provided:

```html
<link rel="import" href="bower_components/polymer-devise/polymer-devise.html">
<polymer-element name="my-element">
  <template>
    <polymer-devise id="devise"></polymer-devise>
  </template>
  <script src="my-element.js"></script>
</polymer-element>
```

With optional parameters provided (default values shown):

```html
<link rel="import" href="bower_components/polymer-devise/polymer-devise.html">
<polymer-element name="my-element">
  <template>
    <polymer-devise id="devise"
                    loginMethod="POST"
                    loginPath="/users/sign_in.json"
                    logoutMethod="DELETE"
                    logoutPath="/users/sign_out.json"
                    registerMethod="POST"
                    registerPath="/users.json"></polymer-devise>
  </template>
  <script src="my-element.js"></script>
</polymer-element>
```

With event handlers declared:

```html
<link rel="import" href="bower_components/polymer-devise/polymer-devise.html">
<polymer-element name="my-element">
  <template>
    <polymer-devise id="devise"
                    on-devise-login="{{onLogin}}"
                    on-devise-new-session="{{onNewSession}}"
                    on-devise-logout="{{onLogout}}"
                    on-devise-new-registration="{{onNewRegistration}}"></polymer-devise>
  </template>
  <script src="my-element.js"></script>
</polymer-element>
```

### currentUser()

```javascript
// my-element.js
Polymer('my-element', {
  ready: function () {
    this.$.devise.currentUser().then(function (user) {
      // User was logged in, or Devise returned
      // previously authenticated session.
      console.log(user); // => {id: 1, ect: '...'}
    }, function(error) {
      // unauthenticated error
    });
  }
});
```

### isAuthenticated()

```javascript
// my-element.js
Polymer('my-element', {
  ready: function () {
    console.log(this.$.devise.isAuthenticated()); // => false
    
    // Log in user...
    
    console.log(this.$.devise.isAuthenticated()); // => true
  }
});
```

### login(creds)

```javascript
// my-element.js

var credentials = {
  email: 'user@domain.com',
  password: 'password1'
};

Polymer('my-element', {
  ready: function () {
    this.$.devise.login(credentials).then(function(user) {
      console.log(user); // => {id: 1, ect: '...'}
    }, function(error) {
      // Authentication failed...
    });
  },
  onLogin: function (event, currentUser, sender) {
    // after a login, a hard refresh, a new tab
  },
  onNewSession: function (event, currentUser, sender) {
    // user logged in by Auth.login({...})
  }
});
```

### logout()

```javascript
// my-element.js
Polymer('my-element', {
  ready: function () {
    // Log in user...
    // ...
    this.$.devise.logout().then(function(oldUser) {
      // alert(oldUser.name + "you're signed out now.");
    }, function(error) {
      // An error occurred logging out.
    });
  },
  onLogout: function (event, oldCurrentUser, sender) {
    // ...
  }
});
```

### parse(response)

TODO: Figure out how this works w/ Polymer

```javascript
// my-element.js
Polymer('my-element', {
  ready: function () {
    // Customize user parsing
    // NOTE: **MUST** return a truth-y expression
    AuthProvider.parse(function(response) {
        return response.data.user;
    });
  }
});
```

### register(creds)

```javascript
// my-element.js

var credentials = {
  email: 'user@domain.com',
  password: 'password1',
  password_confirmation: 'password1'
};

Polymer('my-element', {
  ready: function () {
    this.$.devise.register(credentials).then(function(registeredUser) {
      console.log(registeredUser); // => {id: 1, ect: '...'}
    }, function(error) {
      // Registration failed...
    });
  },
  onNewRegistration: function (event, user, sender) {
    // ...
  }
});
```

## Development

Clone the repo and install bower components:

```bash
mkdir polymer/
cd polymer/
git clone git@github.com:elliottsj/polymer-devise.git
cd polymer-devise/
bower install
```

## Viewing documentation

Start a local web server in the `polymer/` directory that contains `polymer-devise/`

```bash
cd polymer/
python -m http.server
```

Then browse to <http://localhost:8000/polymer-devise/>

## Running tests

TODO

[polymer]:        http://www.polymer-project.org/
[devise]:         https://github.com/plataformatec/devise
[angular_devise]: https://github.com/cloudspace/angular_devise
