'use strict'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerModelValidator from 'swagger-model-validator'

import { ErrorValidateModel } from './errors.js'

/**
 * initialize swagger-jsdoc
 */
export class SwaggerSpecChecker {
    /**
     * @constructor
     * @param {String[]|undefined|null} swaggerYamlPaths - Array of string with end line .yml or .yaml
     * @param {{openapi: string, title: string, version: string, description: string, host: string, basePath: string}|*} config
     * @param {{version: string, name: string, description: string}|*} projectInfo
     */
    constructor (swaggerYamlPaths, config = null, projectInfo = null) {
        this.swaggerSpec = null
        this.projectInfo = projectInfo
        this.config = config
        this.options = swaggerYamlPaths
        this._swaggerSpecInit()
    }

    /**
     * projectInfos
     * @type {{version: string, name: string, description: string}}
     * @param {{version: string, name: string, description: string}} projectInfo
     */
    set projectInfo (projectInfo) {
        const defaultProjectInfo = { name: 'no-name', version: '1', description: '' }
        !projectInfo && (projectInfo = defaultProjectInfo)
        this._projectInfo = {
            version: projectInfo.version ? projectInfo.version : defaultProjectInfo.version,
            name: projectInfo.name ? projectInfo.name : defaultProjectInfo.name,
            description: projectInfo.description ? projectInfo.description : defaultProjectInfo.description
        }
    }

    /**
     * projectInfo
     * @type {{version: string, name: string, description: string}}
     * @return {{version: string, name: string, description: string}}
     */
    get projectInfo () {
        return this._projectInfo
    }

    /**
     * Setter config
     * @type {{info: {title: string, version: string, description: string}, host: string, basePath: string}}
     * @param {{title: string, version: string, description: string, host: string, basePath: string}|*} config
     * @return void
     */
    set config (config) {
        !config && (config = this.configDefault)
        this._config = {
            info: {
                title: `REST API for ${config.title ? config.title : this.configDefault.info.title}`,
                version: config.version ? config.version : this.configDefault.info.version,
                description: config.description ? config.description : this.configDefault.info.description
            },
            host: config.host ? config.host : this.configDefault.host,
            basePath: config.basePath ? config.basePath : this.configDefault.basePath
        }
    }

    /**
     * Getter config
     * @type {{openapi: string, info: {title: string, version: string, description: string}, host: string, basePath: string}}
     * @return {{openapi: string, info: {title: string, version: string, description: string}, host: *, basePath: *}|*}
     */
    get config () {
        return this._config
    }

    /**
     * getter static of config of default with description
     * @return {{info: {title: string, titleDesc: string, version: string, versionDesc: string, description: string, descriptionDesc: string}, host: string, hostDesc: string, basePath: string, basePathDesc: string}}
     */
    get configDefault () {
        return ({
            info: {
                title: '' + this.projectInfo.name,
                titleDesc: 'Title of the documentation default no-name',
                version: '' + this.projectInfo.version,
                versionDesc: 'Version of the app in 1',
                description: '' + this.projectInfo.description,
                descriptionDesc: 'short description of the app default string empty'
            },
            host: 'localhost:8080',
            hostDesc: 'the host or url of the app by default is localhost:8080',
            basePath: '/',
            basePathDesc: 'the basepath of your endpoint by default is : /'
        })
    }

    /**
     * Setter options
     * @param {String[]} swaggerYamlPaths
     * @type {{swaggerDefinition: {openapi: string, info: {title: string, version: string, description: string}, host: string, basePath: string}, apis: string[]}}
     * @return void
     */
    set options (swaggerYamlPaths) {
        this._options = ({
            swaggerDefinition: this.config,
            apis: (Array.isArray(swaggerYamlPaths) ? swaggerYamlPaths : ['**/*.yaml'])
                .filter(pathSwaggerYml => /.(yaml|yml)$/.test(pathSwaggerYml))
        })
    }

    /**
     * Getter options
     * @type {{swaggerDefinition: {openapi: string, info: {title: string, version: string, description: string}, host: string, basePath: string}, apis: string[]}}
     * @return {{swaggerDefinition: {openapi: string, info: {title: string, version: string, description: string}, host: string, basePath: string}, apis: string[]}}
     */
    get options () {
        return this._options
    }

    /**
     * method to init swaggerSpec
     * @private
     * @return void
     */
    _swaggerSpecInit () {
        this.swaggerSpec = swaggerJSDoc(this.options)
        swaggerModelValidator(this.swaggerSpec)
    }

    /**
     * validate Model
     * @param {string} name
     * @param {Object} model
     * @return {Promise<boolean>} return true if validModel
     */
    validateModel (name, model) {
        return new Promise((resolve, reject) => {
            const responseValidation = this.swaggerSpec.validateModel(name, model, false, true)
            return !responseValidation.valid
                ? reject(new ErrorValidateModel(responseValidation.errors))
                : resolve(responseValidation.valid)
        })
    }
}
