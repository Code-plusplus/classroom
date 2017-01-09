var app = angular.module("myApp", ["firebase"]);
var database = firebase.database();

app.controller("myCtrl", function($scope, $firebaseArray) {
    var ref = firebase.database().ref().child('class/common/posts').limitToLast(20).orderByChild("sortDate");
    // download the data into a local object
    $scope.posts = $firebaseArray(ref);

});

function newPost() {
    if (document.getElementById("newPost").value.trim() !== '') {
        console.log(document.getElementById("newPost").value);
        var newMessageRef = firebase.database().ref('class/common/posts').push();
        newMessageRef.set({
            'message': document.getElementById("newPost").value,
            'user': {
                'name': 'anikk',
                'img': "asd"
            },
            createdDate: Date.now() + 0,
            sortDate: 0 - Date.now()
        }).then(function() {
            document.getElementById("newPost").value = "";
            toast("Posted!")
        });
    } else {
        toast("Type something!")
    }
}

function toast(x) {
    'use strict';
    var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = { message: x };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}