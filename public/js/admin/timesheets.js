$(document).ready(function () {
    // Function to update month input to current month
    updateMonthInput();

    // Event listener for changing time input
    $("#timeInput").change(function () {
        var selectedDate = $("#timeInput").val();
        var month = selectedDate.split("-")[1];
        var year = selectedDate.split("-")[0];
        getUsers(month, year);
    });

    // Function to update month input and fetch users based on current month and year
    function updateMonthInput() {
        var currentMonth = moment().format("YYYY-MM");
        $("#timeInput").val(currentMonth);
        getUsers(moment().month() + 1, moment().year());
    }
    function updateMonthDetail(userId) {
        var selectedDate = $("#timeInput").val();
        $("#monthDetail").val(selectedDate);
        getDetailWithCurrentMonthYear(userId);
    }

    // Function to fetch users from the server based on month and year
    function getUsers(month, year) {
        $.ajax({
            url: `/api/admin/timesheets/working-days/${month}/${year}`,
            method: "GET",
            success: function (response) {
                var data = response.users;
                table.clear().rows.add(data).draw();
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", error);
            },
        });
    }

    // Initialize DataTable and configure DOM
    var table = $("#timesheetsTable").DataTable({
        dom: '<"container-fluid"<"row"<"col"l><"col"B><"col d-flex justify-content-end"f>>>rtip',
        columns: [
            { data: "code" },
            {
                data: null,
                render: function (data, type, full, meta) {
                    // Render full name
                    return full.last_name + " " + full.first_name;
                },
            },
            { data: "email" },
            { data: "total_working_days" },
            {
                data: null,
                render: function (data, type, full, meta) {
                    // Render detail link
                    return (
                        '<a href="#infoEmployeeModal" class="detail" data-id="' +
                        full.id +
                        ' data-toggle="modal"><i class="far fa-eye"></i></a>'
                    );
                },
            },
        ],
    });

    // Resize event listener to hide email column on small screens
    $(window)
        .on("resize", function () {
            if ($(window).width() < 600) {
                table.columns([2]).visible(false);
            } else {
                table.columns([2]).visible(true);
            }
        })
        .resize();

    // Detail

    // Function to fetch detail with current month and year
    function getDetailWithCurrentMonthYear(userId) {
        var selectedDate = $("#timeInput").val();
        var month = selectedDate.split("-")[1];
        var year = selectedDate.split("-")[0];
        getDetail(userId, month, year);
    }

    // Event listener for changing month detail
    $("#monthDetail").change(function () {
        var selectedDate = $("#monthDetail").val();
        var month = selectedDate.split("-")[1];
        var year = selectedDate.split("-")[0];
        var userId = $("#idDetail").val();
        getDetail(userId, month, year);
    });

    var table1 = $("#checkInOutBreakTable").DataTable({
        dom: '<"container-fluid"<"row"<"col-6"l><"col-6 d-flex justify-content-end"f>>>rtip',
        columns: [
            { data: "formatted_date" },
            { data: "checkin" },
            { data: "checkout" },
            { data: "start_break" },
            { data: "end_break" },
            { data: "working_hours" },
        ],
    });

    // Function to display working days data
    function displayWorkingDays(workingDays) {
        $("#totalWorkingDays").text(workingDays.total_working_days);
        $("#weekendDays").text(workingDays.weekend_days);
        $("#weekdayDays").text(workingDays.weekday_days);
    }

    // Function to fetch detail data from the server
    function getDetail(userId, month, year) {
        $.ajax({
            url: `/api/admin/timesheets/${userId}/${month}/${year}/detail`,
            method: "GET",
            success: function (response) {
                var data = response.check_in_out_break;
                table1.clear().rows.add(data).draw();

                displayWorkingDays(response.working_days);
                $("#infoEmployeeModal").modal("show");
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", error);
            },
        });
    }

    // Event listener for detail button click
    $("#timesheetsTable").on("click", ".detail", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#infoEmployeeModal #idDetail").val(data.id);
        $("#infoEmployeeModal #code").val(data.code);
        $("#infoEmployeeModal #name").val(
            data.last_name + " " + data.first_name
        );
        $("#infoEmployeeModal #email").val(data.email);
        var roleString = data.role === 0 ? "Admin" : "Staff";
        $("#infoEmployeeModal #role").val(roleString);
        updateMonthDetail(data.id);
    });

    // Event listener for close and cancel buttons
    $("#btnClose, #btnCancel").on("click", function () {
        $("#infoEmployeeModal").modal("hide");
    });

    // Function to copy input text
    $(".copyButton").click(function () {
        var inputId = $(this).data("input");
        var inputElement = $("#" + inputId);

        inputElement.select();
        inputElement[0].setSelectionRange(0, 99999);

        document.execCommand("copy");

        window.getSelection().removeAllRanges();

        alert("Copied the text: " + inputElement.val());
    });
});
