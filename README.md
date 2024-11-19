![SVG depicting the steps involving a CI/CD process in an infinite cycle: plan, code, build, continuous testing, release, deploy, operate, monitor. ](./public/cicd.svg)

# CI/CD e GitHub Actions

🎓 Curso: [NextJS: CI e CD para Front-end com o Github Actions](https://cursos.alura.com.br/course/nextjs-ci-cd-front-end-github-actions)

🗒️ [Events that trigger workflows](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)

🙏 [Créditos da imagem](https://www.blackduck.com/glossary/what-is-cicd.html)

## Definição

- CI (Continuous Integration): está relacionado às etapas de commit, build e testes da aplicação, ou seja, tarefas do dia a dia do dev;

- CD (Continuous Delivery): está relacionado às etapas de release e deploy, ou seja, às entregas do projeto.

São processos de automatização de um projeto.

## Usando GitHub Actions para deploy na Vercel

Para o CD usando a Vercel, são necessários alguns passos. O curso mostrou detalhadamente uma forma, mas já é antiga e algumas coisas mudaram. 

Deixo abaixo os links para referência (em inglês) de como é feito hoje em dia, e mais abaixo os scrips criados no `package.json` e o arquivo yml utilizado para o workflow:

- [Criação do arquivo yml para o workflow](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)

- [Criação do VERCEL_TOKEN](https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token)

- [Instalação da Vercel CLI](https://vercel.com/docs/cli): necessária para criar os tokens VERCEL_ORG_ID e VERCEL_PROJECT_ID.

  - uma alternativa é usar o comando `npx vercel link` na pasta do projeto. Quando rodar a primeira vez, dois passos adicionais irão ocorrer: 1. Irá instalar o pacote da Vercel e 2. Irá logar na sua conta Vercel. Após isso, o comando irá rodar e fazer algumas perguntas para configuração do link (é como seu projeto local é linkado com o projeto hospedado na Vercel). Finalizado, será criada a pasta `.vercel` e dentro dela você encontrará o `projectId` e `orgId` no arquivo `project.json`. Essa pasta é automaticamente adicionada ao gitignore. **NÃO compartilhe essa pasta nem os valores dos tokens** para evitar acesso indevido ao seu projeto.

- [Criação de secrets no GitHub](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository): é aqui que você vai guardar os tokens gerados.

### Scripts package.json

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "deploy:prod": "npm run build && vercel --yes --prod --token=$VERCEL_TOKEN"
}
```

### Arquivo yml

```yml
name: 'CD: Main Workflow'

# variáveis de ambiente 
# (salvas no GitHub secrets)
env:
  VERCEL_TOKEN: '${{ secrets.VERCEL_TOKEN }}'
  VERCEL_ORG_ID: '${{ secrets.VERCEL_ORG_ID }}'
  VERCEL_PROJECT_ID: '${{ secrets.VERCEL_PROJECT_ID }}'

# quando a action deve ser acionada
on:
  push:
    branches: [main, cd-vercel]

# o que deve ser executado
jobs:
  deploy: # nome deste job
    runs-on: ubuntu-latest
    # use - para indicar uma lista de passos
    steps:      
      - uses: actions/checkout@v3
      - name: Run Install
        run: npm install
      - name: Run Deploy
        run: npm run deploy:prod
```