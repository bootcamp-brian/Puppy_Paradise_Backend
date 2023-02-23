#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

/**
 * Constants
 */

const base = path.join(__dirname, '..', '..')
const package_json_path = path.join(base, 'package.json')
const index_js_path = path.join(base, 'index.js')

/**
 * Locals
 */

let main_script

/**
 * Set the main script to load
 */

if (!fs.existsSync(package_json_path)) {
  main_script = index_js_path
} else {
  let config = JSON.parse(fs.readFileSync(package_json_path))

  if (config.main === undefined || config.main === '') {
    main_script = index_js_path
  } else {
    main_script = path.resolve(config.main)
  }
}

/**
 * Load the main script
 */

if (fs.existsSync(main_script)) {
  const app = require(main_script)

  /**
   * Get db interface
   */

  if (!Object.keys(app.locals).includes('db')) { throw Error("Missing 'db' on app.locals {Object}."); return }
  const db = app.locals.db

  /**
   * Get db configuration
   */

  if (!Object.keys(db).includes('config')) { throw Error("Missing 'config' on app.locals.db {Object}."); return }
  const keys = Object.keys(db.config)
  if (!keys.includes('database')) { throw Error("Missing 'database' on app.locals.db.config {Object}."); return }
  let pg_database = db.config.database
  let pg_user = (db.config.user || process.env.PGUSER || process.env.USER)

  /**
   * Create database
   */

  child_process.spawnSync('createdb', [pg_database, '-O', pg_user])

  /**
   * Close db pool
   */

  db.end()
} else {
  throw Error("Missing 'main' in package.json and missing an index.js file.")
}
