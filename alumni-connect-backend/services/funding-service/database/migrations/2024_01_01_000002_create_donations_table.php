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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
            $table->string('donor_id'); // From Identity Service
            $table->decimal('amount', 15, 2);
            $table->text('message')->nullable();
            $table->enum('payment_status', ['pending', 'success', 'failed'])->default('success');
            $table->string('payment_method', 50)->nullable();
            $table->string('transaction_id')->nullable()->unique();
            $table->timestamp('donated_at')->useCurrent();
            
            $table->index('campaign_id');
            $table->index('donor_id');
            $table->index('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
