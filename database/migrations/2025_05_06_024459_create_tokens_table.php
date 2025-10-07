<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tokens', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('type')->unsigned()->comment('1: Reset password');
            $table->string('key');
            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id', 'fk_tokens_users1')
            ->references('id')
            ->on('users')
            ->onDelete('NO ACTION')
            ->onUpdate('NO ACTION');
            $table->timestamp('expired_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tokens', function (Blueprint $table) {
            $table->dropForeign('fk_tokens_users1');
        });
        Schema::dropIfExists('tokens');
    }
};
