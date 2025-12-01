/** @type {import('dependency-cruiser').IConfiguration} */

module.exports = {
  forbidden: [
    // ============================================
    // REGRA 1: ISOLAMENTO DO CORE (Functional Core)
    // ============================================
    {
      name: 'core-no-deps-on-application',
      comment:
        'O Core não pode depender de Application (lógica pura, sem conhecimento de casos de uso)',
      severity: 'error',
      from: {
        path: '^src/core',
      },
      to: {
        path: '^src/application',
      },
    },
    {
      name: 'core-no-deps-on-infrastructure',
      comment:
        'O Core não pode depender de Infrastructure (lógica pura, sem frameworks ou IO)',
      severity: 'error',
      from: {
        path: '^src/core',
      },
      to: {
        path: '^src/infrastructure',
      },
    },
    {
      name: 'core-no-framework-dependencies',
      comment:
        'O Core não pode importar frameworks ou bibliotecas de IO (apenas utilitários puros)',
      severity: 'error',
      from: {
        path: '^src/core',
      },
      to: {
        path: [
          // Frameworks proibidos
          'node_modules/@nestjs',
          'node_modules/express',
          'node_modules/fastify',
          'node_modules/@fastify',

          // ORMs e Database proibidos
          'node_modules/orchid-orm',
          'node_modules/orchid-core',
          'node_modules/typeorm',
          'node_modules/prisma',
          'node_modules/mongoose',
          'node_modules/pg',
          'node_modules/mysql',

          // IO proibido
          'node_modules/axios',
          'node_modules/node-fetch',
          'node_modules/fs-extra',
        ],
      },
    },

    // ============================================
    // REGRA 2: INDEPENDÊNCIA DA APPLICATION
    // ============================================
    {
      name: 'application-no-deps-on-infrastructure',
      comment:
        'Application não pode depender de Infrastructure (apenas define interfaces/ports que a Infra implementa)',
      severity: 'error',
      from: {
        path: '^src/application',
      },
      to: {
        path: '^src/infrastructure',
      },
    },

    // ============================================
    // REGRA 3: HIERARQUIA E DEPENDÊNCIAS CIRCULARES
    // ============================================
    {
      name: 'no-circular',
      comment:
        'Dependências circulares são proibidas em qualquer camada (geram acoplamento)',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      comment:
        'Arquivos órfãos (não importados por ninguém) devem ser evitados',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', // dot files
          '\\.d\\.ts$', // TypeScript declaration files
          '(^|/)tsconfig\\.json$', // tsconfig
          '(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$', // configs
          '^src/main\\.ts$', // Entry point
          '^test/', // Testes
        ],
      },
      to: {},
    },

    // ============================================
    // REGRAS ADICIONAIS DE BOAS PRÁTICAS
    // ============================================
    {
      name: 'not-to-deprecated',
      comment: 'Não use módulos marcados como deprecated',
      severity: 'warn',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment:
        'Não use dependências (npm packages) que não estão no package.json',
      from: {},
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
      },
    },
  ],

  options: {
    // Padrões de arquivos/pastas a serem excluídos da análise
    doNotFollow: {
      path: ['node_modules', 'dist', 'coverage', 'build', '\\..*'],
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled',
      ],
    },

    // Incluir dependências de tipo (TypeScript)
    includeOnly: ['^src/', '^test/'],

    // Tipos de módulos TypeScript
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json',
    },

    // Melhorar performance
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },

    // Relatórios
    reporterOptions: {
      dot: {
        collapsePattern: '^(node_modules|packages)/[^/]+',
      },
      archi: {
        collapsePattern: '^(node_modules|packages)/[^/]+',
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
