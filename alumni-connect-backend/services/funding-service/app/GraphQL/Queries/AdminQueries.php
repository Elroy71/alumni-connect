<?php

namespace App\GraphQL\Queries;

use App\Models\Campaign;

class AdminQueries
{
    /**
     * Get all campaigns pending approval
     */
    public function pendingCampaigns($root, array $args, $context)
    {
        // Note: In production, you should check if user is admin here
        // For now, we rely on @guard directive and admin check in middleware
        
        return Campaign::where('status', 'pending_approval')
            ->with(['donations', 'updates'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
