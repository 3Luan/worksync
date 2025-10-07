$(document).ready(function () {
    // Retrieve CSRF token from meta tag
    var csrfToken = $('meta[name="csrf-token"]').attr("content");

    // Function to fetch users from the server based on status
    function getUsers(status) {
        $.ajax({
            url: "/api/admin/user/userslist/" + status,
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

    // Function to create a new user
    function createUser(userData) {
        if (confirm("Are you sure you want to create user?")) {
            $.ajax({
                url: "/api/admin/user/create",
                data: userData,
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                success: function (response) {
                    // Reset form and display success message
                    $("#addEmployeeForm")[0].reset();
                    toastr.success(response.message);
                    // Refresh user table
                    getUsers($('input[name="statusRadio"]:checked').val());
                },
                error: function (xhr, status, error) {
                    // Display error message if creation fails
                    var errorMessage = xhr.responseJSON
                        ? Object.values(xhr.responseJSON.errors)[0][0]
                        : "Failed to create user. Please try again later.";
                    toastr.error(errorMessage);
                    console.log(errorMessage);
                },
            });
        }
    }

    // Function to delete a user
    function deleteUser(userId) {
        if (confirm("Are you sure you want to delete user?")) {
            $.ajax({
                url: "/api/admin/user/" + userId + "/delete",
                type: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                success: function (response) {
                    // Display success message and refresh user table
                    toastr.success(response.message);
                    getUsers($('input[name="statusRadio"]:checked').val());
                },
                error: function (xhr, status, error) {
                    // Log error message if deletion fails
                    console.log(
                        "Error:",
                        xhr.responseJSON
                            ? xhr.responseJSON.error
                            : "Failed to delete user."
                    );
                },
            });
        }
    }

    // Function to update a user
    function updateUser(userId, userData) {
        if (confirm("Are you sure you want to update user?")) {
            $.ajax({
                url: "/api/admin/user/" + userId + "/update",
                method: "PUT",
                data: userData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                success: function (response) {
                    // Display success message and refresh user table
                    toastr.success(response.message);
                    getUsers($('input[name="statusRadio"]:checked').val());
                },
                error: function (xhr, status, error) {
                    // Display error message if update fails
                    var errorMessage = xhr.responseJSON
                        ? Object.values(xhr.responseJSON.errors)[0][0]
                        : "Failed to update user. Please try again later.";
                    toastr.error(errorMessage);
                    console.log(errorMessage);
                },
            });
        }
    }

    // Initialize DataTable and configure DOM
    var table = $("#userTable").DataTable({
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
                        '<a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="fas fa-pen"></i></a>' +
                        '<a  class="delete" data-toggle="modal" data-id="' +
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

    // Initial fetch of users with status 1
    getUsers(1);

    // Event handler for radio button status change
    $('input[name="statusRadio"]').on("change", function () {
        var status = $(this).val();
        getUsers(status);
    });

    // Event handler for submit button of addEmployeeForm
    $("#addEmployeeForm").submit(function (e) {
        e.preventDefault();
        // Extract form data for new user creation
        var userData = {
            code: $("#code").val(),
            last_name: $("#last_name").val(),
            first_name: $("#first_name").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            role: $("#role").val(),
            status: $("#status").val(),
        };
        console.log(userData);
        createUser(userData);
    });

    // Event handler for delete button in user table
    $("#userTable").on("click", ".delete", function () {
        var userId = $(this).data("id");
        // Call deleteUser function with user ID
        deleteUser(userId);
    });

    // Event handler for edit button in user table
    $("#userTable").on("click", ".edit", function () {
        var data = table.row($(this).closest("tr")).data();
        // Populate edit modal with user data
        $("#editEmployeeModal #user_id").val(data.id);
        $("#editEmployeeModal #edit_code").val(data.code);
        $("#editEmployeeModal #edit_last_name").val(data.last_name);
        $("#editEmployeeModal #edit_first_name").val(data.first_name);
        $("#editEmployeeModal #edit_email").val(data.email);
        $("#editEmployeeModal #edit_role").val(data.role);
        $("#editEmployeeModal #edit_status").val(data.status);
        // Show edit modal
        $("#editEmployeeModal").modal("show");
    });

    // Event handler for submit button of editEmployeeForm
    $("#editEmployeeForm").submit(function (e) {
        e.preventDefault();
        // Extract form data for user update
        var userId = $("#editEmployeeModal #user_id").val();
        var userData = {
            code: $("#editEmployeeModal #edit_code").val(),
            last_name: $("#editEmployeeModal #edit_last_name").val(),
            first_name: $("#editEmployeeModal #edit_first_name").val(),
            password: $("#editEmployeeModal #edit_password").val(),
            email: $("#editEmployeeModal #edit_email").val(),
            role: $("#editEmployeeModal #edit_role").val(),
            status: $("#editEmployeeModal #edit_status").val(),
        };
        // Call updateUser function with extracted data
        updateUser(userId, userData);
    });

    // Event handler for close and cancel buttons of edit modal
    $("#btnClose, #btnCancel").on("click", function () {
        $("#editEmployeeModal").modal("hide");
    });

    // Function to toggle password visibility
    function togglePasswordVisibility(passwordInput) {
        var isVisible = passwordInput.attr("type") === "text";

        if (isVisible) {
            passwordInput.attr("type", "password");
        } else {
            passwordInput.attr("type", "text");
        }
    }

    // Event handler for toggling password visibility in edit and create modals
    $("#updatePassword, #createPassword").click(function () {
        // Determine which password input is being toggled
        var passwordInput;
        if ($(this).attr("id") === "updatePassword") {
            passwordInput = $("#edit_password");
        } else {
            passwordInput = $("#password");
        }

        // Toggle password visibility
        togglePasswordVisibility(passwordInput);

        // Toggle eye icon class
        $(this).find("i").toggleClass("far fa-eye far fa-eye-slash");
    });
});
