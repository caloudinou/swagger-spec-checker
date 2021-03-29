import { ErrorValidateModel } from './src/error.js'
import swaggerUi from 'swagger-ui-express'
import { documentationSwaggerYAMLs } from './src/swagger.js'

export const SwaggerDocumentation = documentationSwaggerYAMLs
export const SwaggerErrorValidateModel = ErrorValidateModel
export const SwaggerUi = swaggerUi
