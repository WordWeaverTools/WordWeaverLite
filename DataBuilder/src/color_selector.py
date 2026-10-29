import seaborn as sns
import matplotlib.pyplot as plt
from colormap import hex2rgb, rgb2hls, hls2rgb, rgb2hex
from copy import deepcopy


class ColourSelector:

    def __init__(self, categories, path,hex_colours=None):
        '''
        
        '''

        self.individual = ".ion-color-{0} {{\n\t--ion-color-base: var(--ion-color-{0});\n\t--ion-color-base-rgb: var(--ion-color-{0}-rgb);\n\t--ion-color-contrast: var(--ion-color-{0}-contrast);\n\t--ion-color-contrast-rgb: var(--ion-color-{0}-contrast-rgb);\n\t--ion-color-shade: var(--ion-color-{0}-shade);\n\t--ion-color-tint: var(--ion-color-{0}-tint);\n}}"
        self.root_entry = {"color":{"hex":'--ion-color-{}: {}', "rgb":'--ion-color-{}-rgb: {}'}, "contrast":{"hex":'--ion-color-{}-contrast: {}', "rgb":'--ion-color-{}-contrast-rgb: {}'}, "shade":{"hex":'--ion-color-{}-shade: {}'}, "tint":{"hex":'--ion-color-{}-tint: {}'}}
        self.categories = categories
        self.hex_colours = hex_colours
        self.path = path



        if not self.hex_colours:
            self.chooseColours(len(self.categories))

        elif isinstance(self.hex_colours, str):
            self.chooseColours(len(self.categories), self.hex_colours)

        else:
            if len(self.categories) > len(self.hex_colours):
                print("ERROR: {} colours provided but {} colours are required. SeaBorn palette 'rockert_r' will be used instead.".format(len(self.hex_colours), len(self.categories)))
                self.chooseColours(len(self.categories))

        content = self.buildSCSSContents()
        self.writeToSCSS(content)


    def chooseColours(self, quant, palette="rocket_r"):
        '''
        
        '''
        try:
            colours = sns.color_palette(palette, quant)
        except:
            print("ERROR: '{}' is not a Seaborn palette. Palette 'rocker_r' used instead.\nSee https://seaborn.pydata.org/tutorial/color_palettes.html for more info on Seaborn Palettes.".format(palette))
            colours = sns.color_palette("rocket_r", quant)
        sns.palplot(colours)
        self.hex_colours = list(colours.as_hex())


    def contrast(self, hex_str):

        (R, G, B) = (hex_str[1:3], hex_str[3:5], hex_str[5:])

        if 1 - (int(R, 16) * 0.299 + int(G, 16) * 0.587 + int(B, 16) * 0.114) / 255< 0.5:
            return "#000"
        else: 
            return "#fff"


    def buildSCSSContents(self):
        '''
        
        '''

        prtstr = ""

        for i in range(len(self.categories)):
            colour = self.hex_colours[i]
            cat = self.categories[i]
            root = deepcopy(self.root_entry)
            rgb = hex2rgb(colour)

            root["color"]["hex"] = root["color"]["hex"].format(cat, colour)
            formatrgb = "{},{},{}".format(rgb[0],rgb[1],rgb[2])
            root["color"]["rgb"] = root["color"]["rgb"].format(cat, formatrgb)

            contrast_colour = self.contrast(colour)
            root["contrast"]["hex"] = root["contrast"]["hex"].format(cat, contrast_colour)
            root["contrast"]["rgb"] = root["contrast"]["rgb"].format(cat, hex2rgb(contrast_colour))

            c = rgb2hls(rgb[0], rgb[1], rgb[2], normalised=False)
            tint = hls2rgb(c[0], c[1], min(c[2]+.1,1,1))
            
            tint = rgb2hex(tint[0], tint[1], tint[2], normalised=True)
            root['tint']['hex'] = root['tint']['hex'].format(cat, tint)
            
            shade = hls2rgb(c[0], c[1], max(c[2]-.1, 0))
            shade = rgb2hex(shade[0], shade[1], shade[2], normalised=True)
            root['shade']['hex'] = root['shade']['hex'].format(cat, shade)

            prtstr += "\n"
            for key in root:
                for key2 in root[key]:
                    prtstr+= "\t\t"+ root[key][key2] + ";\n"

        prtstr += "}\n\n"
        
        
        for cat in self.categories:
            prtstr += self.individual.format(cat)
            prtstr += "\n\n"

        return prtstr


    def writeToSCSS(self, prtstr):
        '''
        
        '''

        with open("DataBuilder/src/variables_template.scss", 'r') as vars:
            top = vars.read()

        with open(self.path+"variables.scss", 'w') as vars:
            vars.write(top + prtstr)


    




    