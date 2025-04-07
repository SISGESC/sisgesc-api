import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger/swagger.yml'));

// Add servers configuration
swaggerDocument.servers = [
  {
    url: process.env.API_URL || 'http://localhost:3000',
    description: 'Development server'
  }
];

// Automatically import and merge all path YAML files
const pathsDirectory = path.join(__dirname, 'swagger/paths');
const pathFiles = fs.readdirSync(pathsDirectory)
  .filter(file => file.endsWith('.yml'));

const paths = {};
pathFiles.forEach(file => {
  const filePath = path.join(pathsDirectory, file);
  const pathContent = YAML.load(filePath);
  Object.assign(paths, pathContent.paths);
});

// Automatically import and merge all schema YAML files
const schemasDirectory = path.join(__dirname, 'swagger/schemas');
const schemaFiles = fs.readdirSync(schemasDirectory)
  .filter(file => file.endsWith('.yml'));

const schemas = {};
schemaFiles.forEach(file => {
  const filePath = path.join(schemasDirectory, file);
  const schemaContent = YAML.load(filePath);
  Object.assign(schemas, schemaContent);
});

// Initialize components if it doesn't exist
if (!swaggerDocument.components) {
  swaggerDocument.components = {};
}

// Add schemas to components
swaggerDocument.components.schemas = schemas;
swaggerDocument.paths = paths;

const options: swaggerJsdoc.Options = {
  definition: swaggerDocument,
  apis: [], // We don't need this anymore as we're using YAML files
};

export const swaggerSpec = swaggerJsdoc(options); 