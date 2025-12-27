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
        Schema::table('campaigns', function (Blueprint $table) {
            // Approval fields
            $table->string('approved_by')->nullable()->after('image_url');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->string('rejected_by')->nullable()->after('approved_at');
            $table->timestamp('rejected_at')->nullable()->after('rejected_by');
            $table->text('rejection_reason')->nullable()->after('rejected_at');
            
            // Add indexes
            $table->index('approved_by');
            $table->index('rejected_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropIndex(['approved_by']);
            $table->dropIndex(['rejected_by']);
            
            $table->dropColumn([
                'approved_by',
                'approved_at',
                'rejected_by',
                'rejected_at',
                'rejection_reason'
            ]);
        });
    }
};
