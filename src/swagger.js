import Validator from 'swagger-model-validator'
import YAML from 'yamljs'
import { ErrorDocumentNotFound, ErrorDocumentOverride, ErrorValidateModel } from './error.js'
import { overrideInformation } from './override-information.js'


/**
 * optionsV2
 * @param {string[]|null|undefined} swaggerYamlPaths
 * @param {Object|any} config
 * @returns {{swaggerDefinition: ({title: string, version: string, description: string, host: string, basePath: string}|*|{openapi: string, info: {title: string, version: string, description: string}, host: *, basePath: *}), apis: (*|string[])}}
 */
const getYAMLs = function (swaggerYamlPaths) {
  return Array.isArray(swaggerYamlPaths)
    ? swaggerYamlPaths.filter(pathSwaggerYml => /.(yaml|yml)$/.test(pathSwaggerYml))
    : ['**/*.yaml']
}

/**
 * documentationSwaggerYAMLs
 * @param {string[]|null|undefined}swaggerYamlPaths
 * @param {{
 * version: string|undefined,
 * name: string|undefined,
 * description: string|undefined,
 * host: string|undefined
 * }|null|undefined} info
 * @returns {[]}
 */
export const documentationSwaggerYAMLs = (swaggerYamlPaths, info) => {
  const swaggers = []

  for (let swaggerYamlPath of getYAMLs(swaggerYamlPaths)) {
    const swaggerYaml = documentationSwaggerYAML(swaggerYamlPath)
    if (!swaggerYaml) {
      throw new ErrorDocumentNotFound(swaggerYamlPath)
    }
    const swaggerOverride = overrideInformation(swaggerYaml, info)
    if (!swaggerOverride) {
      throw new ErrorDocumentOverride(swaggerOverride)
    }

    swaggers.push(swaggerOverride)
  }

  return swaggers
}

/**
 * documentationSwaggerYAML
 * @param swaggerYamlPath
 * @returns {{swaggerDocument: *, validator: Validator, validateModel: (function(*=, *=): Promise<boolean|ErrorValidateModel>)}}
 */
export const documentationSwaggerYAML = (swaggerYamlPath) => {
  const swaggerDocument = YAML.load(swaggerYamlPath)
  const validator = new Validator(swaggerDocument)

  return {
    swaggerDocument,
    validator,
    validateModel: (name, model) => {
      const { valid, errors } = swaggerDocument.validateModel(name, model, false, true)
      if (valid) {
        return null
      }
      return new ErrorValidateModel(errors)
    }
  }
}
