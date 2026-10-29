// TODO: Double check

import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { node } from '../../models/node.model';

// Mock JSON imports
jest.mock('../../../assets/JSON/conjugation.json', () => ({
  default: [
    ['level1', 'level2', 'level3'],
    { root: { child1: ['id1', 'id2'], child2: ['id3'] } }
  ]
}));

jest.mock('../../../assets/JSON/information.json', () => ({
  default: [
    {
      name: 'Category1',
      children: [
        { translation: 'trans1', id: 'id1', base: 'base1', type_color: 'red' },
        { translation: 'trans2', id: 'id2', base: 'base2' }
      ]
    },
    {
      name: 'Category2',
      children: [{ translation: 'trans3', id: 'id3', base: 'base3' }]
    }
  ]
}));

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Constructor initialization', () => {
    it('should load conjugations from JSON', () => {
      expect(service.conjugations).toBeDefined();
      expect(Array.isArray(service.conj_order)).toBe(true);
    });

    it('should initialize tree with root node', () => {
      expect(service.tree).toBeDefined();
      expect(service.tree.getRoot()).toBeDefined();
      expect(service.tree.getRoot()).toBeInstanceOf(node);
    });

    it('should set first category as not disabled', () => {
      expect(service.setinformation[0].disabled).toBe(false);
    });

    it('should add empty type_color to children without it', () => {
      const childWithoutColor = service.setinformation[0].cat.find(c => c.id === 'id2');
      expect(childWithoutColor?.type_color).toBe('');
    });

    it('should preserve existing type_color values', () => {
      const childWithColor = service.setinformation[0].cat.find(c => c.id === 'id1');
      expect(childWithColor?.type_color).toBe('red');
    });
  });

  describe('loadInformation()', () => {
    beforeEach(() => {
      service.setinformation = [];
      service.loadInformation();
    });

    it('should populate setinformation array', () => {
      expect(service.setinformation.length).toBe(2);
    });

    it('should map category names correctly', () => {
      expect(service.setinformation[0].name).toBe('Category1');
      expect(service.setinformation[1].name).toBe('Category2');
    });

    it('should set all categories as disabled initially', () => {
      service.setinformation.forEach(cat => {
        expect(cat.disabled).toBe(true);
      });
    });

    it('should set all categories as closed initially', () => {
      service.setinformation.forEach(cat => {
        expect(cat.open).toBe(false);
      });
    });

    it('should map child properties correctly', () => {
      const firstChild = service.setinformation[0].cat[0];
      expect(firstChild.translation).toBe('trans1');
      expect(firstChild.id).toBe('id1');
      expect(firstChild.base).toBe('base1');
      expect(firstChild.type_color).toBe('red');
    });
  });

  describe('buildTree()', () => {
    let rootNode: node;

    beforeEach(() => {
      rootNode = new node('testRoot');
    });

    it('should handle array input (leaf level)', () => {
      const leafArray = ['leaf1', 'leaf2', 'leaf3'];
      service.buildTree(leafArray, rootNode);

      const children = rootNode.getChildren();
      expect(children.length).toBe(3);
      expect(children[0]).toBeInstanceOf(node);
      expect(children[2]).toBeInstanceOf(node);
    });

    it('should handle nested object structure', () => {
      const treeObj = {
        parent1: { child1: ['leaf1'], child2: ['leaf2'] },
        parent2: ['leaf3']
      };
      service.buildTree(treeObj, rootNode);

      const topChildren = rootNode.getChildren();
      expect(topChildren.length).toBe(2);
      expect(topChildren[0]).toBeInstanceOf(node);
    });

    it('should create proper parent-child relationships', () => {
      const treeObj = { parent: { child: ['leaf'] } };
      service.buildTree(treeObj, rootNode);

      const parent = rootNode.getChildren()[0];
      const child = parent.getChildren()[0];
      const grandchild = child.getChildren()[0];

      expect(parent).toBeInstanceOf(node);
      expect(child).toBeInstanceOf(node);
      expect(grandchild).toBeInstanceOf(node);
    });

    it('should handle empty array', () => {
      service.buildTree([], rootNode);
      expect(rootNode.getChildren().length).toBe(0);
    });

    it('should handle empty object', () => {
      service.buildTree({}, rootNode);
      expect(rootNode.getChildren().length).toBe(0);
    });

    it('should handle undefined values in tree object', () => {
      const treeObj = { key1: undefined, key2: 'string_value' };
      expect(() => service.buildTree(treeObj, rootNode)).not.toThrow();
    });
  });

  describe('conjugate()', () => {
    let mockNodePath: any;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const mockFinalNode = {
        getChildren: jest.fn().mockReturnValue([
          { id: [null, ['morph1', 'morph2'], ['type1', 'type2']] },
          { id: [null, ['morph3'], ['type3']] }
        ])
      };

      mockNodePath = {
        [service.conj_order[service.conj_order.length - 2]]: mockFinalNode
      };
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should return array of results', () => {
      const results = service.conjugate(mockNodePath);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
    });

    it('should create morpheme pairs correctly', () => {
      const results = service.conjugate(mockNodePath);

      expect(results[0].length).toBe(2);
      expect(results[0][0]).toEqual(['morph1', 'type1']);
      expect(results[0][1]).toEqual(['morph2', 'type2']);
    });

    it('should handle single morpheme results', () => {
      const results = service.conjugate(mockNodePath);

      expect(results[1].length).toBe(1);
      expect(results[1][0]).toEqual(['morph3', 'type3']);
    });

    it('should handle empty children array', () => {
      const emptyNode = {
        getChildren: jest.fn().mockReturnValue([])
      };
      mockNodePath = {
        [service.conj_order[service.conj_order.length - 2]]: emptyNode
      };

      const results = service.conjugate(mockNodePath);
      expect(results.length).toBe(0);
    });

    it('should log debug information', () => {
      service.conjugate(mockNodePath);

      expect(consoleSpy).toHaveBeenCalledWith('final_node', expect.any(Object));
      expect(consoleSpy).toHaveBeenCalledWith('result_ids', expect.any(Array));
    });
  });
});
