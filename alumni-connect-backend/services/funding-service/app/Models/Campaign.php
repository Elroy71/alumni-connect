<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'target_amount',
        'current_amount',
        'start_date',
        'end_date',
        'category',
        'status',
        'image_url',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get all donations for this campaign
     */
    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    /**
     * Get all updates for this campaign
     */
    public function updates()
    {
        return $this->hasMany(CampaignUpdate::class);
    }

    /**
     * Calculate funding progress percentage
     */
    public function getProgressAttribute(): float
    {
        if ($this->target_amount <= 0) {
            return 0;
        }
        
        $progress = ($this->current_amount / $this->target_amount) * 100;
        return min($progress, 100); // Cap at 100%
    }

    /**
     * Update current amount based on donations
     */
    public function updateCurrentAmount(): void
    {
        $this->current_amount = $this->donations()
            ->where('payment_status', 'success')
            ->sum('amount');
        $this->save();
    }

    /**
     * Check if campaign is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if campaign has ended
     */
    public function hasEnded(): bool
    {
        if (!$this->end_date) {
            return false;
        }

        return now()->isAfter($this->end_date);
    }

    /**
     * Auto-complete campaign if target is reached
     */
    public function checkCompletion(): void
    {
        if ($this->current_amount >= $this->target_amount && $this->status === 'active') {
            $this->status = 'completed';
            $this->save();
        }
    }
}
