$(document).ready(function () {
    var csrfToken = $('meta[name="csrf-token"]').attr("content");

    // Initialize DataTable
    var table = $("#time-tracking-table").DataTable({
        dom: '<"container-fluid"<"row"<"col"l><"col"B><"col d-flex justify-content-end"f>>>rtip',
        columns: [
            { data: "formatted_date" },
            {
                data: "checkin",
                render: function (data, type, row) {
                    if (type === "display") {
                        return data
                            ? moment(data, "HH:mm:ss").format("HH:mm")
                            : "";
                    }
                    return data;
                },
            },
            {
                data: "checkout",
                render: function (data, type, row) {
                    if (type === "display") {
                        return data
                            ? moment(data, "HH:mm:ss").format("HH:mm")
                            : "";
                    }
                    return data;
                },
            },
            {
                data: "working_time_summary.total_break_time",
                render: function (data, type, row) {
                    return data ? data : "";
                },
            },
            {
                data: "working_time_summary.total_working_time",
                render: function (data, type, row) {
                    return data ? data : "";
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    return (
                        '<button class="btn btn-primary btn-sm show-details" data-toggle="modal" data-target="#exampleModalCenter" data-timecard-id="' +
                        row.id +
                        '">Details</button>'
                    );
                },
            },
        ],
    });

    // Resize table columns on window resize
    $(window)
        .on("resize", function () {
            if ($(window).width() < 600) {
                table.columns([3, 4]).visible(false);
            } else {
                table.columns([3, 4]).visible(true);
            }
        })
        .resize();

    // Show details modal when clicking "Details" button
    $(document).on("click", ".show-details", function () {
        var timeCardId = $(this).data("timecard-id");
        showDetails(timeCardId);
    });

    // Fetch data and populate the DataTable
    fetchTimeCards();

    // Function to fetch time cards data
    function fetchTimeCards() {
        $.ajax({
            url: "/api/getAll",
            method: "GET",
            success: function (response) {
                var data = response.timecards;
                table.rows.add(data).draw();
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", error);
                toastr.error("Failed to fetch data.");
            },
        });
    }

    // Function to get day from date
    function getDayOfWeek(dateString) {
        var date = moment(dateString);
        var dayOfWeek = date.format("dddd");
        return dayOfWeek;
    }

    // Function to show details modal
    function showDetails(timeCardId) {
        $.ajax({
            url: "/api/calendar/detail/" + timeCardId,
            method: "GET",
            success: function (response) {
                var timeCard = response.timecard;
                var breakTimes = response.breaktime;

                $(".modal-title").text("Details");
                var modalBodyHtml = '<div class="modal-body">';

                modalBodyHtml += '<div class="row">';
                modalBodyHtml +=
                    "<h5>Date: " +
                    (timeCard.formatted_date
                        ? getDayOfWeek(timeCard.date) +
                          ", " +
                          timeCard.formatted_date
                        : "") +
                    "</h5>";
                modalBodyHtml += "</div>";
                modalBodyHtml += "<hr>";
                modalBodyHtml += '<div class="d-flex align-items-center">';
                modalBodyHtml +=
                    '<p class="mb-1 mr-3">Check-in: ' +
                    (timeCard.checkin ? timeCard.checkin : "") +
                    "</p>";
                if (
                    timeCard.checkin &&
                    timeCard.checkout === null &&
                    (!breakTimes || breakTimes.length === 0) &&
                    moment(timeCard.date).isSame(moment(), "day")
                ) {
                    modalBodyHtml +=
                        '<a class="text-danger ml-10 delete-checkin-btn"  type="button" data-id="' +
                        timeCardId +
                        '"><i class="fas fa-trash"></i></a>';
                }
                modalBodyHtml += "</div>";

                modalBodyHtml += '<div class="d-flex align-items-center">';
                modalBodyHtml +=
                    '<p class="mb-1">Check-out: ' +
                    (timeCard.checkout ? timeCard.checkout : "") +
                    "</p>";
                if (
                    timeCard.checkout &&
                    moment(timeCard.date).isSame(moment(), "day")
                ) {
                    modalBodyHtml +=
                        '<a class="text-danger ml-10 delete-checkout-btn"  type="button" data-id="' +
                        timeCardId +
                        '"><i class="fas fa-trash"></i></a>';
                }
                modalBodyHtml += "</div>";

                modalBodyHtml +=
                    '<h6 class="mt-2">Total working time: ' +
                    timeCard.working_time_summary.total_working_time +
                    "</h6>";

                modalBodyHtml += "<hr>";

                modalBodyHtml += '<div class="d-flex justify-content-between">';
                modalBodyHtml += "<div>";
                modalBodyHtml +=
                    '<p class="mb-1">Late hours: ' +
                    (timeCard.late_hours ? timeCard.late_hours : "") +
                    "</p>";
                modalBodyHtml += "</div>";
                modalBodyHtml += "<div>";
                modalBodyHtml +=
                    '<p class="mb-1">Early hours: ' +
                    (timeCard.early_hours ? timeCard.early_hours : "") +
                    "</p>";
                modalBodyHtml += "</div>";
                modalBodyHtml += "<div>";
                modalBodyHtml +=
                    '<p class="mb-1">Overtime hours: ' +
                    (timeCard.overtime_hours ? timeCard.overtime_hours : "") +
                    "</p>";
                modalBodyHtml += "</div>";
                modalBodyHtml += "</div>";
                modalBodyHtml += "<hr>";

                if (Array.isArray(breakTimes) && breakTimes.length > 0) {
                    modalBodyHtml += '<h5 class="mb-1">Break Times: </h5>';
                    modalBodyHtml +=
                        '<h6 class="mb-5">Total: ' +
                        (timeCard.working_time_summary.total_break_time
                            ? timeCard.working_time_summary.total_break_time
                            : "") +
                        "</h6>";
                    modalBodyHtml += '<ul class="list-unstyled mb-0">';
                    breakTimes.forEach(function (breakTime) {
                        modalBodyHtml += "<li>";
                        modalBodyHtml +=
                            '<div class="d-flex align-items-center">';
                        modalBodyHtml +=
                            '<p class="mb-1 mr-3">Start: ' +
                            (breakTime.start_at ? breakTime.start_at : "") +
                            "</p>";
                        if (
                            breakTime.start_at &&
                            breakTime.end_at === null &&
                            moment(timeCard.date).isSame(moment(), "day")
                        ) {
                            modalBodyHtml +=
                                '<a class="text-danger ml-10 delete-startbreak-btn" type="button" data-id="' +
                                breakTime.id +
                                '" data-timecard-id="' +
                                timeCardId +
                                '"><i class="fas fa-trash"></i></a>';
                        }
                        modalBodyHtml += "</div>";
                        modalBodyHtml +=
                            '<div class="d-flex align-items-center">';
                        modalBodyHtml +=
                            '<p class="mb-1 mr-3">End: ' +
                            (breakTime.end_at ? breakTime.end_at : "") +
                            "</p>";
                        if (
                            breakTime.end_at &&
                            !timeCard.checkout &&
                            moment(timeCard.date).isSame(moment(), "day")
                        ) {
                            modalBodyHtml +=
                                '<a class="text-danger ml-10 delete-endbreak-btn"  type="button" data-id="' +
                                breakTime.id +
                                '" data-timecard-id="' +
                                timeCardId +
                                '"><i class="fas fa-trash"></i></a>';
                        }
                        modalBodyHtml += "</div>";
                        modalBodyHtml += "</li>";
                    });
                    modalBodyHtml += "</ul>";
                } else {
                    modalBodyHtml +=
                        '<p class="mb-0">No break times available.</p>';
                }

                modalBodyHtml += "</div>";

                $(".modal-body").html(modalBodyHtml);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching details:", error);
            },
        });
    }

    // Function to delete a record (check-in, check-out, start break, end break)
    function deleteRecord(endpoint, recordId, timeCardId, confirmationMessage) {
        if (confirm(confirmationMessage)) {
            $.ajax({
                url: endpoint + "/" + recordId + "/delete",
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                success: function (response) {
                    if (endpoint === "/api/checkin") {
                        window.location.reload();
                    } else {
                        showDetails(timeCardId);
                    }
                    toastr.success(response.message);
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                    var errorMessage =
                        xhr.responseJSON.error || "An error occurred.";
                    toastr.error(errorMessage);
                },
            });
        }
    }

    // Event handlers for deleting check-in, check-out, start break, and end break
    $(document).on("click", ".delete-checkin-btn", function () {
        var timeCardId = $(this).data("id");
        deleteRecord(
            "/api/checkin",
            timeCardId,
            timeCardId,
            "Are you sure you want to delete Check-in?"
        );
    });

    $(document).on("click", ".delete-checkout-btn", function () {
        var timeCardId = $(this).data("id");
        deleteRecord(
            "/api/checkout",
            timeCardId,
            timeCardId,
            "Are you sure you want to delete Check-out?"
        );
    });

    $(document).on("click", ".delete-startbreak-btn", function () {
        var breakTimeId = $(this).data("id");
        var timeCardId = $(this).data("timecard-id");
        deleteRecord(
            "/api/start-break",
            breakTimeId,
            timeCardId,
            "Are you sure you want to delete Start-break?"
        );
    });

    $(document).on("click", ".delete-endbreak-btn", function () {
        var breakTimeId = $(this).data("id");
        var timeCardId = $(this).data("timecard-id");
        deleteRecord(
            "/api/end-break",
            breakTimeId,
            timeCardId,
            "Are you sure you want to delete End-break?"
        );
    });
});
