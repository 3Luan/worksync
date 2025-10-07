$(document).ready(function () {
    const STATUS_ACTIVE = 1;
    const STATUS_INACTIVE = 1;
    const ROLE_ADMIN = 0;
    const ROLE_STAFF = 1;

    // Function to update staff count on the interface
    function updateStaffCount(count, elementId) {
        $("#" + elementId).text(count);
    }

    // Function to get staff status count and update on the interface
    function getStaffStatusCount(status, elementIds) {
        $.ajax({
            url: `/api/admin/user/userslist/${status}`,
            method: "GET",
            success: function (response) {
                // Update total users count
                updateStaffCount(response.users.length, elementIds.totalUsers);

                var today = moment().format("YYYY-MM-DD");

                // Filter users who checked in and checked out today
                var checkinTodayUsers = response.users.filter((user) =>
                    user.time_cards.some(
                        (card) =>
                            card.checkin !== null &&
                            moment(card.date).format("YYYY-MM-DD") === today
                    )
                ).length;

                var checkoutTodayUsers = response.users.filter((user) =>
                    user.time_cards.some(
                        (card) =>
                            card.checkout !== null &&
                            moment(card.date).format("YYYY-MM-DD") === today
                    )
                ).length;

                // Update check-in and check-out today users count
                updateStaffCount(
                    checkinTodayUsers,
                    elementIds.checkinTodayUsers
                );
                updateStaffCount(
                    checkoutTodayUsers,
                    elementIds.checkoutTodayUsers
                );

                // Calculate not check-out today users
                var notCheckoutToday = checkinTodayUsers - checkoutTodayUsers;
                updateStaffCount(
                    notCheckoutToday,
                    elementIds.notCheckoutTodayUsers
                );
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", error);
            },
        });
    }

    // Element IDs for updating staff count
    var elementIds = {
        totalUsers: "totalUsersCount",
        checkinTodayUsers: "checkinTodayUsersCount",
        checkoutTodayUsers: "checkoutTodayUsersCount",
        notCheckoutTodayUsers: "notCheckoutTodayUsersCount",
    };

    getStaffStatusCount(STATUS_ACTIVE, elementIds);

    // Function to convert role code to role string
    function getUserRoleString(role) {
        switch (role) {
            case ROLE_ADMIN:
                return "Admin";
            case ROLE_STAFF:
                return "Staff";
            default:
                return "Unknown";
        }
    }

    // Function to get users and display them on the interface
    function getUsers(status) {
        $.ajax({
            url: `/api/admin/user/userslist/${status}`,
            method: "GET",
            success: function (response) {
                var users = response.users;
                var html = "";
                var today = moment().format("YYYY-MM-DD");
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    var hasTimeCardToday = false;
                    var checkinTime = "";
                    var checkoutTime = "";
                    if (user.time_cards && user.time_cards.length > 0) {
                        user.time_cards.forEach(function (timeCard) {
                            if (
                                moment(timeCard.date).format("YYYY-MM-DD") ===
                                today
                            ) {
                                hasTimeCardToday = true;
                                checkinTime = timeCard.checkin
                                    ? moment(
                                          timeCard.checkin,
                                          "HH:mm:ss"
                                      ).format("HH:mm")
                                    : "";
                                checkoutTime = timeCard.checkout
                                    ? moment(
                                          timeCard.checkout,
                                          "HH:mm:ss"
                                      ).format("HH:mm")
                                    : "";
                            }
                        });
                    }
                    var isCheckedin = hasTimeCardToday && checkinTime;
                    var isCheckedOut = hasTimeCardToday && checkoutTime;
                    var cardClass = isCheckedOut
                        ? "employee-card checked-out"
                        : isCheckedin
                        ? "employee-card checked-in"
                        : "employee-card";
                    html += `<div class="col-xxxl-2 col-xl-3 col-lg-4 col-md-4 col-6">
                                <div class="${cardClass}">
                                    <h5 class="mb-0">${user.last_name} ${
                        user.first_name
                    }</h5>
                                    <p class="mb-0">Role: ${getUserRoleString(
                                        user.role
                                    )}</p>
                                    <p class="mt-0">
                                        ${
                                            hasTimeCardToday
                                                ? `Checkin: ${checkinTime}${
                                                      checkoutTime
                                                          ? `, Checkout: ${checkoutTime}`
                                                          : ""
                                                  }`
                                                : "Checkin"
                                        }
                                        ${
                                            isCheckedin
                                                ? ""
                                                : ` <i class="fas fa-times-circle text-danger"></i>`
                                        }
                                    </p>
                                </div>
                            </div>`;
                }
                $(".stafflisst .row").html(html);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", error);
            },
        });
    }

    getUsers(STATUS_ACTIVE);
});
