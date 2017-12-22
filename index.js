var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#show-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton
        .addEventListener('click', function () {
            dialog.showModal();
        });
    dialog
        .querySelector('.close')
        .addEventListener('click', function () {
            dialog.close();
        });
    $scope.results_loading = false;
    $scope.assignment_number = "Choose Assignment";
    $scope.result_status = "";
    $scope.result_description = "";
    $scope.all_files = [];
    var current_assignment = "";
    $('li').click(function () {
        if (current_assignment != $(this).text()) {
            $('#check_upload').show();
            $('#upload').hide();
            $('#files').hide();
        } else {
            $('#check_upload').hide();
            $('#upload').show();
            $('#files').show();

        }
        $scope.assignment_number = $(this).text();
        $scope.$apply()
    });
    $scope.check_uploads = function () {
        $scope.results_loading = true;
        var srn = $('#srn').val();
        var assignment_num = $scope.assignment_number;
        $http({
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
                url: "http://localhost:3000/check_uploads?srn=" + srn + "&assignment=" + assignment_num
            })
            .then(function (data) {
                //$scope.all_files = data.data;
                $("#srn_placeholder").val(srn);
                $("#assignment_placeholder").val(assignment_num);
                $('#check_upload').hide();
                $('#upload').show();
                current_assignment = $scope.assignment_number;
                $http({
                        method: "GET",
                        url: "http://localhost:3000/compile?srn=" + srn + "&assignment=" + assignment_num
                    }).then(function (results) {
                    $scope.all_files = results.data;
                    console.log($scope.all_files);
                    $('#files').show();
                    $scope.results_loading = false;
                })
            });
    };

    $scope.show_details = function (index) {
        $('#show-dialog').trigger('click');
        $scope.result_description = "";
        if ($scope.all_files[index].result == "Compiled") {
            $scope.result_status = "Success";
            $scope.result_description = "Your Program Compiled successfully!!";
        } else {
            $scope.result_status = "Oops!! There was an Error";
            $scope.result_description = $scope.all_files[index].result;
        }
    }
    $scope.remove_file = function (filename) {
        var srn = $('#srn').val();
        var assignment_num = $scope.assignment_number;
        $http({
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
                url: "http://localhost:3000/remove_file?srn=" + srn + "&assignment=" + assignment_num + "&file=" + filename
            })
            .then(function (data) {
                $scope.all_files = data.data;
            });
    }
});