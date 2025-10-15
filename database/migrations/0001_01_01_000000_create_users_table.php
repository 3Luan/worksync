<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('username', 255)->unique();
            $table->string('avatar', 255)->nullable();
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->tinyInteger('role')->default(1); // 0: admin, 1: user
            $table->tinyInteger('status')->default(1); // 0: inactive, 1: online, 2: offline
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
