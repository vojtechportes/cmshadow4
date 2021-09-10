import fs from 'fs'
import $RefParser from 'json-schema-ref-parser'

const prebuild = async () => {
  const parser = new $RefParser()
  const dereferenced = await parser.dereference('schema.json')

  fs.writeFileSync('cmshadow.bundle.json', JSON.stringify(dereferenced, null, 2))  
}

prebuild()