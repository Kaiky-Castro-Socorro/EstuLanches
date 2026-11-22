# Ficha Simplificada de Registro de Mudança (RDM)

| Campo | Valor |
|---|---|
| Sistema | EstuLanches |
| Versão implantada | 1.0.0 |
| Data / horário da implantação | __/__/2026 às __:__ |
| Responsável (Técnico de Implantação) | Kaiky |
| Ambiente | Produção (Docker Compose) |

## Parâmetros alterados
- Variáveis em .env: POSTGRES_USER, POSTGRES_PASSWORD (senha alterada do padrão), POSTGRES_DB
- Porta publicada: 3000 (API). Banco sem porta exposta.
- Imagens: node:20-alpine (app), postgres:16-alpine (banco)

## Resultado dos testes de validação
| Teste | Resultado |
|---|---|
| Unitários (jest) | __ passaram / __ total |
| Integração (jest + PostgreSQL) | __ passaram / __ total |
| docker compose ps (app e db "healthy") | OK / FALHA |
| docker compose logs (sem erros críticos) | OK / FALHA |
| GET /health e /cardapio | OK / FALHA |

## Status final da implantação
[ ] Concluída com sucesso   [ ] Concluída com ressalvas   [ ] Revertida (rollback)

Observações: ______________________________________
