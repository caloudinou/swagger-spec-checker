import { SwaggerDocumentation } from '../index.js'
import path from 'path'
import test from 'ava'

test('nominal', t => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname)
  const URL_SERVE = 'toto'
  const PORT = 4088
  const name = 'mkd'
  const serviceName = __dirname.split('/')[__dirname.split('/').length - 1]
  const nameApp = `${serviceName}-${name}`

  const swagger = {
    yamlPaths: [__dirname+'/patient.yaml'],
    projectInfo: { version: '1.2.3', name: nameApp, description: 'description', host: `${URL_SERVE}:${PORT}` }
  }


  const  [res] = SwaggerDocumentation(swagger.yamlPaths, swagger.projectInfo)
  t.is( res.swaggerDocument.info.version, swagger.projectInfo.version );
  t.is( res.swaggerDocument.host, swagger.projectInfo.host );
  t.is( res.swaggerDocument.basePath, '/v1' );
  const resval = res.validateModel("SaveTestPayload", {user_id: "toto", accepted: true})
  t.is(resval, null)
});
