<?php

namespace App\GraphQL\Queries;

use App\Models\Donation;

class DonationQueries
{
    /**
     * Get donations made by current user
     */
    public function myDonations($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');

        return Donation::where('donor_id', $userId)
            ->with('campaign')
            ->orderBy('donated_at', 'desc')
            ->get();
    }

    /**
     * Get all donations for a specific campaign
     */
    public function campaignDonations($root, array $args)
    {
        return Donation::where('campaign_id', $args['campaignId'])
            ->where('payment_status', 'success')
            ->orderBy('donated_at', 'desc')
            ->get();
    }
}
