polymer-devise
==============

A [Polymer][polymer] element to interact with [Devise][devise] authentication. 
Mimics the functionality of [angular_devise][].

## Usage

Simple usage with no parameters provided:

```html
<link rel="import" href="bower_components/polymer-devise/polymer-devise.html">
<polymer-devise id="devise"></polymer-devise>
<script src="script.js"><script>
```

With optional parameters provided (default values shown):

```html
<link rel="import" href="bower_components/polymer-devise/polymer-devise.html">
<polymer-devise id="devise"
                loginMethod="POST"
                loginPath="/users/sign_in.json"
                logoutMethod="DELETE"
                logoutPath="/users/sign_out.json"
                registerMethod="POST"
                registerPath="/users.json"></polymer-devise>
<script src="script.js"><script>
```

### currentUser()

```javascript
// script.js
var devise = document.getElementById('devise');

devise.currentUser().then(function (user) {
  // User was logged in, or Devise returned
  // previously authenticated session.
  console.log(user); // => {id: 1, ect: '...'}
}, function(error) {
  // unauthenticated error
});
```

### isAuthenticated()

```javascript
// script.js
var devise = document.getElementById('devise');

console.log(devise.isAuthenticated()); // => false

// Log in user...

console.log(devise.isAuthenticated()); // => true
```

### login(creds)

```javascript
// script.js
var devise = document.getElementById('devise');

var credentials = {
  email: 'user@domain.com',
  password: 'password1'
};

Auth.login(credentials).then(function(user) {
  console.log(user); // => {id: 1, ect: '...'}
}, function(error) {
  // Authentication failed...
});

$scope.$on('devise:login', function(event, currentUser) {
  // after a login, a hard refresh, a new tab
});

$scope.$on('devise:new-session', function(event, currentUser) {
  // user logged in by Auth.login({...})
});
```

### logout()

```javascript
// script.js
var devise = document.getElementById('devise');

// Log in user...
// ...
Auth.logout().then(function(oldUser) {
  // alert(oldUser.name + "you're signed out now.");
}, function(error) {
  // An error occurred logging out.
});

$scope.$on('devise:logout', function(event, oldCurrentUser) {
  // ...
});
```

### parse(response)

```javascript
// script.js
var devise = document.getElementById('devise');

// Customize user parsing
// NOTE: **MUST** return a truth-y expression
AuthProvider.parse(function(response) {
    return response.data.user;
});
```

### register(creds)

```javascript
// script.js
var devise = document.getElementById('devise');

var credentials = {
  email: 'user@domain.com',
  password: 'password1',
  password_confirmation: 'password1'
};

Auth.register(credentials).then(function(registeredUser) {
  console.log(registeredUser); // => {id: 1, ect: '...'}
}, function(error) {
  // Registration failed...
});

$scope.$on('devise:new-registration', function(event, user) {
  // ...
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
