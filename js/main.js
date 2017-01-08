var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope, $http) {
    $http.get('posts.json')
        .then(function(res) {
            $scope.posts = res.data;
        });
});