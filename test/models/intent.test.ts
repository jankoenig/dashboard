/// <reference path='../../typings/globals/chai/index.d.ts' />
/// <reference path='../../typings/globals/mocha/index.d.ts' />

import { Intent } from '../../src/models/intent';
import { expect } from 'chai';

describe('Intent', function() {
  describe('constructor', function() {
    it('should set the name', function() {
      let intent = new Intent('name');
      expect(intent.name).to.eq('name');
    });
    it('should create an empty array of utterances', function() {
      let intent = new Intent('name');
      expect(intent.utterances).to.exist
      expect(intent.utterances).to.empty
    });
    it('should serialize to JSON', function() {
      let intent = new Intent('name');
      let json = JSON.stringify(intent);
      expect(json).to.exist;
    });
  });
  describe('setters', function() {
    it('should set the description', function() {
      let intent = new Intent('name');
      intent.description = 'description';

      expect(intent.name).to.eq('name');
      expect(intent.description).to.eq('description');
    });
  });
});
