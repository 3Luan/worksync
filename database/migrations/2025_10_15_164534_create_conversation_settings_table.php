<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('conversation_settings', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
      $table->string('theme_color', 20)->nullable();
      $table->string('default_emoji', 10)->nullable();
      $table->boolean('allow_reactions')->default(true);
      $table->boolean('allow_mentions')->default(true);
      $table->boolean('allow_media')->default(true);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('conversation_settings');
  }
};
