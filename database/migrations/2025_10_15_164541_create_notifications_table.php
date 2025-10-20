<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('notifications', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
      $table->tinyInteger('type')->default(0); // 0: message, 1: mention, 2: reaction, 3: system
      $table->unsignedBigInteger('reference_id')->nullable();
      $table->string('content', 255)->nullable();
      $table->boolean('is_read')->default(false);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('notifications');
  }
};
