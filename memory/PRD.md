# StoreAdmin - Sistema de Gestao de Loja

## Problema Original
Construir uma aplicacao admin dashboard moderna usando ViteJs, TypeScript, React Query, Formik, Yup e Shadcn UI com design polido estilo painel administrativo.

## Stack Tecnico
- **Frontend**: React 19 + Vite 8 + TypeScript
- **Estilo**: Tailwind CSS + Shadcn UI (tema Royal Blue)
- **Estado**: React Query (@tanstack/react-query)
- **Formularios**: Formik + Yup
- **HTTP**: Axios (configurado, pronto para integrar backend)
- **Roteamento**: React Router DOM v7

## Arquitetura
```
/app/frontend/
├── index.html              # Entry point Vite
├── vite.config.ts          # Config Vite (alias @, porta 3000)
├── tsconfig.json           # Config TypeScript
├── src/
│   ├── main.tsx            # Entry com QueryClientProvider
│   ├── App.tsx             # Rotas (13 paginas)
│   ├── api/
│   │   ├── axios.ts        # Instancia Axios configurada
│   │   └── mockData.ts     # Dados mockados
│   ├── types/
│   │   ├── loja.ts         # Comissao, Desconto, MetaVenda
│   │   ├── cadastro.ts     # IMEI, Cartao, GrupoPermissao, GrupoContas, Fornecedor
│   │   └── estoque.ts      # MovimentacaoEstoque, NfeFornecedor, PosicaoSintetica, EstoqueValorizado
│   ├── layouts/
│   │   └── DashboardLayout.tsx  # Sidebar + Header
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── loja/           # Comissoes, Descontos, MetasVenda
│   │   ├── cadastro/       # GestaoIMEI, Cartao, GrupoPermissao, GrupoContas, Fornecedor
│   │   └── estoque/        # Movimentacao, NfeFornecedor, PosicaoSintetica, EstoqueValorizado
│   └── components/ui/      # Shadcn components (.jsx)
```

## O que foi implementado (15/Abr/2026)

### Migracao Vite + TypeScript ✅
- Projeto migrado de CRA/CRACO para Vite 8 + TypeScript
- vite.config.ts com alias @, porta 3000, envPrefix compativel
- tsconfig.json com allowJs para componentes Shadcn em .jsx

### Fundacao ✅
- QueryClientProvider configurado em main.tsx
- Instancia Axios em api/axios.ts
- Toaster (sonner) global
- React Router com 13 rotas

### Dashboard Layout ✅
- Sidebar com gradiente azul, navegacao colapsavel
- Header com busca, notificacoes, menu usuario
- Responsivo (sidebar mobile com overlay)
- Animacoes de transicao

### Modulo 1 - Loja ✅
- **Comissoes**: Listagem, busca, CRUD dialog, validacao Formik/Yup
- **Descontos**: Listagem, busca, CRUD dialog, status badges (ativo/inativo/expirado)
- **Metas de Venda**: Listagem, busca, barras de progresso, status

### Modulo 2 - Cadastro ✅
- **Gestao IMEI**: Listagem, busca, filtro status, CRUD dialog, validacao 15 digitos
- **Cartao**: Listagem, busca, CRUD dialog (bandeira, tipo, taxa, dias)
- **Grupo Permissao**: Listagem, CRUD dialog com checkboxes de permissoes
- **Grupo de Contas**: Listagem, CRUD dialog (receita/despesa)
- **Fornecedor**: Listagem, busca (nome/CNPJ), CRUD dialog com validacao completa

### Modulo 3 - Estoque ✅
- **Movimentacao**: Listagem, filtro tipo, registro de movimentacao
- **NFe Fornecedor**: Listagem, filtro status, dialog de detalhes
- **Posicao Sintetica**: Listagem, filtro status, barras de ocupacao, alertas visuais
- **Estoque Valorizado**: Listagem com totalizador, cores por margem de lucro

## Status de Testes
- Testing agent: 14/14 testes PASS (100%)
- Todas as paginas renderizam corretamente
- Navegacao sidebar funcional
- Formularios Formik/Yup validam corretamente
- Filtros e busca funcionam

## Proximas Tarefas (Backlog)
- P1: Integrar com backend Node.js + PostgreSQL
- P1: Implementar CRUD real (APIs REST)
- P2: Autenticacao e controle de acesso
- P2: Paginacao nas tabelas
- P3: Dark mode toggle
- P3: Exportacao de relatorios (PDF/Excel)
- P3: Graficos e charts no dashboard (Recharts)
