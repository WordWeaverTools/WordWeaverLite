import json
import yaml 
from types import SimpleNamespace

class ConfigParser:
    def __init__(self, config_file):
        self.file = config_file
        self.config = None

        self.c_str = "[CONFIG] "
        self.fatal = "[✖FATAL✖] "
        self.warn = "[WARNING] "
        self.ws_str = " "*len("[CONFIG] ")

        self.readConfigFile()
        self.setDefaults()
        self.validateConfig()


    def readConfigFile(self):
        with open(self.file, "r", encoding="utf-8") as file:
            if self.file.endswith(".json"):
                load_obj = json.load(file)
            elif self.file.endswith(".yaml") or self.file.endswith(".yml"):    
                load_obj = yaml.safe_load(file)
            load_str = json.dumps(load_obj)
            self.config = json.loads(load_str, object_hook=lambda d: SimpleNamespace(**d))
        return 


    def setDefaults(self):
        '''
        
        '''
        self.required_fields = {
            'inputFile': {
                "path": 'Data/inputfile.csv',
                "format": "csv"
            }, 
            'result': {
                "name": "text",
                "delimiter": "_",
                "breakdown": False,
                "label": False,
                "order": [],
            }
        }

        self.optional_fields = {
            "categoryOrder": None,
            "categories": SimpleNamespace(),
            "autoPlace": False,
            "toolTip": False,
            "test": False,
            "replace": {},
        }

        return
    

    def validateConfig(self):
        provided_fields = set(vars(self.config).keys())
        missing_fields = set(self.required_fields.keys()) - provided_fields
        if missing_fields:
            print(f"{self.c_str}{self.warn} Provided configuration file `{self.file}` is missing one or more required fields. The following fields will be set to their default:")
            for field in missing_fields:
                if not hasattr(self.config, field):
                    print(f"\t{self.ws_str}* `{field}` not provided. Defaulting to {self.required_fields[field]}")
                    self.config[field] = SimpleNamespace(**self.required_fields[field])


        # Validate inputFile
        self.validateInputFile()

        # Validate result
        self.validateResult()

        return



    def validateInputFile(self):
        # Validate inputFile
        if not hasattr(self.config.inputFile, "path"):
            print(f"{self.c_str}{self.fatal}inputFile missing `path` field. Check configuration file.\n")
            exit()
        try:
            f = open(self.config.inputFile.path, 'r')
            f.close()
        except OSError:
            print(f"{self.c_str}{self.fatal}inputFile '{self.config.inputFile.path}' does not exist.\n")
            exit()


    def validateResult(self):
        if not set(self.required_fields["result"].keys()).issubset(set(vars(self.config.result))):
            missing = set(self.required_fields["result"].keys())-(set(vars(self.config.result)))
            print(f"{self.c_str}{self.warn}`result` field missing required information. Setting to defaults:")
            for m in missing:
                print(f"\t{self.ws_str}* `{m}`: `{self.required_fields['result'][m]}`")
                if isinstance(self.required_fields["result"][m], dict):
                    setattr(self.config.result, m, SimpleNamespace(**self.required_fields["result"][m]))
                else:
                    setattr(self.config.result, m, self.required_fields["result"][m])

        if not self.config.result.order:
            self.config.result.order.append(self.config.result.name)
            if hasattr(self.config.result, "subResult"):
                self.config.result.order += [sr.name for sr in self.config.result.subResult]

        print(self.config.result)

