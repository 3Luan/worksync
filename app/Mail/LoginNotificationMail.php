<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginNotificationMail extends Mailable
{
  use Queueable, SerializesModels;

  private User $user;
  private string $ipAddress;
  private ?string $userAgent;
  private string $loginAt;

  public function __construct(User $user, string $ipAddress, ?string $userAgent = null)
  {
    $this->user = $user;
    $this->ipAddress = $ipAddress;
    $this->userAgent = $userAgent;
    $this->loginAt = now()->setTimezone(config('app.timezone', 'UTC'))->format('Y-m-d H:i:s');
  }

  public function envelope(): Envelope
  {
    return new Envelope(
      subject: 'Login notification',
    );
  }

  public function content(): Content
  {
    return new Content(
      view: 'email.login_notification',
      with: [
        'user' => $this->user,
        'ipAddress' => $this->ipAddress,
        'userAgent' => $this->userAgent,
        'loginAt' => $this->loginAt,
      ],
    );
  }

  public function attachments(): array
  {
    return [];
  }
}
