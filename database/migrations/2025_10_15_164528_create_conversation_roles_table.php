<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversation_roles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            $table->string('role_name', 50);
            $table->boolean('can_send_message')->default(true);
            $table->boolean('can_pin')->default(false);
            $table->boolean('can_invite')->default(false);
            $table->boolean('can_kick')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversation_roles');
    }
};
