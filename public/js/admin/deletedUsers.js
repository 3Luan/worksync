$(document).ready(function () {
    // Retrieve CSRF token from meta tag
    var csrfToken = $('meta[name="csrf-token"]').attr("content");

    // Function to fetch users from the server based on status
    function getUsers() {
        $.ajax({
            url: "/api/admin/user/deletedusers",
            method: "GET",
            success: function (response) {
                var data = response.users;
                // Clear existing table data and add new data
                table.clear().rows.add(data).draw();
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", error);
            },
        });
    }

    // Initialize DataTable and configure DOM
    var table = $("#usersDeletedTable").DataTable({
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
            {
                data: null,
                render: function (data, type, full, meta) {
                    // Render edit and delete icons
                    return (
                        '<a class="detail" data-toggle="modal"><i class="far fa-eye"></i></a>' +
                        '<a class="restore" data-toggle="modal" data-id="' +
                        full.id +
                        '"><i class="fas fa-reply text-info"></i></a>' +
                        '<a class="delete" data-toggle="modal" data-id="' +
                        full.id +
                        '"><i class="fas fa-trash"></i></a>'
                    );
                },
            },
        ],
    });

    $(window)
        .on("resize", function () {
            if ($(window).width() < 600) {
                table.columns([2]).visible(false);
            } else {
                table.columns([2]).visible(true);
            }
        })
        .resize();
    getUsers();

    $("#usersDeletedTable").on("click", ".restore", function () {
        if (confirm("Are you sure you want to restore user?")) {
            var userId = $(this).data("id");
            restoreUser(userId);
        }
    });

    $("#usersDeletedTable").on("click", ".delete", function () {
        if (confirm("Are you sure you want to delete user?")) {
            var userId = $(this).data("id");
            forceDeleteUser(userId);
        }
    });
    $("#restoreButton").click(function () {
        if (confirm("Are you sure you want to restore user?")) {
            var userId = $("#infoEmployeeModal #user_id").val();
            restoreUser(userId);
        }
    });

    $("#deleteButton").click(function () {
        if (confirm("Are you sure you want to delete user?")) {
            var userId = $("#infoEmployeeModal #user_id").val();
            deleteUser(userId);
        }
    });

    function restoreUser(userId) {
        $.ajax({
            url: "/api/admin/user/" + userId + "/restore",
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
            success: function (response) {
                toastr.success(response.message);
                $("#infoEmployeeModal").modal("hide");
                getUsers();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    }

    function forceDeleteUser(userId) {
        $.ajax({
            url: "/api/admin/user/" + userId + "/force-delete",
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
            success: function (response) {
                toastr.success(response.message);
                $("#infoEmployeeModal").modal("hide");
                getUsers();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            },
        });
    }

    $("#usersDeletedTable").on("click", ".detail", function () {
        var data = table.row($(this).closest("tr")).data();
        // Populate edit modal with user data
        $("#infoEmployeeModal #user_id").val(data.id);
        $("#infoEmployeeModal #code").val(data.code);
        $("#infoEmployeeModal #last_name").val(data.last_name);
        $("#infoEmployeeModal #first_name").val(data.first_name);
        $("#infoEmployeeModal #email").val(data.email);
        var roleString = data.role === 0 ? "Admin" : "Staff";
        $("#infoEmployeeModal #role").val(roleString);
        // Show modal
        $("#infoEmployeeModal").modal("show");
    });

    // Event handler for close and cancel buttons of edit modal
    $("#btnClose, #btnCancel").on("click", function () {
        $("#infoEmployeeModal").modal("hide");
    });
});
