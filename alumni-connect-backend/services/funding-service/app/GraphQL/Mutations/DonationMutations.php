<?php

namespace App\GraphQL\Mutations;

use App\Models\Campaign;
use App\Models\Donation;
use GraphQL\Error\Error;

class DonationMutations
{
    /**
     * Make a donation to a campaign
     */
    public function donate($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');
        $campaign = Campaign::findOrFail($args['campaignId']);

        // Validate campaign is active
        if (!$campaign->isActive()) {
            throw new Error('Campaign is not active');
        }

        // Validate campaign hasn't ended
        if ($campaign->hasEnded()) {
            throw new Error('Campaign has ended');
        }

        // Create donation
        $donation = Donation::create([
            'campaign_id' => $args['campaignId'],
            'donor_id' => $userId,
            'amount' => $args['amount'],
            'message' => $args['message'] ?? null,
            'payment_status' => 'success', // Simplified - assume immediate success
            'payment_method' => $args['paymentMethod'] ?? 'online',
            'transaction_id' => Donation::generateTransactionId(),
            'donated_at' => now(),
        ]);

        return $donation->load('campaign');
    }
}
