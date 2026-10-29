import itertools
import re, os
import sys
import json
import numpy

class TreeBuilder:

    def __init__(self, input_dict, output_file, ordered_keys, path):
        """Class takes a list of dictionaries and creates a tree data structure through dictionaries.
        Calls tree builder function.

        Args:
            input_dict (list): List of dictionaries
            output_file (str): Tree output file name
            ordered_keys (list): List of key names, if user specified
        """
        self.input_dict = input_dict
        self.output_file = output_file
        self.keys = ordered_keys
        self.path = path
        self.toTree()
        self.duplicates = set()
        

    def toTree(self):
        """
        Function does the following:
        1. Ensures that the tree order submitted is valid
        2. Calls tree builder function
        3. Writes tree to output file
        """
        tree = {}
        if not self.keys:
            self.keys = list(self.input_dict[0].keys())
        if len(self.keys) == 1:
            tree = []
        for datum in self.input_dict: # Going through each dictionary in new list
            path = [datum[key] for key in self.keys]
            self.recursiveTree(tree, path, 0)

        if not os.path.exists(self.path):
            os.makedirs(self.path)

        self.output_file = self.path + self.output_file
        with open(self.output_file, 'w') as json_file:
            json.dump(tree, json_file, sort_keys=True)

        return


    def recursiveTree(self, tree, path, index):
        """
        Recursively creates a Tree data structure for the given data, in the given order.

        Args:
            tree (dict or list): Tree at different levels, list if it's the last level.
            path (dict): Dictionary where the keys are column titles from a delimiter seperated value file.
            index (int): Index of position of keys array, denoting which level of the tree is current

        Returns:
            None
        """
        if path[index] not in tree: # If this node is not currently at this level, add it
            if index == (len(path) - 1): # if current level is the last level

                base = path[index]
                tree.append(base) # add it to the last level list
            
                
                return # move on to next path

            elif index == (len(path) - 2): # else if current level is second last level
                tree[path[index]] = [] # add it to dictionary with empty list value (i.e. the last level)

            else: # if any other level
                tree[path[index]] = {} # add it to dictionary with empty dictionary value for the next level.

        if index < (len(path) - 1):
            self.recursiveTree(tree[path[index]], path, index+1) #if this node *is* at the current level, check if next node is at next level.
        
        return 
