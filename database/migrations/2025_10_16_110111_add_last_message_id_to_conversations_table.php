<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::table('conversations', function (Blueprint $table) {
      if (!Schema::hasColumn('conversations', 'last_message_id')) {
        $table->unsignedBigInteger('last_message_id')
          ->nullable()
          ->after('created_by');
      }

      $table->foreign('last_message_id')
        ->references('id')
        ->on('messages')
        ->nullOnDelete();
    });
  }

  public function down(): void
  {
    Schema::table('conversations', function (Blueprint $table) {
      if (Schema::hasColumn('conversations', 'last_message_id')) {
        $table->dropForeign(['last_message_id']);
        $table->dropColumn('last_message_id');
      }
    });
  }
};
