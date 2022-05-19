import chalk from 'chalk'
/**
 * Plop configuration for automating code/files
 * @param {*} plop
 */

// Templates
const TEMPLATES_DIR = './templates'
const COMPONENT = `${TEMPLATES_DIR}/Component/Component.tsx.hbs`
const COMPONENT_TEST = `${TEMPLATES_DIR}/Component/Component.test.tsx.hbs`
const INDEX = `${TEMPLATES_DIR}/Component/index.ts.hbs`
const PAGE = `${TEMPLATES_DIR}/Page/Page.tsx.hbs`
const HOOK = `${TEMPLATES_DIR}/Hook/Hook.ts.hbs`
const CONTEXT = `${TEMPLATES_DIR}/Context/Context.tsx.hbs`

export default plop => {
  plop.setWelcomeMessage('Choose from the options below:')

  // Component generator
  plop.setGenerator('component', {
    description: 'Create a new atomic component',
    prompts: [
      {
        type: 'list',
        name: 'heirarchy',
        message: 'Select a type:',
        choices: [
          {
            name: 'Atom',
            value: 'atoms',
          },
          {
            name: 'Molecule',
            value: 'molecules',
          },
          {
            name: 'Organism',
            value: 'organisms',
          },
          {
            name: 'Template',
            value: 'templates',
          },
          {
            name: 'Wrappers',
            value: 'wrappers',
          },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the component:',
      },
    ],
    actions: data => {
      if (!data.name) {
        data.name = `${data.heirarchy.slice(0, -1)}${Date.now().toString()}`
        console.log(
          chalk.yellowBright(
            `No Component name given. Creating randomized naming...`
          )
        )
        console.log(chalk.greenBright(`Created ${data.name}`))
      }

      let actions = []

      // Create subdirectory structure
      if (data.name.includes('/')) {
        data.subDirPath = data.name.split('/')[0]
        data.name = data.name.split('/')[1]
        actions.push(
          {
            type: 'add',
            path: 'src/components/{{heirarchy}}/{{subDirPath}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
            templateFile: COMPONENT,
          },
          {
            type: 'add',
            path: 'src/components/{{heirarchy}}/{{subDirPath}}/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
            templateFile: COMPONENT_TEST,
          },
          {
            type: 'add',
            path: 'src/components/{{heirarchy}}/{{subDirPath}}/{{pascalCase name}}/index.ts',
            templateFile: INDEX,
          },
          {
            type: 'add',
            path: 'src/components/{{heirarchy}}/{{subDirPath}}/index.ts',
            skipIfExists: true,
          },
          {
            type: 'append',
            path: 'src/components/{{heirarchy}}/{{subDirPath}}/index.ts',
            template: "export * from './{{pascalCase name}}'",
          }
        )
        // Add new wrapper to wrappers/index.ts exports
        if (data.heirarchy === 'wrappers') {
          actions.push({
            type: 'append',
            path: 'src/components/wrappers/index.ts',
            template: "export * from './{{subDirPath}}/{{pascalCase name}}'",
          })
        }
      } else {
        actions.push(
          {
            type: 'add',
            path: 'src/components/{{heirarchy}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
            templateFile: COMPONENT,
          },
          {
            type: 'add',
            path: 'src/components/{{heirarchy}}/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
            templateFile: COMPONENT_TEST,
          },
          {
            type: 'add',
            path: 'src/components/{{heirarchy}}/{{pascalCase name}}/index.ts',
            templateFile: INDEX,
          }
        )
        // Add new wrapper to wrappers/index.ts exports
        if (data.heirarchy === 'wrappers') {
          actions.push({
            type: 'append',
            path: 'src/components/wrappers/index.ts',
            template: "export * from './{{pascalCase name}}'",
          })
        }
      }

      return actions
    },
  })

  // Page generator
  plop.setGenerator('page', {
    description: 'Create a new Gatsby page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the page:',
      },
    ],
    actions: data => {
      if (!data.name) {
        data.name = `page-${Date.now().toString()}`
        console.log(
          chalk.yellowBright(
            `No Page name given. Creating randomized naming...`
          )
        )
        console.log(chalk.greenBright(`Created ${data.name}`))
      }

      // TODO: More robust character stripping here, combined with slash handling for subdirectories
      // data.name = data.name.toLowerCase().replace(/-{2,}/g, '-');

      let actions = []

      if (data.name.includes('/')) {
        data.subDirPath = data.name.split('/')[0]
        data.name = data.name.split('/')[1]
        actions.push({
          type: 'add',
          path: 'src/pages/{{heirarchy}}/{{subDirPath}}/{{lowerCase name}}/{{lowerCase name}}.tsx',
          templateFile: COMPONENT,
        })
      } else {
        actions.push({
          type: 'add',
          path: 'src/pages/{{lowerCase name}}.tsx',
          templateFile: PAGE,
        })
      }
      return actions
    },
  })

  // Hook generator
  plop.setGenerator('hook', {
    description: 'Create a new hook',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the hook:',
      },
    ],
    actions: data => {
      if (!data.name) {
        data.name = `useHook${Date.now().toString()}`
        console.log(
          chalk.yellowBright(
            `No Hook name given. Creating randomized naming...`
          )
        )
        console.log(chalk.greenBright(`Created ${data.name}`))
      }

      if (
        !data.name.startsWith('use') ||
        data.name[3] != data.name[3].toUpperCase()
      ) {
        throw new Error(
          chalk.bgRedBright(
            `"${data.name}" does not follow React Hook naming conventions, e.g., "useName"`
          )
        )
      }

      let actions = []
      actions.push(
        {
          type: 'add',
          path: 'src/hooks/{{camelCase name}}.ts',
          templateFile: HOOK,
        },
        {
          type: 'add',
          path: 'src/hooks/index.ts',
          skipIfExists: true,
          templateFile: INDEX,
        },
        {
          // Add new hook to hooks/index.ts exports
          type: 'append',
          path: 'src/hooks/index.ts',
          template: "export * from './{{camelCase name}}'",
        }
      )
      return actions
    },
  })

  // Context generator
  plop.setGenerator('context', {
    description: 'Create a new React context ',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the Context:',
      },
    ],
    actions: data => {
      if (!data.name) {
        data.name = `Misc${Date.now().toString()}Context`
        console.log(
          chalk.yellowBright(
            `No Context name given. Creating randomized naming...`
          )
        )
        console.log(chalk.greenBright(`Created ${data.name}`))
      }

      if (!data.name.includes('Context')) {
        throw new Error(
          chalk.bgRedBright(
            `"${data.name}" does not follow React Context naming conventions, e.g., "NameContext"`
          )
        )
      }

      let actions = []
      actions.push({
        type: 'add',
        path: 'src/context/{{titleCase name}}.tsx',
        templateFile: CONTEXT,
      })
      return actions
    },
  })
}
