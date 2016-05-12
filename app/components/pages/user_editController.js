angular
    .module('altairApp')
    .controller('user_editCtrl', [
        '$rootScope',
        '$scope',
        'user_data',
        '$stateParams',
        '$http',
        function($rootScope, $scope, user_data, $stateParams, $http) {
            console.dir($stateParams.account_id);

            $scope.user_data = user_data;
            // languages
            $scope.Update = function(item, valid) {
                delete item.installation;
                delete item.plan;
                delete item.planType;
                //item.status = $scope.selectedOption;
                $http.post(baseurl + '/newcustomerapplication/' + item.applicationId, item).
                then(function(response) {
                    UIkit.notify("Customer Updated successfully!", { status: 'success', pos: 'bottom-right', timeout: 5000 });
                    window.open('#/customer', "_self");
                }, function(response) {});
            };
            // submit button
            // $('#user_edit_submit').on('click', function(e) {
            //     e.preventDefault();
            //     var data = JSON.stringify($scope.user_data, null, 2),
            //         user_name = user_data[0].name;

            //     UIkit.modal.alert('<p>Data for ' + user_name + ':</p><pre>' + data + '</pre>');
            // })

        }
    ]);
