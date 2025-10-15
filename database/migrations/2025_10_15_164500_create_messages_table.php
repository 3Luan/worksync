<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('messages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('parent_message_id')->nullable()->constrained('messages');
            $table->foreignId('forward_from_id')->nullable()->constrained('messages');
            $table->text('content')->nullable();
            $table->enum('type', ['text','image','video','file','audio','system'])->default('text');
            $table->json('metadata')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_recalled')->default(false);
            $table->boolean('is_deleted_for_all')->default(false);
            $table->enum('status', ['sending','sent','delivered','seen','failed'])->default('sent');
            $table->timestamps();
            $table->softDeletes();
            $table->index(['conversation_id', 'created_at']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('messages');
    }
};
