<?php

namespace App\GraphQL\Queries;

use App\Models\Campaign;

class CampaignQueries
{
    /**
     * Get all campaigns with optional filters
     */
    public function campaigns($root, array $args)
    {
        $query = Campaign::query()->with(['donations', 'updates']);

        // Only show ACTIVE and COMPLETED campaigns to public (exclude pending_approval and rejected)
        $query->whereIn('status', ['active', 'completed']);

        // Filter by status (if explicitly requested)
        if (isset($args['status'])) {
            $query->where('status', $args['status']);
        }

        // Filter by category
        if (isset($args['category'])) {
            $query->where('category', $args['category']);
        }

        // Search in title and description
        if (isset($args['search']) && !empty($args['search'])) {
            $search = $args['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get campaigns created by current user
     */
    public function myCampaigns($root, array $args, $context)
    {
        $userId = $context->request()->get('userId');

        return Campaign::where('user_id', $userId)
            ->with(['donations', 'updates'])
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
