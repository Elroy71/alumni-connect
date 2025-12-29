<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add pending_approval and rejected to the status enum
        // PostgreSQL requires dropping and recreating the enum type
        DB::statement("ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check");
        DB::statement("ALTER TABLE campaigns ALTER COLUMN status TYPE VARCHAR(50)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback needed
    }
};
