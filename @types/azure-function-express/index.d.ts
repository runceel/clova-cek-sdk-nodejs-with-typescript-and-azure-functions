import express from 'express';
declare module 'azure-function-express' {
    export function createHandler(app: express.Express): Function;
}
