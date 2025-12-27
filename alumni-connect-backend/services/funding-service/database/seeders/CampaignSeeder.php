<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campaigns = [
            [
                'user_id' => 'user-1',
                'title' => 'Beasiswa Pendidikan untuk Anak Tidak Mampu',
                'description' => 'Program beasiswa penuh untuk mahasiswa berprestasi dari keluarga tidak mampu. Dana akan digunakan untuk biaya kuliah, buku, dan biaya hidup selama 4 tahun.',
                'target_amount' => 50000000,
                'current_amount' => 15000000,
                'start_date' => '2024-01-01',
                'end_date' => '2024-12-31',
                'category' => 'scholarship',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                'approved_by' => 'admin-1',
                'approved_at' => now()->subDays(10),
                'created_at' => now()->subDays(11),
                'updated_at' => now(),
            ],
            [
                'user_id' => 'user-2',
                'title' => 'Riset Teknologi AI untuk Pendidikan',
                'description' => 'Penelitian pengembangan sistem AI yang dapat membantu proses pembelajaran adaptif untuk setiap siswa. Hasil riset akan dipublikasikan dan dibuat open source.',
                'target_amount' => 30000000,
                'current_amount' => 8000000,
                'start_date' => '2024-02-01',
                'end_date' => '2024-11-30',
                'category' => 'research',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
                'approved_by' => 'admin-1',
                'approved_at' => now()->subDays(8),
                'created_at' => now()->subDays(9),
                'updated_at' => now(),
            ],
            [
                'user_id' => 'user-1',
                'title' => 'Alumni Gathering 2024: Reconnect & Network',
                'description' => 'Acara tahunan alumni untuk mempererat silaturahmi, berbagi pengalaman, dan membangun network profesional. Akan ada talkshow dari alumni sukses dan networking session.',
                'target_amount' => 20000000,
                'current_amount' => 18000000,
                'start_date' => '2024-03-01',
                'end_date' => '2024-06-30',
                'category' => 'event',
                'status' => 'active',
                'image_url' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
                'approved_by' => 'admin-1',
                'approved_at' => now()->subDays(5),
                'created_at' => now()->subDays(6),
                'updated_at' => now(),
            ],
            [
                'user_id' => 'user-3',
                'title' => 'Renovasi Laboratorium Komputer',
                'description' => 'Pembaruan fasilitas laboratorium komputer dengan perangkat modern untuk mendukung pembelajaran programming dan data science.',
                'target_amount' => 75000000,
                'current_amount' => 0,
                'start_date' => '2024-01-15',
                'end_date' => '2024-12-15',
                'category' => 'infrastructure',
                'status' => 'pending_approval',  // Pending approval
                'image_url' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'user_id' => 'user-4',
                'title' => 'Bantuan Dana Pendidikan Mahasiswa Rantau',
                'description' => 'Program bantuan biaya hidup untuk mahasiswa perantauan yang kesulitan finansial namun berprestasi akademik.',
                'target_amount' => 25000000,
                'current_amount' => 0,
                'start_date' => '2024-02-01',
                'end_date' => '2024-12-31',
                'category' => 'scholarship',
                'status' => 'pending_approval',  // Pending approval
                'image_url' => 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'user_id' => 'user-2',
                'title' => 'Program Mentoring Alumni untuk Mahasiswa',
                'description' => 'Platform dan program mentoring yang menghubungkan mahasiswa dengan alumni profesional untuk bimbingan karir dan pengembangan skill.',
                'target_amount' => 15000000,
                'current_amount' => 15000000,
                'start_date' => '2024-01-01',
                'end_date' => '2024-05-31',
                'category' => 'event',
                'status' => 'completed',
                'image_url' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
                'approved_by' => 'admin-1',
                'approved_at' => now()->subMonths(3),
                'created_at' => now()->subMonths(4),
                'updated_at' => now(),
            ],
        ];

        DB::table('campaigns')->insert($campaigns);

        // Add some donations
        $donations = [
            [
                'campaign_id' => 1,
                'donor_id' => 'user-4',
                'amount' => 5000000,
                'message' => 'Semangat untuk adik-adik yang berprestasi!',
                'payment_status' => 'success',
                'payment_method' => 'transfer',
                'transaction_id' => 'TRX-' . uniqid(),
                'donated_at' => now()->subDays(5),
            ],
            [
                'campaign_id' => 1,
                'donor_id' => 'user-5',
                'amount' => 10000000,
                'message' => 'Pendidikan adalah investasi terbaik',
                'payment_status' => 'success',
                'payment_method' => 'online',
                'transaction_id' => 'TRX-' . uniqid(),
                'donated_at' => now()->subDays(3),
            ],
            [
                'campaign_id' => 2,
                'donor_id' => 'user-4',
                'amount' => 8000000,
                'message' => 'Mendukung inovasi teknologi pendidikan',
                'payment_status' => 'success',
                'payment_method' => 'online',
                'transaction_id' => 'TRX-' . uniqid(),
                'donated_at' => now()->subDays(2),
            ],
            [
                'campaign_id' => 3,
                'donor_id' => 'user-6',
                'amount' => 3000000,
                'message' => null,
                'payment_status' => 'success',
                'payment_method' => 'transfer',
                'transaction_id' => 'TRX-' . uniqid(),
                'donated_at' => now()->subDays(7),
            ],
            [
                'campaign_id' => 3,
                'donor_id' => 'user-5',
                'amount' => 15000000,
                'message' => 'Sukses untuk acara alumni gathering!',
                'payment_status' => 'success',
                'payment_method' => 'online',
                'transaction_id' => 'TRX-' . uniqid(),
                'donated_at' => now()->subDays(1),
            ],
        ];

        DB::table('donations')->insert($donations);

        // Add campaign updates
        $updates = [
            [
                'campaign_id' => 1,
                'title' => 'Terima kasih untuk donasi awal!',
                'content' => 'Alhamdulillah sudah terkumpul Rp 15.000.000 untuk program beasiswa. Mari kita lanjutkan!',
                'created_at' => now()->subDays(4),
                'updated_at' => now()->subDays(4),
            ],
            [
                'campaign_id' => 2,
                'title' => 'Progress Riset AI',
                'content' => 'Tim riset sudah mulai mengembangkan prototype pertama. Terima kasih atas dukungannya!',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'campaign_id' => 5,
                'title' => 'Program Mentoring Sukses Dilaksanakan!',
                'content' => 'Terima kasih kepada semua donatur. Program mentoring telah selesai dengan 50 pasang mentor-mentee yang terbentuk!',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
        ];

        DB::table('campaign_updates')->insert($updates);
    }
}
