

.factory('toastService', function($http){
  return {
    displayToast: function(callback){


      $mdToast.show({
        template: '<md-toast>' + $scope.toast + '</md-toast>',
        hideDelay: 2000,
        position: getToastPosition()
      })
      function getToastPosition() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

     }
   }
})
