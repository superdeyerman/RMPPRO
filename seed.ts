import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding services...');
  
  const services = [
    { id: 's1', name: 'Corte & Peinado', category: 'Beauty', icon: '✂', price: 45000, description: 'Estilismo premium en tu espacio. Acabados de revista.' },
    { id: 's2', name: 'Color & Balayage', category: 'Beauty', icon: '◈', price: 80000, description: 'Coloración francesa y técnicas artesanales de iluminación.' },
    { id: 's3', name: 'Extensiones Premium', category: 'Beauty', icon: '⟡', price: 150000, description: 'Extensiones naturales. Pelo a pelo, keratina o clip.' },
    { id: 's4', name: 'Maquillaje Pro', category: 'Beauty', icon: '◇', price: 60000, description: 'Maquillaje social, editorial o de novia con artistas.' },
    { id: 's5', name: 'Masaje Relajante', category: 'Wellness', icon: '◯', price: 55000, description: 'Técnica sueca y relajación profunda personalizada.' },
    { id: 's6', name: 'Masaje Piedras Calientes', category: 'Wellness', icon: '◉', price: 75000, description: 'Basalto volcánico termal. Descontractura y revitaliza.' },
    { id: 's7', name: 'Spa Parejas', category: 'Wellness', icon: '❖', price: 120000, description: 'Masajes simultáneos, aromaterapia y ritual compartido.' },
    { id: 's8', name: 'Limpieza Facial', category: 'Wellness', icon: '✿', price: 50000, description: 'Limpieza profunda, extracción y mascarilla nutritiva.' },
    { id: 's9', name: 'Entrenador Personal', category: 'Fitness', icon: '◎', price: 50000, description: 'Sesión diseñada para ti en tu hogar o hotel.' },
    { id: 's10', name: 'Yoga Privado', category: 'Fitness', icon: '○', price: 45000, description: 'Hatha, Vinyasa, Yin o Restaurativo.' },
    { id: 's14', name: 'Chef Privado', category: 'Gastronomía', icon: '👨‍🍳', price: 120000, description: 'Chef profesional prepara cena gourmet en tu cocina.' }
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: s,
      create: s
    });
  }

  console.log('Seeding pros...');
  const pros = [
    { initials: 'AM', name: 'Andrea Molina', email: 'andrea@rm.cl', role: 'stylist', title: 'Estilista Senior', specialty: 'Color & Balayage', rating: 5.0, totalServices: 342 },
    { initials: 'CS', name: 'Camila Soto', email: 'camila@rm.cl', role: 'stylist', title: 'Terapeuta SPA', specialty: 'Masajes', rating: 5.0, totalServices: 287 },
  ];

  for (const p of pros) {
    await prisma.user.upsert({
      where: { email: p.email },
      update: p,
      create: p
    });
  }

  console.log('Seeding sample bookings...');
  const sampleBookings = [
    {
      guestName: 'Valentina Rojas',
      guestPhone: '+56987654321',
      guestEmail: 'val.rojas@gmail.com',
      totalPrice: 63000,
      modality: 'Hotel 5★',
      hotelName: 'Hotel W Santiago',
      roomNumber: '412',
      dateTime: new Date('2026-04-20T16:00:00Z'),
      status: 'PAID',
    },
    {
      guestName: 'Francisca Meyer',
      guestPhone: '+56976543210',
      guestEmail: 'f.meyer@email.com',
      totalPrice: 95000,
      modality: 'Domicilio',
      address: 'Av. Vitacura 1234',
      dateTime: new Date('2026-04-21T10:30:00Z'),
      status: 'PAID',
    }
  ];

  for (const b of sampleBookings) {
    await prisma.booking.create({
      data: {
        ...b,
        services: {
          connect: [{ id: 's1' }]
        }
      }
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
