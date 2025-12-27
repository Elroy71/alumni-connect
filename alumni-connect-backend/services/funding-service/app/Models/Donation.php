<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'donor_id',
        'amount',
        'message',
        'payment_status',
        'payment_method',
        'transaction_id',
        'donated_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'donated_at' => 'datetime',
    ];

    public $timestamps = false;

    /**
     * Get the campaign this donation belongs to
     */
    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($donation) {
            if ($donation->payment_status === 'success') {
                $donation->campaign->updateCurrentAmount();
                $donation->campaign->checkCompletion();
            }
        });

        static::updated(function ($donation) {
            if ($donation->isDirty('payment_status') && $donation->payment_status === 'success') {
                $donation->campaign->updateCurrentAmount();
                $donation->campaign->checkCompletion();
            }
        });
    }

    /**
     * Generate unique transaction ID
     */
    public static function generateTransactionId(): string
    {
        return 'TRX-' . strtoupper(uniqid()) . '-' . time();
    }
}
