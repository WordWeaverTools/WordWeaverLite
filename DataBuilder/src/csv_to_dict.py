import csv
import sys
import textdistance, re

class CSVtoDict:

    def __init__(self, config):
        """Initalizes relevant variables.

        Args:
            input_file (str): Input CSV file to be read and turned into a list 
            of python dictionaries.
        """
        self.input_file = config.inputFile.path 
        self.order = config.categoryOrder
        self.delimiter = config.headerDelimiter
        self.text_replace = config.replace
        self.full_tree_order = self.order + config.result.order
        self.list_of_dicts = []
        self.attributes_by_category = []
        self.category_ids = []
        self.headers = []

        

    def execute(self):
        self.cleanData()

        self.validateCategoryOrder()
        self.validateCategoryOrder()
        self.replaceAttributeValueText()

        return self.category_ids, self.attributes_by_category, self.order


    def cleanData(self):
        """Read the CSV, normalize header names, and store rows."""

        with open(self.input_file, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            self.headers = [
                re.sub(r"\s*,\s*", ",", header.lower())
                for header in (reader.fieldnames or [])
            ]

            self.list_of_dicts = [
                {
                    re.sub(r"\s*,\s*", ",", key.lower()): value
                    for key, value in row.items()
                }
                for row in reader
            ]
        self.removeDupe()

        
    def removeDupe(self):
        """
        Removes duplicate dictionary entries from the list.
        """
        self.list_of_dicts = [dict(t) for t in {tuple(d.items()) for d in self.list_of_dicts}]
        return 
    


    def validateCategoryOrder(self):
        """
        """

        possible_categories = {col_name for col_name in self.headers if self.delimiter not in col_name}
        if self.order:
            for cat in self.order:
                if cat not in possible_categories:
                    print("------------------")
                    print(f"[CSV_TO_DICT] [FATAL ERROR]\n{cat} - Invalid column name. Check order file.")
                    mispelt = list()
                    for poss in possible_categories:
                        if textdistance.levenshtein(cat, poss) <=2:
                            mispelt.append(poss)
                    if mispelt:
                        print("Did you mean: {}?\n".format(", ".join(mispelt)))
                    print("------------------")
                    sys.exit()

            
        else:
            self.order = possible_categories

                   
        return 


    def validateCategoryOrder(self):
        """
        Attributes of the primary categories are redundant in the final tree. They should be removed before the tree is made.
        """
        
        for row in self.list_of_dicts:
            id_only = {}
            category_attributes = {}
            for column in row:
                if column in self.full_tree_order: 
                    id_only[column] = row[column]
                    category_attributes.setdefault(column, {}).setdefault("id", row[column])

                elif self.delimiter in column and column.split(self.delimiter)[0] in self.full_tree_order:
                    category, attribute = column.split(self.delimiter)
                    category_attributes.setdefault(category, {}).setdefault(attribute, row[column])

   
            self.category_ids.append(id_only)
            self.attributes_by_category.append(category_attributes)


    def replaceAttributeValueText(self):
        replacements = self.text_replace.__dict__.items()

        for item in self.attributes_by_category:
            for attributes in item.values():
                for attr, value in attributes.items():
                    if attr != "id":
                        for pattern, new in replacements:
                            value = re.sub(pattern, new, value)
                        attributes[attr] = value

        return



                

