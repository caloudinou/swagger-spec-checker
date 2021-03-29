/**
 * overrideInformation
 * @param swagger
 * @param version
 * @param name
 * @param description
 * @param host
 * @returns {*}
 */
export const overrideInformation = (swagger, { version, name, description, host }) => {
  if (swagger.swaggerDocument.swagger !== '2.0') {
    return swagger
  }

  swagger.swaggerDocument.info.version = version || swagger.swaggerDocument.info.version
  swagger.swaggerDocument.info.title = `${swagger.swaggerDocument.info.title} ${name ? '- '+ name : ''}`
  swagger.swaggerDocument.info.description = swagger.swaggerDocument.info.description || description || ''
  swagger.swaggerDocument.host = host || swagger.swaggerDocument.host || ''

  return swagger
}
