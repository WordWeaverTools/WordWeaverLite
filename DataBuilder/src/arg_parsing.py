import argparse

class ArgParsing:

    def __init__(self):
        self.parser = None
        self.args = None
        self.parseArgs()

    def parseArgs(self):
        '''
        Establishes argument options.
        Populates attributes self.parser and self.args
        '''
        self.parser = argparse.ArgumentParser()
        self.parser.add_argument("-f","--file_config", dest="config_file", help="Configuration File. See config/ for examples. Must be either JSON or YAML/YML format.", required=False)
        # self.parser.add_argument("-o", "--order", dest="order", help="In-app category order")
        # self.parser.add_argument("-tt", "--tooltip", dest="tooltip", default=False, help="Autogenerate tooltip json file", action="store_true")
        # self.parser.add_argument("-c", "--colour", dest="colour", default=False, help="Autogenerate colours in scss file", action="store_true")
        # self.parser.add_argument("--auto-place", dest="autoplace", default=False, help="Automatically places variable.scss and JSON folders in correct paths", action="store_true")
        # self.parser.add_argument("--test", dest="test", default=False, help="Runs basic tests about the created JSON files.", action="store_true")

        self.args = self.parser.parse_args()    


    def argsCheck(self):
        """Checks the validity of the files given in the arguments.

        Returns:
            None or Config File
        """

        #Validate config file
        if self.args.config_file:
            self.args.config_file = self.args.config_file.strip()
            self.checkFileExists(self.args.config_file, "Config")
            self.checkFileFormat(self.args.config_file, "Config")
            return self.args.config_file

        return 
    

    def checkFileExists(self,file:str, filetype:str):
        """Checks if the files given exist

        Args:
            file (str): path of the file to check
            filetype (str): type of file for error message
        """

        try:
            f = open(file, 'r')
            f.close()
        except OSError:
            print("[ARG PARSE] [✖FATAL✖] {} file '{}' does not exist.".format(filetype,file))
            exit()


    def checkFileFormat(self,file:str,filetype:str):
        """Ensure the file given is a delimiter seperated value file.

        Args:
            file (str): path of the file to check
            filetype (str): type of the file for error message
        """

        if not file.lower().endswith("json") and not file.lower().endswith("yaml") and not file.lower().endswith("yml"):
            print("[ARG PARSE] [✖FATAL✖] {} file '{}' MUST be a JSON or YAML/YML file.".format(filetype,file))
            exit()