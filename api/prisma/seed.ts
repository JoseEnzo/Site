// api/prisma/seed.ts
import { prisma } from '../lib/prisma.js';

async function main() {
  const servicos = [
    { nome: 'Funilaria', descricao: 'Reparamos amassados, riscos e danos na lataria do seu veículo com precisão.', icone: 'hammer-outline', slug: 'funilaria' },
    { nome: 'Pintura', descricao: 'Pintura automotiva completa com acabamento profissional e cores originais.', icone: 'color-palette-outline', slug: 'pintura' },
    { nome: 'Serralheria', descricao: 'Fabricação e reparo de estruturas metálicas para carrocerias e chassis.', icone: 'construct-outline', slug: 'serralheria' },
    { nome: 'Polimento', descricao: 'Polimento e cristalização que devolvem o brilho original da pintura.', icone: 'sparkles-outline', slug: 'polimento' },
    { nome: 'Restauração', descricao: 'Restauração completa de veículos antigos e clássicos com fidelidade ao original.', icone: 'time-outline', slug: 'restauracao' },
    { nome: 'Reforma', descricao: 'Reforma geral do veículo: interior, exterior e acabamentos personalizados.', icone: 'settings-outline', slug: 'reforma' },
  ];

  for (const servico of servicos) {
    await prisma.servico.upsert({
      where: { slug: servico.slug },
      update: {},
      create: servico,
    });
  }

  console.log('✅ Serviços criados!');
}

main().finally(() => prisma.$disconnect());