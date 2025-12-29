<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Clear existing data
        DB::table('campaign_updates')->truncate();
        DB::table('donations')->truncate();
        DB::table('campaigns')->truncate();

        // ======================
        // ACTIVE CAMPAIGNS (Approved)
        // ======================

        // Campaign 1: Scholarship
        DB::table('campaigns')->insert([
            'user_id' => 'user-1',
            'title' => 'Beasiswa Pendidikan untuk Mahasiswa Berprestasi',
            'description' => 'Program beasiswa penuh untuk mahasiswa berprestasi dari keluarga tidak mampu. Dana akan digunakan untuk biaya kuliah, buku, dan keperluan akademik selama satu semester. Target: 10 mahasiswa penerima beasiswa.',
            'target_amount' => 50000000,
            'current_amount' => 25000000,
            'start_date' => $now->copy()->subDays(30)->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(90)->format('Y-m-d'),
            'category' => 'scholarship',
            'status' => 'active',
            'image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            'approved_by' => 'admin-superadmin',
            'approved_at' => $now->copy()->subDays(29),
            'created_at' => $now->copy()->subDays(30),
            'updated_at' => $now,
        ]);

        // Campaign 2: Research
        DB::table('campaigns')->insert([
            'user_id' => 'user-2',
            'title' => 'Riset Teknologi AI untuk Sistem Pembelajaran',
            'description' => 'Penelitian pengembangan sistem kecerdasan buatan untuk pembelajaran adaptif. Riset ini akan menghasilkan platform yang dapat menyesuaikan materi belajar dengan kemampuan masing-masing mahasiswa.',
            'target_amount' => 30000000,
            'current_amount' => 12000000,
            'start_date' => $now->copy()->subDays(20)->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(60)->format('Y-m-d'),
            'category' => 'research',
            'status' => 'active',
            'image_url' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
            'approved_by' => 'admin-superadmin',
            'approved_at' => $now->copy()->subDays(19),
            'created_at' => $now->copy()->subDays(20),
            'updated_at' => $now,
        ]);

        // Campaign 3: Event (Almost complete)
        DB::table('campaigns')->insert([
            'user_id' => 'user-1',
            'title' => 'Alumni Gathering 2025 - Homecoming',
            'description' => 'Acara tahunan alumni untuk mempererat silaturahmi dan networking antar angkatan. Akan diadakan di kampus dengan berbagai acara menarik seperti seminar, pameran karya, dan makan malam bersama.',
            'target_amount' => 20000000,
            'current_amount' => 18500000,
            'start_date' => $now->copy()->subDays(15)->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(30)->format('Y-m-d'),
            'category' => 'event',
            'status' => 'active',
            'image_url' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            'approved_by' => 'admin-superadmin',
            'approved_at' => $now->copy()->subDays(14),
            'created_at' => $now->copy()->subDays(15),
            'updated_at' => $now,
        ]);

        // Campaign 4: Infrastructure
        DB::table('campaigns')->insert([
            'user_id' => 'user-3',
            'title' => 'Renovasi Laboratorium Komputer',
            'description' => 'Pembaruan fasilitas laboratorium komputer dengan 30 unit PC baru, proyektor, AC, dan furniture ergonomis. Laboratorium ini akan digunakan untuk praktikum dan workshop.',
            'target_amount' => 75000000,
            'current_amount' => 35000000,
            'start_date' => $now->copy()->subDays(25)->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(120)->format('Y-m-d'),
            'category' => 'infrastructure',
            'status' => 'active',
            'image_url' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
            'approved_by' => 'admin-superadmin',
            'approved_at' => $now->copy()->subDays(24),
            'created_at' => $now->copy()->subDays(25),
            'updated_at' => $now,
        ]);

        // Campaign 5: Completed
        DB::table('campaigns')->insert([
            'user_id' => 'user-2',
            'title' => 'Seminar Nasional Teknologi 2024',
            'description' => 'Seminar nasional dengan pembicara dari industri teknologi terkemuka. Terima kasih kepada semua donatur yang telah mendukung acara ini.',
            'target_amount' => 15000000,
            'current_amount' => 15000000,
            'start_date' => $now->copy()->subDays(60)->format('Y-m-d'),
            'end_date' => $now->copy()->subDays(10)->format('Y-m-d'),
            'category' => 'event',
            'status' => 'completed',
            'image_url' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
            'approved_by' => 'admin-superadmin',
            'approved_at' => $now->copy()->subDays(59),
            'created_at' => $now->copy()->subDays(60),
            'updated_at' => $now->copy()->subDays(10),
        ]);

        // ======================
        // PENDING APPROVAL CAMPAIGNS
        // ======================

        // Pending Campaign 1
        DB::table('campaigns')->insert([
            'user_id' => 'user-4',
            'title' => 'Beasiswa S2 untuk Alumni Berprestasi',
            'description' => 'Program beasiswa studi lanjut S2 untuk alumni yang ingin melanjutkan pendidikan ke jenjang pascasarjana. Beasiswa mencakup biaya kuliah penuh dan tunjangan hidup selama masa studi.',
            'target_amount' => 100000000,
            'current_amount' => 0,
            'start_date' => $now->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(180)->format('Y-m-d'),
            'category' => 'scholarship',
            'status' => 'pending_approval',
            'image_url' => 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
            'created_at' => $now->copy()->subDays(1),
            'updated_at' => $now->copy()->subDays(1),
        ]);

        // Pending Campaign 2
        DB::table('campaigns')->insert([
            'user_id' => 'user-5',
            'title' => 'Riset Energi Terbarukan',
            'description' => 'Penelitian pengembangan panel surya dengan efisiensi tinggi untuk kampus berkelanjutan. Hasil riset akan diaplikasikan di gedung kampus sebagai pilot project.',
            'target_amount' => 45000000,
            'current_amount' => 0,
            'start_date' => $now->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(150)->format('Y-m-d'),
            'category' => 'research',
            'status' => 'pending_approval',
            'image_url' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
            'created_at' => $now->copy()->subHours(12),
            'updated_at' => $now->copy()->subHours(12),
        ]);

        // Pending Campaign 3
        DB::table('campaigns')->insert([
            'user_id' => 'user-3',
            'title' => 'Pembangunan Taman Baca Kampus',
            'description' => 'Membangun taman baca outdoor yang nyaman untuk mahasiswa. Dilengkapi dengan WiFi gratis, charging station, dan koleksi buku populer.',
            'target_amount' => 25000000,
            'current_amount' => 0,
            'start_date' => $now->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(90)->format('Y-m-d'),
            'category' => 'infrastructure',
            'status' => 'pending_approval',
            'image_url' => 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
            'created_at' => $now->copy()->subHours(6),
            'updated_at' => $now->copy()->subHours(6),
        ]);

        // ======================
        // DONATIONS
        // ======================

        // Donations for Campaign 1 (Beasiswa)
        DB::table('donations')->insert([
            'campaign_id' => 1,
            'donor_id' => 'user-5',
            'amount' => 10000000,
            'message' => 'Semangat untuk adik-adik yang berprestasi! Pendidikan adalah kunci masa depan.',
            'payment_status' => 'success',
            'payment_method' => 'transfer',
            'transaction_id' => 'TRX-' . time() . '-001',
            'donated_at' => $now->copy()->subDays(25),
        ]);

        DB::table('donations')->insert([
            'campaign_id' => 1,
            'donor_id' => 'user-6',
            'amount' => 5000000,
            'message' => 'Sukses selalu untuk program beasiswa ini!',
            'payment_status' => 'success',
            'payment_method' => 'transfer',
            'transaction_id' => 'TRX-' . time() . '-002',
            'donated_at' => $now->copy()->subDays(20),
        ]);

        DB::table('donations')->insert([
            'campaign_id' => 1,
            'donor_id' => 'user-7',
            'amount' => 10000000,
            'message' => 'Alumni angkatan 2010 mendukung!',
            'payment_status' => 'success',
            'payment_method' => 'online',
            'transaction_id' => 'TRX-' . time() . '-003',
            'donated_at' => $now->copy()->subDays(10),
        ]);

        // Donations for Campaign 2 (Research AI)
        DB::table('donations')->insert([
            'campaign_id' => 2,
            'donor_id' => 'user-5',
            'amount' => 7000000,
            'message' => 'Mendukung inovasi teknologi pendidikan!',
            'payment_status' => 'success',
            'payment_method' => 'online',
            'transaction_id' => 'TRX-' . time() . '-004',
            'donated_at' => $now->copy()->subDays(15),
        ]);

        DB::table('donations')->insert([
            'campaign_id' => 2,
            'donor_id' => 'user-8',
            'amount' => 5000000,
            'message' => 'Semoga risetnya sukses dan bermanfaat!',
            'payment_status' => 'success',
            'payment_method' => 'transfer',
            'transaction_id' => 'TRX-' . time() . '-005',
            'donated_at' => $now->copy()->subDays(5),
        ]);

        // Donations for Campaign 3 (Alumni Gathering)
        DB::table('donations')->insert([
            'campaign_id' => 3,
            'donor_id' => 'user-6',
            'amount' => 5000000,
            'message' => 'Tidak sabar bertemu teman-teman lama!',
            'payment_status' => 'success',
            'payment_method' => 'online',
            'transaction_id' => 'TRX-' . time() . '-006',
            'donated_at' => $now->copy()->subDays(12),
        ]);

        DB::table('donations')->insert([
            'campaign_id' => 3,
            'donor_id' => 'user-7',
            'amount' => 8500000,
            'message' => 'Dari angkatan 2015, semoga acaranya sukses!',
            'payment_status' => 'success',
            'payment_method' => 'transfer',
            'transaction_id' => 'TRX-' . time() . '-007',
            'donated_at' => $now->copy()->subDays(8),
        ]);

        DB::table('donations')->insert([
            'campaign_id' => 3,
            'donor_id' => 'user-9',
            'amount' => 5000000,
            'message' => 'Homecoming 2025!',
            'payment_status' => 'success',
            'payment_method' => 'online',
            'transaction_id' => 'TRX-' . time() . '-008',
            'donated_at' => $now->copy()->subDays(3),
        ]);

        // Donations for Campaign 4 (Lab Renovation)
        DB::table('donations')->insert([
            'campaign_id' => 4,
            'donor_id' => 'user-5',
            'amount' => 15000000,
            'message' => 'Untuk kemajuan fasilitas kampus tercinta',
            'payment_status' => 'success',
            'payment_method' => 'transfer',
            'transaction_id' => 'TRX-' . time() . '-009',
            'donated_at' => $now->copy()->subDays(20),
        ]);

        DB::table('donations')->insert([
            'campaign_id' => 4,
            'donor_id' => 'user-10',
            'amount' => 20000000,
            'message' => 'Sumbangan dari alumni angkatan 2008',
            'payment_status' => 'success',
            'payment_method' => 'transfer',
            'transaction_id' => 'TRX-' . time() . '-010',
            'donated_at' => $now->copy()->subDays(15),
        ]);

        // Donations for Campaign 5 (Completed - Seminar)
        DB::table('donations')->insert([
            'campaign_id' => 5,
            'donor_id' => 'user-6',
            'amount' => 8000000,
            'message' => 'Mendukung acara seminar nasional',
            'payment_status' => 'success',
            'payment_method' => 'online',
            'transaction_id' => 'TRX-' . time() . '-011',
            'donated_at' => $now->copy()->subDays(50),
        ]);

        DB::table('donations')->insert([
            'campaign_id' => 5,
            'donor_id' => 'user-7',
            'amount' => 7000000,
            'message' => 'Sukses untuk seminarnya!',
            'payment_status' => 'success',
            'payment_method' => 'transfer',
            'transaction_id' => 'TRX-' . time() . '-012',
            'donated_at' => $now->copy()->subDays(45),
        ]);

        // ======================
        // CAMPAIGN UPDATES
        // ======================

        DB::table('campaign_updates')->insert([
            'campaign_id' => 1,
            'title' => 'Terima kasih! Target 50% tercapai',
            'content' => 'Alhamdulillah sudah terkumpul Rp 25.000.000 untuk program beasiswa. Terima kasih kepada semua donatur yang telah berkontribusi. Kami akan segera memproses penerima beasiswa.',
            'created_at' => $now->copy()->subDays(10),
            'updated_at' => $now->copy()->subDays(10),
        ]);

        DB::table('campaign_updates')->insert([
            'campaign_id' => 2,
            'title' => 'Progress Riset: Tahap Awal',
            'content' => 'Tim riset telah memulai pengembangan prototype sistem AI. Terima kasih atas dukungan finansialnya, sangat membantu untuk pembelian perangkat keras.',
            'created_at' => $now->copy()->subDays(7),
            'updated_at' => $now->copy()->subDays(7),
        ]);

        DB::table('campaign_updates')->insert([
            'campaign_id' => 3,
            'title' => 'Persiapan Venue Hampir Selesai',
            'content' => 'Venue sudah dipesan dan sedang dalam tahap dekorasi. Acara akan diadakan pada tanggal yang sudah ditentukan. Stay tuned!',
            'created_at' => $now->copy()->subDays(5),
            'updated_at' => $now->copy()->subDays(5),
        ]);

        DB::table('campaign_updates')->insert([
            'campaign_id' => 5,
            'title' => 'Seminar Sukses Dilaksanakan!',
            'content' => 'Terima kasih kepada seluruh donatur dan peserta. Seminar berjalan lancar dengan 500+ peserta. Dokumentasi lengkap akan segera di-upload.',
            'created_at' => $now->copy()->subDays(10),
            'updated_at' => $now->copy()->subDays(10),
        ]);
    }
}
