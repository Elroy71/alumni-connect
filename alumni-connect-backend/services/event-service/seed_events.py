"""
Seed script for Event Service database
Run this script to populate sample events
"""
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import SessionLocal, engine, Base
from app.models.event import Event, EventType, EventStatus

def seed_events():
    """Seed sample events into the database"""
    db = SessionLocal()
    
    try:
        # Check if events already exist
        existing = db.query(Event).count()
        if existing > 0:
            print(f"⚠️ Database sudah memiliki {existing} events. Menambahkan events baru...")
        
        # Get a user ID from identity service (use one of the seeded users)
        organizer_id = "71c95105-e73e-4cda-a3f1-94c67cb9a08f"  # example@gmail.com
        
        # Sample events (3 examples as requested)
        events_data = [
            {
                "organizerId": organizer_id,
                "title": "Webinar: Karier di Era AI",
                "description": "Webinar eksklusif untuk alumni Telkom University membahas peluang karier di era kecerdasan buatan. Pembicara dari Google, Microsoft, dan startup AI lokal akan berbagi insight tentang skill yang dibutuhkan dan tips memulai karier di bidang AI.",
                "type": EventType.WEBINAR,
                "status": EventStatus.PUBLISHED,
                "coverImage": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
                "startDate": datetime.now() + timedelta(days=7, hours=14),
                "endDate": datetime.now() + timedelta(days=7, hours=16),
                "location": "Zoom Meeting",
                "isOnline": True,
                "meetingUrl": "https://zoom.us/j/123456789",
                "capacity": 500,
                "price": 0,
                "tags": ["AI", "Karier", "Teknologi"],
                "requirements": "Laptop/HP dengan akses internet",
                "agenda": "14:00 - Opening\n14:15 - Presentasi AI Trends\n15:00 - Panel Discussion\n15:45 - Q&A",
                "speakers": "Dr. Budi Santoso (AI Lead Google Indonesia)\nYasmin Putri (Microsoft Azure AI)"
            },
            {
                "organizerId": organizer_id,
                "title": "Workshop: React & Next.js untuk Pemula",
                "description": "Workshop hands-on belajar React dan Next.js dari dasar. Cocok untuk alumni yang ingin meningkatkan skill frontend development. Peserta akan membangun aplikasi web sederhana selama workshop.",
                "type": EventType.WORKSHOP,
                "status": EventStatus.PUBLISHED,
                "coverImage": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
                "startDate": datetime.now() + timedelta(days=14, hours=9),
                "endDate": datetime.now() + timedelta(days=14, hours=17),
                "location": "Telkom University, Gedung Landmark Tower Lt. 3",
                "isOnline": False,
                "capacity": 30,
                "price": 150000,
                "tags": ["React", "Next.js", "Workshop", "Frontend"],
                "requirements": "Laptop dengan Node.js terinstall\nPengetahuan dasar HTML/CSS/JavaScript",
                "agenda": "09:00 - Setup Environment\n10:00 - React Fundamentals\n12:00 - Lunch Break\n13:00 - Next.js Introduction\n15:00 - Building Project\n16:30 - Demo & Closing",
                "speakers": "John Doe (Senior Software Engineer at Google)"
            },
            {
                "organizerId": organizer_id,
                "title": "Meetup Alumni Bandung: Coffee & Code",
                "description": "Casual meetup untuk alumni yang berdomisili di Bandung. Ngobrol santai sambil ngopi, sharing pengalaman kerja, dan networking. Terbuka untuk semua angkatan!",
                "type": EventType.MEETUP,
                "status": EventStatus.PUBLISHED,
                "coverImage": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
                "startDate": datetime.now() + timedelta(days=3, hours=16),
                "endDate": datetime.now() + timedelta(days=3, hours=20),
                "location": "Kopi Soe, Jl. Dipatiukur No. 35, Bandung",
                "isOnline": False,
                "capacity": 25,
                "price": 0,
                "tags": ["Networking", "Bandung", "Coffee"],
                "requirements": None,
                "agenda": "16:00 - Gathering\n17:00 - Ice Breaking\n18:00 - Free Networking\n19:30 - Closing",
                "speakers": None
            }
        ]
        
        # Insert events
        created_count = 0
        for event_data in events_data:
            event = Event(**event_data)
            db.add(event)
            created_count += 1
        
        db.commit()
        print(f"✅ Berhasil menambahkan {created_count} sample events!")
        
        # Show summary
        total = db.query(Event).count()
        print(f"📊 Total events di database: {total}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Memulai seed events...")
    seed_events()
    print("🎉 Seeding selesai!")
