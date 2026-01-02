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
        return Campaign::where('status', 'pending_approval')
            ->with(['donations', 'updates'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get all approved/active campaigns
     */
    public function approvedCampaigns($root, array $args, $context)
    {
        return Campaign::whereIn('status', ['active', 'completed'])
            ->whereNotNull('approved_at')
            ->with(['donations', 'updates'])
            ->orderBy('approved_at', 'desc')
            ->get();
    }

    /**
     * Get all rejected campaigns
     */
    public function rejectedCampaigns($root, array $args, $context)
    {
        return Campaign::where('status', 'rejected')
            ->with(['donations', 'updates'])
            ->orderBy('rejected_at', 'desc')
            ->get();
    }

    /**
     * Get all campaign history (approved and rejected)
     */
    public function campaignHistory($root, array $args, $context)
    {
        return Campaign::where(function($query) {
                $query->whereIn('status', ['active', 'completed'])
                      ->orWhere('status', 'rejected');
            })
            ->with(['donations', 'updates'])
            ->orderBy('updated_at', 'desc')
            ->get();
    }
}
