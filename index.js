import { ErrorValidateModel } from './src/errors-midleware-jsend.js'
import { Core } from './src/core.js'
import swaggerUi from 'swagger-ui-express'

export const SwaggerSpec = Core
export const SwaggerErrorValidateModel = ErrorValidateModel
export const SwaggerUi = swaggerUi
