<?php

namespace App\GraphQL\Mutations;

use App\Models\Campaign;
use GraphQL\Error\Error;

class AdminMutations
{
    /**
     * Approve a campaign
     */
    public function approveCampaign($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');
        $campaign = Campaign::findOrFail($args['id']);

        // Check if campaign is pending approval
        if ($campaign->status !== 'pending_approval') {
            throw new Error('Campaign is not pending approval');
        }

        // Update campaign status
        $campaign->update([
            'status' => 'active',
            'approved_by' => $userId,
            'approved_at' => now(),
            'rejected_by' => null,
            'rejected_at' => null,
            'rejection_reason' => null,
        ]);

        return $campaign->load(['donations', 'updates']);
    }

    /**
     * Reject a campaign
     */
    public function rejectCampaign($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');
        $campaign = Campaign::findOrFail($args['id']);

        // Check if campaign is pending approval
        if ($campaign->status !== 'pending_approval') {
            throw new Error('Campaign is not pending approval');
        }

        // Update campaign status
        $campaign->update([
            'status' => 'rejected',
            'rejected_by' => $userId,
            'rejected_at' => now(),
            'rejection_reason' => $args['reason'],
            'approved_by' => null,
            'approved_at' => null,
        ]);

        return $campaign->load(['donations', 'updates']);
    }
}
