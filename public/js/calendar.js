$(document).ready(function () {
    var table = $('#time-tracking-table').DataTable({
        dom: 'Bfrtip',
        buttons: [
            { extend: 'excel', className: 'btn btn-sm btn-primary' },
            { extend: 'pdf', className: 'btn btn-sm btn-primary' },
            { extend: 'print', className: 'btn btn-sm btn-primary' }
        ],
        columns: [{
            data: 'date'
        },
        {
            data: 'checkin'
        },
        {
            data: 'checkout'
        },
        {
            data: 'total_break_time'
        },
        {
            data: null,
            render: function (data, type, row) {
                return '<button class="btn btn-primary btn-sm show-details" data-toggle="modal" data-target="#exampleModalCenter" data-timecard-id="' + row.id + '">Details</button>';
            }
        }
        ]
    });


    $(document).on('click', '.show-details', function () {
        var timeCardId = $(this).data('timecard-id');
        showDetails(timeCardId);
    });

    function showDetails(timeCardId) {
        $.ajax({
            url: '/api/calendar/detail/' + timeCardId,
            method: 'GET',
            success: function (response) {
                var timeCard = response.timecard;
                var breakTimes = response.breaktime;

                $('.modal-title').text('Details');
                var modalBodyHtml = '<div class="modal-body">';

                modalBodyHtml += '<div class="row">';
                modalBodyHtml += '<h5>Date: ' + (timeCard.date ? timeCard.date : "") + '</h5>';
                modalBodyHtml += '</div>';
                modalBodyHtml += '<hr>';
                modalBodyHtml += '<div class="d-flex align-items-center">';
                modalBodyHtml += '<p class="mb-1 mr-3">Check-in: ' + (timeCard.checkin ? timeCard.checkin : "") + '</p>';
                if (timeCard.checkin && timeCard.checkout === null && (!breakTimes || breakTimes.length === 0) && moment(timeCard.date).isSame(moment(), 'day')) {
                    modalBodyHtml += '<a class="text-danger ml-10 delete-checkin-btn"  type="button" data-id="' + timeCardId + '"><i class="fas fa-trash"></i></a>';
                }
                modalBodyHtml += '</div>';

                modalBodyHtml += '<div class="d-flex align-items-center">';
                modalBodyHtml += '<p class="mb-1">Check-out: ' + (timeCard.checkout ? timeCard.checkout : "") + '</p>';
                if (timeCard.checkout && moment(timeCard.date).isSame(moment(), 'day')) {
                    modalBodyHtml += '<a class="text-danger ml-10 delete-checkout-btn"  type="button" data-id="' + timeCardId + '"><i class="fas fa-trash"></i></a>';
                }
                modalBodyHtml += '</div>';

                modalBodyHtml += '<hr>';

                modalBodyHtml += '<div class="d-flex justify-content-between">';
                modalBodyHtml += '<div>';
                modalBodyHtml += '<p class="mb-1">Late hours: ' + (timeCard.late_hours ? timeCard.late_hours : "") + '</p>';
                modalBodyHtml += '</div>';
                modalBodyHtml += '<div>';
                modalBodyHtml += '<p class="mb-1">Early hours: ' + (timeCard.early_hours ? timeCard.early_hours : "") + '</p>';
                modalBodyHtml += '</div>';
                modalBodyHtml += '<div>';
                modalBodyHtml += '<p class="mb-1">Overtime hours: ' + (timeCard.overtime_hours ? timeCard.overtime_hours : "") + '</p>';
                modalBodyHtml += '</div>';
                modalBodyHtml += '</div>';
                modalBodyHtml += '<hr>';

                if (Array.isArray(breakTimes) && breakTimes.length > 0) {
                    modalBodyHtml += '<h5 class="mb-1">Break Times: </h5>';
                    modalBodyHtml += '<h6 class="mb-1">Total:' + (timeCard.total_break_time ? timeCard.total_break_time : "") + '</h6>';
                    modalBodyHtml += '<ul class="list-unstyled mb-0">';
                    breakTimes.forEach(function (breakTime) {
                        modalBodyHtml += '<li>';
                        modalBodyHtml += '<div class="d-flex align-items-center">';
                        modalBodyHtml += '<p class="mb-1 mr-3">Start: ' + (breakTime.start_at ? breakTime.start_at : "") + '</p>';
                        if (breakTime.start_at && breakTime.end_at === null && moment(timeCard.date).isSame(moment(), 'day')) {
                            modalBodyHtml += '<a class="text-danger ml-10 delete-startbreak-btn" type="button" data-id="' + breakTime.id + '" data-timecard-id="' + timeCardId + '"><i class="fas fa-trash"></i></a>';
                        }
                        modalBodyHtml += '</div>';
                        modalBodyHtml += '<div class="d-flex align-items-center">';
                        modalBodyHtml += '<p class="mb-1 mr-3">End: ' + (breakTime.end_at ? breakTime.end_at : "") + '</p>';
                        if (breakTime.end_at && moment(timeCard.date).isSame(moment(), 'day')) {
                            modalBodyHtml += '<a class="text-danger ml-10 delete-endbreak-btn"  type="button" data-id="' + breakTime.id + '" data-timecard-id="' + timeCardId + '"><i class="fas fa-trash"></i></a>';
                        }
                        modalBodyHtml += '</div>';
                        modalBodyHtml += '</li>';
                    });
                    modalBodyHtml += '</ul>';
                } else {
                    modalBodyHtml += '<p class="mb-0">No break times available.</p>';
                }

                modalBodyHtml += '</div>';

                $('.modal-body').html(modalBodyHtml);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching details:', error);
            }
        });
    }




    $('.modal-body').on('click', '.delete-checkin-btn', function () {
        var timeCardId = $(this).data('id');
        deleteCheckin(timeCardId);
    });

    $('.modal-body').on('click', '.delete-checkout-btn', function () {
        var timeCardId = $(this).data('id');
        deleteCheckout(timeCardId);
    });

    $('.modal-body').on('click', '.delete-startbreak-btn', function () {
        var breakTimeId = $(this).data('id');
        var timeCardId = $(this).data('timecard-id');
        deleteStartBreak(breakTimeId, timeCardId);
    });

    $('.modal-body').on('click', '.delete-endbreak-btn', function () {
        var breakTimeId = $(this).data('id');
        var timeCardId = $(this).data('timecard-id');
        deleteEndBreak(breakTimeId, timeCardId);
    });

    var csrfToken = $('meta[name="csrf-token"]').attr('content');

    $.ajax({
        url: '/api/getAll',
        method: 'GET',
        success: function (response) {
            var data = response.timecards;
            table.rows.add(data).draw();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });


    function startLoading() {
        $('#overlay').show();
        $('#loading').show();
    }

    function stopLoading() {
        $('#overlay').hide();
        $('#loading').hide();
    }


    // delete checkin
    function deleteCheckin(timeCardId) {
        if (confirm("Are you sure you want to delete Check-in?")) {
            startLoading();
            $.ajax({
                url: '/api/checkin/' + timeCardId + '/delete',
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                success: function (response) {
                    window.location.reload();
                    toastr.success(response.message);
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting checkin:', error);
                    toastr.error(xhr.responseJSON.error);
                },
                complete: function () {
                    stopLoading();
                }
            });
        }
    }


    // delete checkout
    function deleteCheckout(timeCardId) {
        if (confirm("Are you sure you want to delete Check-out?")) {
            startLoading();
            $.ajax({
                url: '/api/checkout/' + timeCardId + '/delete',
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                success: function (response) {
                    showDetails(timeCardId);
                    toastr.success(response.message);
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting checkin:', error);
                    var errorMessage = xhr.responseJSON.error;
                    toastr.error(errorMessage);
                },
                complete: function () {
                    stopLoading();
                }
            });
        }
    }

    // delete start break
    function deleteStartBreak(breakTimeId, timeCardId) {
        if (confirm("Are you sure you want to delete Start-break?")) {
            startLoading();
            $.ajax({
                url: '/api/start-break/' + breakTimeId + '/delete',
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                success: function (response) {
                    showDetails(timeCardId);
                    toastr.success(response.message);
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting start break:', error);
                    var errorMessage = xhr.responseJSON.message;
                    toastr.error(errorMessage);
                    stopLoading();
                },
                complete: function () {
                    stopLoading();
                }
            });
        }
    }


    // delete endbreak
    function deleteEndBreak(breakTimeId, timeCardId) {
        if (confirm("Are you sure you want to delete End-break?")) {
            startLoading();
            $.ajax({
                url: '/api/end-break/' + breakTimeId + '/delete',
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                success: function (response) {
                    showDetails(timeCardId);
                    toastr.success(response.message);
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting checkin:', error);
                    var errorMessage = xhr.responseJSON.error;
                    toastr.error(errorMessage);
                },
                complete: function () {
                    stopLoading();
                }
            });
        }
    }


});

