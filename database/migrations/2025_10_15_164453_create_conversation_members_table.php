<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('conversation_members', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
      $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
      $table->tinyInteger('role')->default(1); // 0: admin, 1: member
      $table->foreignId('last_read_message_id')->nullable()->constrained('messages');
      $table->timestamp('joined_at')->useCurrent();
      $table->timestamp('muted_until')->nullable();
      $table->tinyInteger('notification_pref')->default(0); // 0: all, 1: mentions, 2: none
      $table->boolean('is_deleted')->default(false);
      $table->timestamp('deleted_at')->nullable();
      $table->index(['conversation_id', 'user_id']);
      $table->timestamps();
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('conversation_members');
  }
};
