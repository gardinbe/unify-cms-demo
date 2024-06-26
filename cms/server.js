import 'colors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router, json, urlencoded, static as _static } from 'express';
import { createServer } from 'http';
import { configDotenv } from 'dotenv';
import { resolve } from 'path';
import { env } from 'process';
import { Sequelize, DataTypes, Model } from 'sequelize';
import fs from 'fs';
import fsp from 'fs/promises';

/**
 * Object with methods to parse environment variables.
 */
const parseEnv = {
    /**
     * Parses an environment variable value as a boolean.
     * @param value - Environment variable value
     * @returns Boolean
     */
    bool(value) {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return null;
    },
    /**
     * Parses an environment variable value as a float.
     * @param value - Environment variable value
     * @returns Integer
     */
    int(value) {
        if (!value)
            return null;
        const parsedValue = parseInt(value);
        if (!Number.isInteger(parsedValue)) // includes NaN check
            return null;
        return parsedValue;
    },
    /**
     * Parses an environment variable value as a float.
     * @param value - Environment variable value
     * @returns Float
     */
    float(value) {
        if (!value)
            return null;
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue))
            return null;
        return parsedValue;
    }
};

configDotenv({ path: resolve(import.meta.dirname, '../.env') });
const IS_PROD = env.NODE_ENV === 'production';
const IS_EXTERNAL_BUILD = parseEnv.bool(env.IS_EXTERNAL_BUILD)
    ?? false;
const PORT = parseEnv.int(env.PORT)
    ?? 1234;
const COOKIE_SECRET = env.COOKIE_SECRET
    || 'secret';
const ROOT_PATH = resolve(import.meta.dirname);
const LOGS_PATH = env.LOGS_PATH
    ? resolve(env.LOGS_PATH)
    : IS_EXTERNAL_BUILD
        ? resolve(ROOT_PATH, 'logs')
        : resolve(ROOT_PATH, '../logs');
const UI_ASSETS_PATH = IS_EXTERNAL_BUILD
    ? resolve(ROOT_PATH, 'ui')
    : resolve(ROOT_PATH, '../../ui/dist');
const SCHEMAS_PATH = env.SCHEMAS_PATH
    ? resolve(env.SCHEMAS_PATH)
    : IS_EXTERNAL_BUILD
        ? resolve(ROOT_PATH, 'data/schemas')
        : resolve(ROOT_PATH, '../.tmp/schemas');
const DATABASE_PATH = env.DATABASE_PATH
    ? resolve(env.DATABASE_PATH)
    : IS_EXTERNAL_BUILD
        ? resolve(ROOT_PATH, 'data/data.db')
        : resolve(ROOT_PATH, '../.tmp/data.db');
var config = {
    /** Whether or not the environment variable `NODE_ENV` is set to `production`. */
    IS_PROD,
    /** Whether or not the running instance is an external build. */
    IS_EXTERNAL_BUILD,
    /** Port the HTTP server should run on. */
    PORT,
    /** Secret cookie token. */
    COOKIE_SECRET,
    /** Absolute path of the application's root directory (directory containing top-most `node_modules`). */
    ROOT_PATH,
    /** Absolute path of the application logs directory. */
    LOGS_PATH,
    /** Absolute path of the UI assets directory. */
    UI_ASSETS_PATH,
    /** Absolute path of the `schemas` directory. */
    SCHEMAS_PATH,
    /** Absolute path of the database. */
    DATABASE_PATH
};

const defaultLogOptions = {
    file: 'server',
    toConsole: true
};
/**
 * Logs a message to the console and to a file.
 * @param message - Message
 * @param options - Options
 */
const log = async (message, options) => {
    const _options = { ...defaultLogOptions, ...options };
    if (_options.toConsole)
        console.log(message);
    const filePath = resolve(config.LOGS_PATH, _options.file + '.log');
    const timestamp = new Date().toISOString();
    await fsp.appendFile(filePath, `[${timestamp}] ${message.strip}\n`);
};
/**
 * Logs an error to the console and to a file.
 * @param error - Error
 * @param options - Options
 */
const logError = async (error, options) => {
    const _options = { ...defaultLogOptions, ...options };
    if (_options.toConsole)
        console.error(error);
    const formattedError = typeof error === 'string'
        ? error.strip
        : error;
    const filePath = resolve(config.LOGS_PATH, _options.file + '.log');
    const timestamp = new Date().toISOString();
    await fsp.appendFile(filePath, `[${timestamp}] [ERROR] ${formattedError}\n`);
};
/**
 * Creates the `logs` directory if it doesn't already exist.
 */
const initLogsDir = async () => {
    if (!fs.existsSync(config.LOGS_PATH))
        await fsp.mkdir(config.LOGS_PATH, { recursive: true });
};

/**
 * Synchronizes and tests the connection of a database.
 * @param db - Database
 */
const initDatabase = async (db) => {
    void log('Initializing database'.gray);
    try {
        // creates db if doesn't exist
        await db.sync();
    }
    catch (e) {
        void logError('Failed to synchronize database');
        throw e;
    }
    void log('Checking database connection'.gray);
    try {
        // test db connection
        await db.authenticate();
    }
    catch (e) {
        void logError('Failed to connect to database');
        throw e;
    }
};

/**
 * Creates the `schemas`, `singles` and `collections` directories if they
 * don't already exist.
 */
const initSchemaDirs = async () => {
    if (!fs.existsSync(config.SCHEMAS_PATH))
        await fsp.mkdir(config.SCHEMAS_PATH, { recursive: true });
    if (!fs.existsSync(resolve(config.SCHEMAS_PATH, 'singles')))
        await fsp.mkdir(resolve(config.SCHEMAS_PATH, 'singles'));
    if (!fs.existsSync(resolve(config.SCHEMAS_PATH, 'collections')))
        await fsp.mkdir(resolve(config.SCHEMAS_PATH, 'collections'));
};

const data = new Sequelize({
    dialect: 'sqlite',
    storage: config.DATABASE_PATH,
    logging: config.IS_PROD
        ? (message) => void log(message, { file: 'database', toConsole: false })
        : false
});

class Collection extends Model {
}
Collection.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    schema: {
        type: DataTypes.STRING
    },
    properties: {
        type: DataTypes.TEXT
    }
}, {
    sequelize: data,
    tableName: 'collections'
});

class Single extends Model {
}
Single.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    schema: {
        type: DataTypes.STRING
    },
    properties: {
        type: DataTypes.TEXT
    }
}, {
    sequelize: data,
    tableName: 'singles'
});

const get$6 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection name' });
        return;
    }
    let items;
    try {
        items = (await Collection.findAll({ where: { schema: name } }))
            .map((item) => ({
            id: item.id,
            schema: item.schema,
            properties: JSON.parse(item.properties)
        }));
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json(items);
};
const getItem$1 = async (req, res) => {
    const { name, id: rawId } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection name' });
        return;
    }
    if (typeof rawId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection item ID' });
        return;
    }
    const id = parseInt(rawId);
    if (!Number.isInteger(id)) { // includes NaN check
        res.status(400).json({ error: 'Invalid collection item ID' });
        return;
    }
    let item;
    try {
        const rawItem = await Collection.findOne({ where: { schema: name, id } });
        if (!rawItem) {
            res.status(404).json({ error: 'No item with this ID exists in this collection' });
            return;
        }
        item = {
            id: rawItem.id,
            schema: rawItem.schema,
            properties: JSON.parse(rawItem.properties)
        };
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json(item);
};
const postItem = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection name' });
        return;
    }
    // TODO: ensure content-type is json
    const properties = req.body;
    if (typeof properties !== 'object'
        || properties === null
        || Array.isArray(properties)) {
        res.status(400).json({ error: 'Invalid collection item structure' });
        return;
    }
    let dbItem;
    try {
        dbItem = await Collection.create({
            schema: name,
            properties: JSON.stringify(properties)
        });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({
        success: 'Created collection item successfully',
        created_item_id: dbItem.id
    });
};
const patchItem = async (req, res) => {
    const { name, id: rawId } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection name' });
        return;
    }
    if (typeof rawId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection item ID' });
        return;
    }
    const id = parseInt(rawId);
    if (!Number.isInteger(id)) { // includes NaN check
        res.status(400).json({ error: 'Invalid collection item ID' });
        return;
    }
    // TODO: ensure content-type is json
    const properties = req.body;
    if (typeof properties !== 'object'
        || properties === null
        || Array.isArray(properties)) {
        res.status(400).json({ error: 'Invalid collection item structure' });
        return;
    }
    try {
        if (!await Collection.findOne({ where: { schema: name, id } })) {
            res.status(404).json({ error: 'No item with this ID exists in this collection' });
            return;
        }
        await Collection.update({
            properties: JSON.stringify(properties)
        }, { where: { schema: name, id } });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Updated collection item successfully' });
};
const deleteItem = async (req, res) => {
    const { name, id: rawId } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection name' });
        return;
    }
    if (typeof rawId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection item ID' });
        return;
    }
    const id = parseInt(rawId);
    if (!Number.isInteger(id)) { // includes NaN check
        res.status(400).json({ error: 'Invalid collection item ID' });
        return;
    }
    try {
        if (!await Collection.findOne({ where: { schema: name, id } })) {
            res.status(404).json({ error: 'No item with this ID exists in this collection' });
            return;
        }
        await Collection.destroy({ where: { schema: name, id } });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Deleted collection item successfully' });
};
const internalCollectionsController = { get: get$6, getItem: getItem$1, postItem, patchItem, deleteItem };

const get$5 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid single name' });
        return;
    }
    let item;
    try {
        const rawSingle = await Single.findOne({ where: { schema: name } });
        if (!rawSingle) {
            res.status(404).json({ error: 'No content exists for this single' });
            return;
        }
        item = {
            id: rawSingle.id,
            schema: rawSingle.schema,
            properties: JSON.parse(rawSingle.properties)
        };
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json(item);
};
const post$2 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid single name' });
        return;
    }
    // TODO: ensure content-type is json
    const properties = req.body;
    if (typeof properties !== 'object'
        || properties === null
        || Array.isArray(properties)) {
        res.status(400).json({ error: 'Invalid single structure' });
        return;
    }
    try {
        await Single.create({
            schema: name,
            properties: JSON.stringify(properties)
        });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Created single successfully' });
};
const patch$2 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid single name' });
        return;
    }
    // TODO: ensure content-type is json
    const properties = req.body;
    if (typeof properties !== 'object'
        || properties === null
        || Array.isArray(properties)) {
        res.status(400).json({ error: 'Invalid single structure' });
        return;
    }
    try {
        if (!await Single.findOne({ where: { schema: name } })) {
            res.status(404).json({ error: 'No content exists for this single' });
            return;
        }
        await Single.update({
            properties: JSON.stringify(properties)
        }, { where: { schema: name } });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Updated single successfully' });
};
const internalSinglesController = { get: get$5, post: post$2, patch: patch$2 };

const internalContentRouter = Router();
internalContentRouter.get('/singles/:name', internalSinglesController.get);
internalContentRouter.post('/singles/:name', internalSinglesController.post);
internalContentRouter.patch('/singles/:name', internalSinglesController.patch);
internalContentRouter.get('/collections/:name', internalCollectionsController.get);
internalContentRouter.get('/collections/:name/:id', internalCollectionsController.getItem);
internalContentRouter.post('/collections/:name', internalCollectionsController.postItem);
internalContentRouter.patch('/collections/:name/:id', internalCollectionsController.patchItem);
internalContentRouter.delete('/collections/:name/:id', internalCollectionsController.deleteItem);

const getAll$1 = async (_req, res) => {
    let schemas;
    try {
        const fileNames = await fsp.readdir(resolve(config.SCHEMAS_PATH, 'collections'));
        schemas = await Promise.all(fileNames.map(async (fileName) => JSON.parse(await fsp.readFile(resolve(config.SCHEMAS_PATH, `collections/${fileName}`), 'utf-8'))));
    }
    catch (e) {
        res.status(404).json({ error: 'No collection schema exists with this name' });
        return;
    }
    res.status(200).json(schemas);
};
const get$4 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing collection schema name' });
        return;
    }
    let schema;
    try {
        schema = JSON.parse(await fsp.readFile(resolve(config.SCHEMAS_PATH, `collections/${name}.json`), 'utf-8'));
    }
    catch (e) {
        res.status(404).json({ error: 'No collection schema exists with this name' });
        return;
    }
    res.status(200).json(schema);
};
const post$1 = async (req, res) => {
    // TODO: ensure content-type is json
    const schema = req.body;
    if (!validCollectionSchema(schema)) {
        res.status(400).json({ error: 'Invalid collection schema structure' });
        return;
    }
    try {
        if (fs.existsSync(resolve(config.SCHEMAS_PATH, `collections/${schema.name}.json`))) {
            res.status(400).json({ error: 'A collection schema already exists with this name' });
            return;
        }
        await fsp.writeFile(resolve(config.SCHEMAS_PATH, `collections/${schema.name}.json`), JSON.stringify(schema, undefined, '  '), 'utf-8');
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({
        success: 'Created collection schema successfully',
        created_schema_name: schema.name
    });
};
const patch$1 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection schema name' });
        return;
    }
    // TODO: ensure content-type is json
    const schema = req.body;
    if (!validCollectionSchema(schema)) {
        res.status(400).json({ error: 'Invalid collection schema structure' });
        return;
    }
    try {
        if (!fs.existsSync(resolve(config.SCHEMAS_PATH, `collections/${name}.json`))) {
            res.status(400).json({ error: 'No collection schema exists with this name' });
            return;
        }
        await fsp.writeFile(resolve(config.SCHEMAS_PATH, `collections/${name}.json`), JSON.stringify(schema, undefined, '  '), 'utf-8');
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Updated collection schema successfully' });
};
const _delete$1 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection schema name' });
        return;
    }
    try {
        if (!fs.existsSync(resolve(config.SCHEMAS_PATH, `collections/${name}.json`))) {
            res.status(400).json({ error: 'No collection schema exists with this name' });
            return;
        }
        await fsp.unlink(resolve(config.SCHEMAS_PATH, `collections/${name}.json`));
        await Collection.destroy({ where: { schema: name } });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Deleted collection schema successfully' });
};
const internalCollectionsSchemaController = { getAll: getAll$1, get: get$4, post: post$1, patch: patch$1, delete: _delete$1 };
/**
 * Checks if the provided object is a valid collection schema.
 * @param schema - Schema to check
 * @returns Validity
 */
const validCollectionSchema = (schema) => typeof schema === 'object'
    && schema !== null
    && !Array.isArray(schema)
    && 'name' in schema
    && typeof schema.name === 'string'
    && schema.name !== 'create'
    && 'plural_display_name' in schema
    && typeof schema.plural_display_name === 'string'
    && 'singular_display_name' in schema
    && typeof schema.singular_display_name === 'string'
    && 'item_display_property' in schema
    && typeof schema.item_display_property === 'string'
    && 'properties' in schema
    && typeof schema.properties === 'object'
    && schema.properties !== null
    && !Array.isArray(schema.properties);

const getAll = async (_req, res) => {
    let schemas;
    try {
        const fileNames = await fsp.readdir(resolve(config.SCHEMAS_PATH, 'singles'));
        schemas = await Promise.all(fileNames.map(async (fileName) => JSON.parse(await fsp.readFile(resolve(config.SCHEMAS_PATH, `singles/${fileName}`), 'utf-8'))));
    }
    catch (e) {
        res.status(404).json({ error: 'No single schema exists with this name' });
        return;
    }
    res.status(200).json(schemas);
};
const get$3 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing single schema name' });
        return;
    }
    let schema;
    try {
        schema = JSON.parse(await fsp.readFile(resolve(config.SCHEMAS_PATH, `singles/${name}.json`), 'utf-8'));
    }
    catch (e) {
        res.status(404).json({ error: 'No single schema exists with this name' });
        return;
    }
    res.status(200).json(schema);
};
const post = async (req, res) => {
    // TODO: ensure content-type is json
    const schema = req.body;
    if (!validSingleSchema(schema)) {
        res.status(400).json({ error: 'Invalid single schema structure' });
        return;
    }
    try {
        if (fs.existsSync(resolve(config.SCHEMAS_PATH, `singles/${schema.name}.json`))) {
            res.status(400).json({ error: 'A single schema already exists with this name' });
            return;
        }
        await fsp.writeFile(resolve(config.SCHEMAS_PATH, `singles/${schema.name}.json`), JSON.stringify(schema, undefined, '  '), 'utf-8');
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({
        success: 'Created single schema successfully',
        created_schema_name: schema.name
    });
};
const patch = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid single schema name' });
        return;
    }
    // TODO: ensure content-type is json
    const schema = req.body;
    if (!validSingleSchema(schema)) {
        res.status(400).json({ error: 'Invalid single schema structure' });
        return;
    }
    try {
        if (!fs.existsSync(resolve(config.SCHEMAS_PATH, `singles/${name}.json`))) {
            res.status(400).json({ error: 'No single schema exists with this name' });
            return;
        }
        await fsp.writeFile(resolve(config.SCHEMAS_PATH, `singles/${name}.json`), JSON.stringify(schema, undefined, '  '), 'utf-8');
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Updated single schema successfully' });
};
const _delete = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid single schema name' });
        return;
    }
    try {
        if (!fs.existsSync(resolve(config.SCHEMAS_PATH, `singles/${name}.json`))) {
            res.status(400).json({ error: 'No single schema exists with this name' });
            return;
        }
        await fsp.unlink(resolve(config.SCHEMAS_PATH, `singles/${name}.json`));
        await Single.destroy({ where: { schema: name } });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json({ success: 'Deleted single schema successfully' });
};
const internalSinglesSchemaController = { getAll, get: get$3, post, patch, delete: _delete };
/**
 * Checks if the provided object is a valid single schema.
 * @param schema - Schema to check
 * @returns Validity
 */
const validSingleSchema = (schema) => typeof schema === 'object'
    && schema !== null
    && !Array.isArray(schema)
    && 'name' in schema
    && typeof schema.name === 'string'
    && schema.name !== 'create'
    && 'display_name' in schema
    && typeof schema.display_name === 'string'
    && 'properties' in schema
    && typeof schema.properties === 'object'
    && schema.properties !== null
    && !Array.isArray(schema.properties);

const internalSchemasRouter = Router();
internalSchemasRouter.get('/singles', internalSinglesSchemaController.getAll);
internalSchemasRouter.get('/singles/:name', internalSinglesSchemaController.get);
internalSchemasRouter.post('/singles', internalSinglesSchemaController.post);
internalSchemasRouter.patch('/singles/:name', internalSinglesSchemaController.patch);
internalSchemasRouter.delete('/singles/:name', internalSinglesSchemaController.delete);
internalSchemasRouter.get('/collections', internalCollectionsSchemaController.getAll);
internalSchemasRouter.get('/collections/:name', internalCollectionsSchemaController.get);
internalSchemasRouter.post('/collections', internalCollectionsSchemaController.post);
internalSchemasRouter.patch('/collections/:name', internalCollectionsSchemaController.patch);
internalSchemasRouter.delete('/collections/:name', internalCollectionsSchemaController.delete);

const internalApiRouter = Router();
internalApiRouter.use('/schemas', internalSchemasRouter);
internalApiRouter.use('/content', internalContentRouter);

const get$2 = (_req, res) => {
    res.sendFile(resolve(config.UI_ASSETS_PATH, 'index.html'));
};
const vueAppController = { get: get$2 };

const pagesRouter = Router();
pagesRouter.get('*', vueAppController.get);

const get$1 = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection name' });
        return;
    }
    let itemsProperties;
    try {
        itemsProperties = (await Collection.findAll({ where: { schema: name } }))
            .map((item) => ({
            id: item.id, // TODO: reconsider slapping id with properties?
            ...JSON.parse(item.properties)
        }));
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json(itemsProperties);
};
const getItem = async (req, res) => {
    const { name, id: rawId } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection name' });
        return;
    }
    if (typeof rawId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid collection item ID' });
        return;
    }
    const id = parseInt(rawId);
    if (!Number.isInteger(id)) { // includes NaN check
        res.status(400).json({ error: 'Invalid collection item ID' });
        return;
    }
    let itemProperties;
    try {
        const rawItem = await Collection.findOne({ where: { schema: name, id } });
        if (!rawItem) {
            res.status(404).json({ error: 'No item with this ID exists in this collection' });
            return;
        }
        itemProperties = {
            id: rawItem.id, // TODO: reconsider slapping id with properties?
            ...JSON.parse(rawItem.properties)
        };
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json(itemProperties);
};
const publicCollectionsController = { get: get$1, getItem };

const get = async (req, res) => {
    const { name } = req.params;
    if (typeof name !== 'string') {
        res.status(400).json({ error: 'Missing or invalid single name' });
        return;
    }
    let itemProperties;
    try {
        const rawSingle = await Single.findOne({ where: { schema: name } });
        if (!rawSingle) {
            res.status(404).json({ error: 'No single exists with this name' });
            return;
        }
        itemProperties = JSON.parse(rawSingle.properties);
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        void logError(e);
        return;
    }
    res.status(200).json(itemProperties);
};
const publicSinglesController = { get };

const publicApiRouter = Router();
publicApiRouter.get(['/single/:name', '/s/:name', '/:name'], publicSinglesController.get);
publicApiRouter.get(['/collection/:name', '/c/:name'], publicCollectionsController.get);
publicApiRouter.get(['/collection/:name/:id', '/c/:name/:id'], publicCollectionsController.getItem);

const router = Router();
router.use('/api', publicApiRouter);
router.use('/internal-api', internalApiRouter);
router.use(pagesRouter);

// init directories
await initLogsDir();
void log('Starting Unify CMS'.blue + '\n');
void log('Checking schema directories'.gray);
await initSchemaDirs();
// init database
await initDatabase(data);
// create app, init middlewares
void log('Creating application'.gray);
const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(compression());
app.use(_static(config.UI_ASSETS_PATH, { index: false }));
app.use(cookieParser(config.COOKIE_SECRET));
app.use(router);
// create http server
void log('Creating server'.gray + '\n');
const server = createServer(app);
server.listen(config.PORT, () => {
    void log('Unify CMS running: '.blue + `http://localhost:${config.PORT}`.yellow.underline);
});
