function formatDateTime(date) {
    return moment(date).format('dddd, DD/MM/YYYY');
}

// Update current date and time every second
setInterval(function () {
    const currentDate = new Date();
    const formattedDateTime = formatDateTime(currentDate);
    document.querySelector('.c-dashboard__date').textContent = formattedDateTime;

    // Update current time (hour and minute)
    const hourMinute = currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    document.querySelector('.c-dashboard__hour-minute').textContent = hourMinute;

    // Update current second
    const second = currentDate.getSeconds();
    document.querySelector('.c-dashboard__second').textContent = second;
}, 10);

// Function to handle check-in/check-out button click

var csrfToken = $('meta[name="csrf-token"]').attr('content');

function startLoading() {
    $('#overlay').show();
    $('#loading').show();
}

function stopLoading() {
    $('#overlay').hide();
    $('#loading').hide();
}

// Function to handle check-in process
function checkin() {
    startLoading(); // Display loading animation
    $.ajax({
        url: '/api/checkin',
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (response) {
            toastr.success(response.message);
            window.location.href = '/checkin';
        },
        error: function (xhr, status, errorThrown) {
            console.error('Check-in fail:', errorThrown);
            var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : 'Failed to check in. Please try again later.';
            toastr.error(errorMessage);
        },
        complete: function () {
            stopLoading(); // Stop loading animation
        }
    });
}

// Function to handle check-out process
function checkout() {
    startLoading(); // Display loading animation
    $.ajax({
        url: '/api/checkout',
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (response) {
            toastr.success(response.message);
            window.location.href = '/checkin';
        },
        error: function (xhr, status, errorThrown) {
            console.error('Check-out fail:', errorThrown);
            var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : 'Failed to check out. Please try again later.';
            toastr.error(errorMessage);
        },
        complete: function () {
            stopLoading(); // Stop loading animation
        }
    });
}

// Function to handle starting a break
function startBreak() {
    startLoading(); // Display loading animation
    $.ajax({
        url: '/api/start-break',
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        data: {},
        success: function (response) {
            toastr.success(response.message);
            window.location.href = '/checkin';
        },
        error: function (xhr, status, errorThrown) {
            console.error('Start-break fail:', errorThrown);
            var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : 'Failed to start break. Please try again later.';
            toastr.error(errorMessage);
        },
        complete: function () {
            stopLoading(); // Stop loading animation
        }
    });
}

// Function to handle ending a break
function endBreak() {
    startLoading(); // Display loading animation
    $.ajax({
        url: '/api/end-break',
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        success: function (response) {
            toastr.success(response.message);
            window.location.href = '/checkin';
        },
        error: function (xhr, status, errorThrown) {
            console.error('End-break fail:', errorThrown);
            var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : 'Failed to end break. Please try again later.';
            toastr.error(errorMessage);
        },
        complete: function () {
            stopLoading(); // Stop loading animation
        }
    });
}
