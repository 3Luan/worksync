<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('conversations', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('key')->unique(); // Unique identifier for the conversation
      $table->tinyInteger('type')->default(0); // 0: direct, 1: group, 2: channel
      $table->string('name')->nullable();
      $table->string('avatar')->nullable();
      $table->string('description')->nullable();
      $table->foreignId('created_by')->constrained('users');
      $table->boolean('is_archived')->default(false);
      $table->softDeletes();
      $table->timestamps();
    });
  }
  public function down(): void
  {
    Schema::dropIfExists('conversations');
  }
};
