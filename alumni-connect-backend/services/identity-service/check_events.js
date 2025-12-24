import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEvents() {
    console.log('📅 Checking Events in Database...\n');

    try {
        const events = await prisma.event.findMany({
            select: {
                title: true,
                type: true,
                location: true,
                isOnline: true,
                startDate: true,
                capacity: true,
                price: true,
                status: true,
                organizer: {
                    select: {
                        profile: {
                            select: {
                                fullName: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                startDate: 'asc'
            }
        });

        console.log(`Total Events: ${events.length}\n`);

        events.forEach((event, index) => {
            const date = new Date(event.startDate);
            const formattedDate = date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            console.log(`${index + 1}. ${event.title}`);
            console.log(`   📌 Type: ${event.type}`);
            console.log(`   📍 Location: ${event.isOnline ? '🌐 ' : '📍 '}${event.location}`);
            console.log(`   📅 Date: ${formattedDate}`);
            console.log(`   👥 Capacity: ${event.capacity} people`);
            console.log(`   💰 Price: ${event.price === 0 ? 'FREE' : 'IDR ' + event.price.toLocaleString()}`);
            console.log(`   👤 Organizer: ${event.organizer?.profile?.fullName || 'Unknown'}`);
            console.log(`   ✅ Status: ${event.status}\n`);
        });

        // Group by type
        console.log('\n📊 Events by Type:');
        const eventsByType = events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {});

        Object.entries(eventsByType).forEach(([type, count]) => {
            console.log(`   - ${type}: ${count} event(s)`);
        });

        console.log('\n✅ All events successfully loaded!\n');
    } catch (error) {
        console.error('❌ Error checking events:', error);
    }
}

checkEvents()
    .finally(async () => {
        await prisma.$disconnect();
    });
