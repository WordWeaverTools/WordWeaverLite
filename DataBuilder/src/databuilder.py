from tree_builder import TreeBuilder
from csv_to_dict import CSVtoDict
from option_builder import OptionBuilder
from JSON_test import TESTS
from tooltip import *
from color_selector import ColourSelector
import sys
import json
from arg_parsing import ArgParsing
from file_read_write import FileReadWrite
from result_builder import ResultBuilder
from config_parser import ConfigParser
from copy import deepcopy


class DataBuilder:
    
    def __init__(self) -> None:
        self.tree_order = None
        self.conjugation_order = None
        self.config = None
        self.JSON_path = "JSON/"
        self.color_path = ""
        self.result = "text"
        self.delimiter = "_"
        self.config_file = "config/config.example.json"


    def execute(self):

        print("\n[ARG PARSE] Parsing Command Line Arguments...")
        config_file = ArgParsing().argsCheck()
        if config_file:
            self.config_file = config_file
        print("[ARG PARSE] Success ✓\n")
        #
        print("[CONFIG] Parsing Configuration File...")
        self.config = ConfigParser(self.config_file).config
        print("[CONFIG] Success ✓\n")


        # If the files should be autoplaced, this is where they go
        # if arguments.args.autoplace: 
        if hasattr(self.config, "autoPlace"):
            if self.config.autoPlace:
                self.JSON_path = "../VerbApp/src/assets/JSON/"
                self.colour_path = "../VerbApp/src/theme/"

        # If a tooltips file was requested, create the template
        # TODO: This needs to be moved to last so that there is a tree order to go off if incase none was provided
        # if hasattr(self.config, "toolTip"):
        #     makeToolTips(tree_order, self.JSON_path)
        
        # TODO: This needs to be redone as well. 
        # If the colors were requested, create the template with default or provided colors.
        # if arguments.args.colour:
        #     # If the colours were provided by the user
        #     if colour_info:
        #         # The name of a colour gradient from seaborn was provided
        #         if len(colour_info) == 1 and "#" not in colour_info[0]:
        #             colour_info = colour_info[0]
        #         ColourSelector(tree_order, self.colour_path,colour_info)
        #     #otherwise the default will be used
        #     else:
        #         ColourSelector(tree_order, self.colour_path)

        tree_order = self.buildFiles()
        FileReadWrite.reorderJSON(tree_order, self.JSON_path)

        if hasattr(self.config, "test"):
                if self.config.test:
                    TESTS.runtests(self.JSON_path)

        print("Complete. See {} folder for output.".format(self.JSON_path))



    def buildFiles(self):
        '''
        
        '''
        print("[CSVtoDict] Initial data cleaning and structuring from input file...")
        category_ids, attributes_by_category, information_order = CSVtoDict(self.config).execute()
        print("[CSVtoDict] Success ✓\n")
        
        print("[OptionBuilder] Creating and ordering information.json file...")
        information = OptionBuilder(attributes_by_category, information_order, self.JSON_path)
        print("[OptionBuilder] Success ✓\n")
        
        print("[ResultBuilder] Combining and ordering results...")
        rb = ResultBuilder(attributes_by_category, category_ids, self.config)
        dict_list, result_key = rb.execute()
        print("[ResultBuilder] Success ✓\n")

        tree_order = list(self.config.categoryOrder) + [result_key]
        print("[TreeBuilder] Creating ordered data tree...")
        TreeBuilder(dict_list, "conjugation.json", tree_order, self.JSON_path)#
        print("[TreeBuilder] Success ✓\n")

        return tree_order



    








