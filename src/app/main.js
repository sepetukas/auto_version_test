require("babel-polyfill");

const jquery = require("jquery");
const angular = require("angular");

const core = require("core");

const users = require("./users");
const userList = require("./users/list");
const userDetails = require("./users/details");
const login = require("./login");

window.jQuery = window.$ = jquery;

let dependencies = [
    core,
    login,
    users,
    userList,
    userDetails
];

angular.module("app", dependencies);

/*global document:true*/
angular.bootstrap(document, ["app"], {strictDi: true});
