var app = angular.module("myApp", ["firebase"]);
var database = firebase.database();
getUser().then(function(result) {
    console.log(result.displayName);
}, function(err) {
    console.log(err);
    window.location = "/classroom/login.html"; // Error: "It broke"
});
//if (getUser() == null) window.location = "/login.html";

app.controller("myCtrl", function($scope, $firebaseArray) {
    var ref = firebase.database().ref().child('class/common/posts').limitToLast(20).orderByChild("sortDate");
    // download the data into a local object
    $scope.posts = $firebaseArray(ref);
    getUser().then(function(result) {
        $scope.uid = result.uid;
    }, function(err) {
        console.log(err);
        window.location = "/classroom/login.html"; // Error: "It broke"
    });

});

function getUser() {
    return new Promise(function(resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                console.log(user.displayName);
                resolve(user);
            } else {
                // No user is signed in.
                reject(Error("It broke"));
            }
        });

    });

}

function newPost() {
    getUser().then(function(result) {
        createPost(result);
    }, function(err) {
        console.log(err);
        toast("User not logged in!");
    });
}

function heart(heart) {
    getUser().then(function(result) {
        toggleHeart(heart.dataset.postId, result.uid);
    }, function(err) {
        console.log(err);
        toast("User not logged in!");
    });
}

function toggleHeart(postId, uid) {
    firebase.database().ref('class/common/posts/' + postId).transaction(function(post) {
        if (post) {
            if (post.hearts && post.hearts[uid]) {
                post.heartCount--;
                post.hearts[uid] = null;
            } else {
                post.heartCount++;
                if (!post.hearts) {
                    post.hearts = {};
                }
                post.hearts[uid] = true;
            }
        }
        return post;
    });
}

function createPost(currentUser) {
    console.log(currentUser.displayName);
    if (currentUser != null) {
        if (document.getElementById("newPost").value.trim() !== '') {
            var newMessageRef = firebase.database().ref('class/common/posts').push();
            newMessageRef.set({
                'message': document.getElementById("newPost").value,
                'user': {
                    'name': currentUser.displayName,
                    'img': currentUser.photoURL
                },
                'heartCount': 0,
                'id': newMessageRef.key,
                'createdDate': Date.now() + 0,
                'sortDate': 0 - Date.now()
            }).then(function() {
                document.getElementById("newPost").value = "";
                toast("Posted!")
            });
        } else {
            toast("Type something!");
        }
    } else {
        toast("User not logged in!");
    }
}

function toast(x) {
    'use strict';
    var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = { message: x };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}