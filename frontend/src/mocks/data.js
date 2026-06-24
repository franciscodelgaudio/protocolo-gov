export const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao.silva@cidadao.gov.br', role: 'USER', avatarUrl: null },
  { id: 2, name: 'Maria Santos', email: 'maria.santos@cidadao.gov.br', role: 'USER', avatarUrl: null },
  { id: 3, name: 'Carlos Ferreira', email: 'carlos.admin@protocologov.br', role: 'ADMIN', avatarUrl: null },
  { id: 4, name: 'Ana Gestora', email: 'ana.gestora@protocologov.br', role: 'ADMIN', avatarUrl: null },
]

export const mockRequests = [
  {
    id: 1,
    name: 'Certidão de Nascimento',
    description: 'Solicito segunda via de certidão de nascimento para uso em processo judicial.',
    status: 'PENDING',
    createdAt: '2026-06-01',
  },
  {
    id: 2,
    name: 'Licença Ambiental',
    description: 'Solicitação de licença ambiental para início de obra de construção civil em área urbana.',
    status: 'ACCEPTED',
    createdAt: '2026-06-05',
  },
  {
    id: 3,
    name: 'Alvará de Funcionamento',
    description: 'Pedido de alvará de funcionamento para estabelecimento comercial na Rua das Flores, 123.',
    status: 'REJECTED',
    createdAt: '2026-06-08',
  },
  {
    id: 4,
    name: 'Isenção de IPTU',
    description: 'Requerimento de isenção de IPTU para imóvel residencial de aposentado de baixa renda.',
    status: 'PENDING',
    createdAt: '2026-06-10',
  },
  {
    id: 5,
    name: 'Transferência de Veículo',
    description: 'Solicitação de apoio administrativo para transferência de veículo adquirido em leilão.',
    status: 'ACCEPTED',
    createdAt: '2026-06-12',
  },
  {
    id: 6,
    name: 'Habite-se',
    description: 'Solicitação de habite-se para imóvel residencial recém-construído na Av. Central, 456.',
    status: 'PENDING',
    createdAt: '2026-06-15',
  },
  {
    id: 7,
    name: 'Reclamação de Pavimentação',
    description: 'Reclamação sobre estado precário da pavimentação da Rua das Palmeiras no bairro Centro.',
    status: 'REJECTED',
    createdAt: '2026-06-18',
  },
  {
    id: 8,
    name: 'Cadastro de Imóvel Rural',
    description: 'Solicitação de cadastro de imóvel rural para fins de regularização fundiária.',
    status: 'PENDING',
    createdAt: '2026-06-20',
  },
]

export const mockProcesses = [
  {
    id: 1,
    name: 'Processo: Licença Ambiental #2',
    description: 'Análise e tramitação da solicitação de licença ambiental para obra civil.',
    status: 'IN_PROGRESS',
    createdAt: '2026-06-06',
    request: { id: 2, name: 'Licença Ambiental' },
  },
  {
    id: 2,
    name: 'Processo: Transferência Veicular #5',
    description: 'Verificação e processamento da transferência de veículo adquirido em leilão.',
    status: 'COMPLETED',
    createdAt: '2026-06-13',
    request: { id: 5, name: 'Transferência de Veículo' },
  },
]

export const mockUserRequests = [
  { id: 1, userId: 1, requestId: 1 },
  { id: 2, userId: 1, requestId: 2 },
  { id: 3, userId: 1, requestId: 3 },
  { id: 4, userId: 2, requestId: 4 },
  { id: 5, userId: 2, requestId: 5 },
  { id: 6, userId: 1, requestId: 6 },
  { id: 7, userId: 2, requestId: 7 },
  { id: 8, userId: 1, requestId: 8 },
]
