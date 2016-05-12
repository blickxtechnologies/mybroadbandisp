angular
    .module('altairApp')
    .controller('customerCtrl',
        function($compile, $scope, $timeout, $http, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
            var vm = this;
            vm.dt_data = [];
            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withDisplayLength(10)
                .withOption('initComplete', function() {
                    $timeout(function() {
                        $compile($('.dt-uikit .md-input'))($scope);
                    });
                });
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5)
            ];

            $scope.isOneContactRequired = function(applicant_name, applicant_number) {
                if ((applicant_name === undefined || applicant_name === "") && (applicant_number === undefined || applicant_number === ""))
                    return false;
                return true;
            };

            $scope.handleEnter = function(keyEvent, applicant_name, applicant_number) {
                if (keyEvent.which === 13) {
                    $scope.Search(applicant_name, applicant_number);
                }
            };
            $scope.Search = function(applicant_name, applicant_number) {
                if ($scope.isOneContactRequired(applicant_name, applicant_number)) {
                    var query_string = "";
                    if ((applicant_name === undefined || applicant_name === ""))
                        query_string = '{"applicationNumber":{"contains":' + '"' + applicant_number + '"' + '}';
                    else
                        query_string = '{"applicantName":{"contains":' + '"' + applicant_name + '"' + '}';

                    $http.get(baseurl + '/newcustomerapplication?where=' + query_string).
                    then(function(response) {
                        if (response.data.length > 0) {
                            $scope.customer = response.data;
                            for (var i = 0; i < $scope.customer.length; i++) {
                                if ($scope.customer[i].status === 1)
                                    $scope.customer[i].status = 'New';
                                else if ($scope.customer[i].status === 2)
                                    $scope.customer[i].status = 'Verified';
                                else if ($scope.customer[i].status === 3)
                                    $scope.customer[i].status = 'Installed';
                                else
                                    $scope.customer[i].status = 'Activated';
                            }

                        } else {
                            alertify.error("no search results found");
                        }

                    }, function(response) {});
                } else {
                    alertify.error("Atleast one search criteria required!");
                }
            };
            $scope.verified = function(item, confirm_msg) {
                UIkit.modal.confirm(confirm_msg, function() {
                    $http.post(baseurl + '/newcustomerapplication/update/' + item.applicationId, {
                        status: 2
                    }).
                    then(function(response) {
                        UIkit.notify("Customer Verified successfully!", { status: 'success', pos: 'bottom-right' })
                        item.status = "Verified";
                    }, function(response) {});
                });
            };
            $scope.installed = function(item, confirm_msg) {
                UIkit.modal.confirm(confirm_msg, function() {
                    $http.post(baseurl + '/newcustomerapplication/update/' + item.applicationId, {
                        status: 3
                    }).
                    then(function(response) {
                        UIkit.notify("Customer Connection Installed successfully!", { status: 'success', pos: 'bottom-right' })
                        item.status = "Installed";
                    }, function(response) {});
                });
            };
            $scope.activated = function(item, confirm_msg) {
                UIkit.modal.confirm(confirm_msg, function() {
                    $http.post(baseurl + '/newcustomerapplication/update/' + item.applicationId, {
                        status: 4
                    }).
                    then(function(response) {
                        UIkit.notify("Customer Activated successfully!", { status: 'success', pos: 'bottom-right' })
                        item.status = "Activated";
                    }, function(response) {});
                });
            };
        }
    );
