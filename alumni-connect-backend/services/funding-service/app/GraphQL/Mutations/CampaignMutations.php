<?php

namespace App\GraphQL\Mutations;

use App\Models\Campaign;
use App\Models\CampaignUpdate;
use GraphQL\Error\Error;

class CampaignMutations
{
    /**
     * Create a new campaign
     */
    public function create($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');

        $campaign = Campaign::create([
            'user_id' => $userId,
            'title' => $args['title'],
            'description' => $args['description'] ?? null,
            'target_amount' => $args['targetAmount'],
            'start_date' => $args['startDate'] ?? now(),
            'end_date' => $args['endDate'] ?? null,
            'category' => $args['category'],
            'status' => 'pending_approval', // Require admin approval
            'image_url' => $args['imageUrl'] ?? null,
        ]);

        return $campaign->load(['donations', 'updates']);
    }

    /**
     * Update an existing campaign
     */
    public function update($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');
        $campaign = Campaign::findOrFail($args['id']);

        // Authorization check
        if ($campaign->user_id !== $userId) {
            throw new Error('Unauthorized: You can only update your own campaigns');
        }

        $updateData = array_filter([
            'title' => $args['title'] ?? null,
            'description' => $args['description'] ?? null,
            'target_amount' => $args['targetAmount'] ?? null,
            'start_date' => $args['startDate'] ?? null,
            'end_date' => $args['endDate'] ?? null,
            'category' => $args['category'] ?? null,
            'status' => $args['status'] ?? null,
            'image_url' => $args['imageUrl'] ?? null,
        ], function ($value) {
            return !is_null($value);
        });

        $campaign->update($updateData);

        return $campaign->load(['donations', 'updates']);
    }

    /**
     * Delete a campaign
     */
    public function delete($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');
        $campaign = Campaign::findOrFail($args['id']);

        // Authorization check
        if ($campaign->user_id !== $userId) {
            throw new Error('Unauthorized: You can only delete your own campaigns');
        }

        // Check if campaign has donations
        if ($campaign->donations()->where('payment_status', 'success')->count() > 0) {
            throw new Error('Cannot delete campaign with successful donations');
        }

        $campaign->delete();

        return true;
    }

    /**
     * Add an update to a campaign
     */
    public function addUpdate($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');
        $campaign = Campaign::findOrFail($args['campaignId']);

        // Authorization check
        if ($campaign->user_id !== $userId) {
            throw new Error('Unauthorized: You can only add updates to your own campaigns');
        }

        $update = CampaignUpdate::create([
            'campaign_id' => $args['campaignId'],
            'title' => $args['title'],
            'content' => $args['content'],
        ]);

        return $update;
    }
}
