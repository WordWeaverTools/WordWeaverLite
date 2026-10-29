from types import SimpleNamespace

class ResultBuilder:

    def __init__(self,attr_dict_list:list,dict_list:list,config) -> None:
        self.attr_dict_list = attr_dict_list
        self.dict_list = dict_list
        self.delimiter = config.result.delimiter
        self.result = SimpleNamespace(**config.result.__dict__)


    def execute(self):
        formatted, ordered_by = self.build_items()
        classorder = self.combine(formatted)
        return self.dict_list, classorder
    

    def build_items(self):
        ordered_by = ("breakdown","label")
        formatted = dict()
        for attr in self.attr_dict_list:
            id = attr[self.result.name]["id"]
            formatted[id] = {style_class:[] for style_class in self.result.order}
            for resultclass in self.result.order:
                for a in ordered_by:
                    formatted[id][resultclass].append(attr[resultclass][a].split(self.delimiter))
            
        return formatted, ordered_by
    

    def combine(self,formatted:dict):
        classorder = tuple(self.result.order)
        for d in self.dict_list:
            result = formatted[d[self.result.name]]
            d[classorder] = [result[key] for key in classorder]


        return classorder