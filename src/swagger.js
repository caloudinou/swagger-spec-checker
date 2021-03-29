import Validator from 'swagger-model-validator'
import YAML from 'yamljs'
import { ErrorValidateModel } from './error.js'
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
 * @param swaggerYamlPaths
 * @param config
 * @returns {[]}
 */
export const documentationSwaggerYAMLs = (swaggerYamlPaths, info) => {
  const swagger = []

  for (let swaggerYamlPath of getYAMLs(swaggerYamlPaths)) {
    swagger.push(overrideInformation(documentationSwaggerYAML(swaggerYamlPath), info))
  }

  return swagger
}

/**
 * documentationSwaggerYAML
 * @param swaggerYamlPath
 * @param config
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
          return { valid, error:  new ErrorValidateModel(errors) }
      }
    }
}
