<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Login Notification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border-radius:8px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">

                    <tr>
                        <td>
                            <h2 style="margin-top:0;color:#222;">
                                New Login Detected
                            </h2>

                            <p style="color:#444;font-size:14px;">
                                Hi {{ $user->name ?? $user->email }},
                            </p>

                            <p style="color:#444;font-size:14px;">
                                We detected a new login to your account.
                            </p>

                            <table width="100%" cellpadding="8" cellspacing="0"
                                   style="background:#f9fafb;border-radius:6px;margin:15px 0;">
                                <tr>
                                    <td style="font-size:13px;color:#555;">
                                        <strong>Time:</strong> {{ $loginAt }} ({{ config('app.timezone') }})
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size:13px;color:#555;">
                                        <strong>IP Address:</strong> {{ $ipAddress }}
                                    </td>
                                </tr>

                                @if($userAgent)
                                <tr>
                                    <td style="font-size:13px;color:#555;">
                                        <strong>Device:</strong> {{ $userAgent }}
                                    </td>
                                </tr>
                                @endif
                            </table>

                            <p style="color:#444;font-size:14px;">
                                If this was you, no further action is required.
                            </p>

                            <p style="color:#444;font-size:14px;">
                                If you do not recognize this activity, please reset your password immediately or contact our support team.
                            </p>

                            <div style="margin:25px 0;text-align:center;">
                                <a href="{{ url('/forgot-password') }}"
                                   style="background:#2563eb;color:#ffffff;padding:10px 20px;
                                          text-decoration:none;border-radius:6px;
                                          font-size:14px;display:inline-block;">
                                    Reset Password
                                </a>
                            </div>

                            <p style="color:#888;font-size:12px;">
                                For your security, we recommend using a strong and unique password.
                            </p>

                            <p style="color:#444;font-size:14px;margin-top:30px;">
                                Regards,<br>
                                <strong>{{ config('app.name') }}</strong>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
