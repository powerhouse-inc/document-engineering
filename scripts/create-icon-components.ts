import prettier from '@prettier/sync'
import * as prettierAsync from 'prettier'
import camelCase from 'camelcase'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdir, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const iconsDir = join('public/icons')
const outputDirPath = join('src/ui/components/icon-components')

const toPascalCase = (filename: string): string => {
  return camelCase(filename.replace('.svg', ''), { pascalCase: true })
}

// Check if there are changes in the icons directory
const hasChanges = () => {
  try {
    const output = execSync(`git status --porcelain ${iconsDir}`).toString()
    return output.trim().length > 0
  } catch (error) {
    console.error('Error checking git status:', error)
    return false
  }
}

// if (!hasChanges()) {
//   console.log(
//     "No changes detected in the icons directory. Skipping generation.",
//   );
//   process.exit(0);
// }

if (!existsSync(outputDirPath)) {
  mkdirSync(outputDirPath)
}

// Get prettier config
const getPrettierConfig = async () => {
  try {
    const prettierrcPath = join(process.cwd(), '.prettierrc')
    if (existsSync(prettierrcPath)) {
      const prettierrcContent = readFileSync(prettierrcPath, 'utf8')
      const config = JSON.parse(prettierrcContent) as Record<string, unknown>
      return { parser: 'typescript' as const, ...config }
    }
  } catch (error) {
    console.warn('Could not read .prettierrc file:', error)
  }
  
  return { parser: 'typescript' as const }
}
const prettierConfig = await getPrettierConfig()

readdir(iconsDir, (err, files) => {
  if (err) {
    console.error('Error reading the icons directory:', err)
    return
  }

  const svgFiles = files.filter(file => file.endsWith('.svg'))

  if (svgFiles.length === 0) {
    console.log('No SVG files found in the icons directory.')
    return
  }

  const iconNames: string[] = []

  svgFiles.forEach(file => {
    const filePath = join(iconsDir, file)
    const componentName = toPascalCase(file)
    const svgData = readFileSync(filePath, 'utf8')
    const svgDataWithProps = svgData
      .replace('<svg', '<svg {...props}')
      .replace(/([a-z-]+)="([^"]*)"/g, (_, attrName: string, attrValue: string) => {
        return `${camelCase(attrName)}="${attrValue}"`
      })
    let iconContent = "import type { Props } from './types.js';\n\n"
    iconContent += `const ${componentName} = (props: Props) => {\n`
    iconContent += `  return (\n${svgDataWithProps}\n  );\n`
    iconContent += `}\n\n`
    iconContent += `${componentName}.displayName = '${componentName}';\n\n`
    iconContent += `export default ${componentName}\n`
    const formattedIconContent = prettier.format(iconContent, prettierConfig)
    writeFileSync(join(outputDirPath, `${componentName}.tsx`), formattedIconContent, 'utf8')
    iconNames.push(componentName)
  })

  let indexContent = "import type { Props } from './types.js';\n\n"
  const sortedIconNames = iconNames.sort()
  for (const iconName of sortedIconNames) {
    indexContent += `import ${iconName} from "./${iconName}.js";\n`
  }
  indexContent += `\nexport const iconNames = ${JSON.stringify(sortedIconNames, null, 2)} as const;\n\n`
  indexContent += `export type IconName = (typeof iconNames)[number];\n`
  indexContent += `export const iconComponents: Record<IconName, (props: Props) => React.JSX.Element> = {
    ${iconNames.map(name => name).join(',\n    ')}
  } as const;\n`
  const formattedTypesContent = prettier.format(indexContent, prettierConfig)
  writeFileSync(join(outputDirPath, 'index.ts'), formattedTypesContent)

  console.log(`Generated icon components at: ${outputDirPath}`)
})
