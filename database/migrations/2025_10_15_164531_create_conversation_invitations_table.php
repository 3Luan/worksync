<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('conversation_invitations', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
      $table->foreignId('inviter_id')->constrained('users')->onDelete('cascade');
      $table->foreignId('invitee_id')->constrained('users')->onDelete('cascade');
      $table->tinyInteger('status')->default(0); // 0: pending, 1: accepted, 2: declined, 3: expired
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('conversation_invitations');
  }
};
