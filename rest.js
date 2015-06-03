app.controller('restController',['$scope','$http','$location','Upload','filterFilter',function($scope, $http,$location, Upload, filterFilter){
  $scope.current={};
  $scope.currentType="";
  $scope.items={};
  $scope.uploading=[];
  $scope.edit_mode=false;
  $scope.counter=0;

  $scope.method="GET";
  var str= window.location.pathname;
  var url = str.split("/");
  $scope.root= url[2];
  $scope.resid=null;
  $scope.resid = url[3];
  $scope.initRoute = function(){
      if($location.path()=="")
        $scope.get("/"+$scope.root);
      else
        $scope.get($location.path());  
  }
  $scope.$on('$locationChangeSuccess', function(event, next, current) {
      $scope.initRoute();
  });
  $scope.get = function(route){
    $scope.method="GET";
    $scope.action(route);
    if($location.path() != route)
      $location.path(route);
  };
  $scope.post = function(route){
    if($scope.edit_mode)
      $scope.put(route);
    else{
    $scope.method="POST";
    $scope.action(route);
  }
  };
  $scope.delete = function(route){
    $scope.method="DELETE";
    if(confirm("Are you sure you want to delete this?"))
      $scope.action(route);
  };
  $scope.put = function(route){
    $scope.method="PUT";
    if(confirm("Are you sure you want to update this?"))
      $scope.action(route);
  };
  $scope.action = function(route){
    if($scope.current.file && $scope.current.file.length){
      // Progressbar processing
      var index = $scope.uploading.length;
      $scope.uploading[index]={};
      $scope.uploading[index].title = $scope.current.title;


      Upload.upload({
          url: route,
          method: $scope.method,
          fields: $scope.current,
          file: $scope.current.file[0],
      }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          $scope.uploading[index].progress = progressPercentage;

      }).success(function (data, status, headers, config) {
          if($scope.method!='GET')
          $scope.initRoute();
        else
          $scope.items = data;
      });
    }
    else{
      $http({
      url:route,
      method: $scope.method,
      data: $scope.current,
      }).success(function(response){
        if($scope.method!='GET')
          $scope.initRoute();
        else
          $scope.items = response;
      });
    }
  };
  
  $scope.go = function ( path ) {
    window.location.href = path;
  };
  $scope.activate = function(obj, type){
    $scope.current = obj;
    $scope.currentType = type;
    $scope.edit_mode = true;
  };
  $scope.deactivate = function(obj){
    $scope.current = {};
    $scope.edit_mode = false;
  }
  //utility function to get an array of natural numbers till count
  $scope.getNumArray  =function(count){
    var i=1,x=[];

    while(x.push(i++)<count){}
      return x;
  }
 
}]);
