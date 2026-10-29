import json
import os, re
import sys

class OptionBuilder:

    def __init__(self, attr_dict_list, app_order, path):
        """
        Class creates individual JSON files containing all elements of the individual options, 
        with no duplicates

        Args:
            dict_list (list): List of dictionaries 
        """

        self.attr_dict_list = attr_dict_list
        self.category_attributes = {}
        self.app_order = app_order
        self.path = path
        self.removeDupes()
        self.writeAttr()


    def removeDupes(self):
        """
        Removes duplicates by adding each element to its respective dictionary attr set
        """

        for d in self.attr_dict_list:
            for attr in d:
                self.category_attributes.setdefault(attr,set()).add(tuple(d[attr].items()))

        for key in self.category_attributes:
            self.category_attributes[key] = [dict(t) for t in self.category_attributes[key]]

        

    def writeAttr(self):
        """
        Creates each file using the attr dictionary where each key has a set of unique values.
        Files are saved to the 'data' folder.
        """
        if not os.path.exists(self.path):
            os.makedirs(self.path)
        output_file = self.path+"information.json"
        categories = {}
        for category in self.category_attributes:
            if category not in self.app_order:
                continue
            tojson = {"name":category, "children":[]}
            for attribute in self.category_attributes[category]:
                tojson["children"].append(attribute)
            tojson["children"] = sorted(tojson["children"], key=lambda k: k['id'])
            categories[category] =  tojson

        information_json = [categories[category] for category in self.app_order]

        with open(output_file, 'w') as json_file:
            json.dump(information_json, json_file, indent=4,ensure_ascii=False)


   