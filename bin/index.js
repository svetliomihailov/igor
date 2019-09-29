#!/usr/bin/env node

const igor = require('../src');

const args = process.argv;

const [_node, _executable, generator, identifier, ...params] = args;

if (!generator) {
  igor.greet();
  process.exit();
}

if (!identifier) {
  console.log(`Usage for ${generator}`);
  process.exit();
}

// console.log('generator:', generator)
// console.log('identifier:', identifier)
// console.log('params:', params)

const executor = require(`../src/${generator}`);
executor(identifier, params);
