// This file is kept for backward compatibility.
// The project now uses native pg (node-postgres) instead of Prisma.
// Import from './pool' directly in new code.
const pool = require('./pool');
module.exports = pool;
