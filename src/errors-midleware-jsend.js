'use strict'

export class ErrorValidateModel extends Error {
    constructor (errors) {
        super()
        this.name = 'PreconditionFailed:SwaggerContract'
        this.code = 400
        this.message = 'Model doesn\'t match Swagger contract'
        this.errors = Array.isArray(errors)
            ? errors.reduce((final, currentError) => {
                const { message } = currentError.message ? currentError : { message: currentError }
                const name = message.split(/\s/)[0]
                final[name] = message.replace(`${name} `, '')
                return final
            }, {})
            : (errors ? [errors] : [])
    }
}
