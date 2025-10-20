<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    if (!Schema::hasColumn('messages', 'parent_message_id')) {
      Schema::table('messages', function (Blueprint $table) {
        $table->unsignedBigInteger('parent_message_id')
          ->nullable()
          ->after('conversation_id');
      });
    }
    if (!Schema::hasColumn('messages', 'forward_from_id')) {
      Schema::table('messages', function (Blueprint $table) {
        $table->unsignedBigInteger('forward_from_id')
          ->nullable()
          ->after('parent_message_id');
      });
    }

    Schema::table('messages', function (Blueprint $table) {
      $table->foreign('parent_message_id')
        ->references('id')
        ->on('messages')
        ->nullOnDelete();

      $table->foreign('forward_from_id')
        ->references('id')
        ->on('messages')
        ->nullOnDelete();
    });
  }

  public function down(): void
  {
    Schema::table('messages', function (Blueprint $table) {
      if (Schema::hasColumn('messages', 'parent_message_id')) {
        $table->dropForeign(['parent_message_id']);
        $table->dropColumn('parent_message_id');
      }
      if (Schema::hasColumn('messages', 'forward_from_id')) {
        $table->dropForeign(['forward_from_id']);
        $table->dropColumn('forward_from_id');
      }
    });
  }
};
