<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('devices', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
      $table->string('device_id', 100);
      $table->tinyInteger('platform')->default(0); // 0: web, 1: ios, 2: android
      $table->string('push_token', 255)->nullable();
      $table->timestamp('last_sync')->nullable();
      $table->timestamps();
      $table->unique(['user_id', 'device_id']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('devices');
  }
};
