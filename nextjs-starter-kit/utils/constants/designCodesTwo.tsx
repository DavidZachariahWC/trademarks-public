interface DesignCodeCategory {
    code: string;
    description: string;
  }
  
  interface DesignCodeDivision {
    code: string;
    description: string;
    category: string;
    guidelines?: string[];
  }
  
  interface DesignCodeSection {
    code: string;
    description: string;
    division: string;
    guidelines?: string;
    excludes?: string;
  }
  
  interface DesignCode {
    category: DesignCodeCategory;
    division: DesignCodeDivision;
    section: DesignCodeSection;
  }
  
  // Categories (XX)
  export const designCodeCategories: Record<string, DesignCodeCategory> = {
    "01": { code: "01", description: "Celestial bodies, natural phenomena, geographical maps" },
    "02": { code: "02", description: "Human beings" },
    "03": { code: "03", description: "Animals" },
    "04": { code: "04", description: "Supernatural beings, mythological or legendary beings, fantastical beings or unidentifiable beings" },
    "05": { code: "05", description: "Plants" },
    "06": { code: "06", description: "Scenery" },
    "07": { code: "07", description: "Dwellings, buildings, monuments, stadiums, fountains, structural works and building materials" },
    "08": { code: "08", description: "Foodstuff" },
    "09": { code: "09", description: "Textiles, clothing, headwear, footwear and sewing accessories" },
    "10": { code: "10", description: "Tobacco, smokers\' materials; fans; toilet articles; medical devices and apparatus including tablets, capsules or powders" },
    "11": { code: "11", description: "Household utensils" },
    "12": { code: "12", description: "Furniture and plumbing fixtures" },
    "13": { code: "13", description: "Lighting, cooking, heating, cooling or refrigeration equipment" },
    "14": { code: "14", description: "Hardware, tools and ladders; non-motorized agricultural implements; keys and locks" },
    "15": { code: "15", description: "Machines and parts thereof, including industrial agricultural, home and office machines; electrical equipment" },
    "16": { code: "16", description: "Telecommunications, sound recording or reproduction equipment; photography, cinematography and optics" },
    "17": { code: "17", description: "Horological instruments and parts; jewelry; weights and measures" },
    "18": { code: "18", description: "Transport; equipment for animals; traffic signs" },
    "19": { code: "19", description: "Baggage, containers and bottles" },
    "20": { code: "20", description: "Writing, drawing or painting materials, office materials, stationery and books" },
    "21": { code: "21", description: "Games, toys and sporting articles" },
    "22": { code: "22", description: "Musical instruments and their accessories; bells; sculptures" },
    "23": { code: "23", description: "Arms, ammunition and armor" },
    "24": { code: "24", description: "Heraldry, flags, crowns, crosses, arrows and symbols" },
    "25": { code: "25", description: "Ornamental framework, surfaces or backgrounds with ornaments" },
    "26": { code: "26", description: "Geometric figures and solids" },
    "27": { code: "27", description: "Forms of writing" },
    "28": { code: "28", description: "Inscriptions in various characters" },
    "29": { code: "29", description: "Miscellaneous" }
  }
  
  // Divisions (XX.YY)
  export const designCodeDivisions: Record<string, DesignCodeDivision> = {
    "01.01": { 
      code: "01.01", 
      description: "Stars, comets",
      category: "01",
      guidelines: [
        "Stars include asterisks (*) and compass points.",
        "Stars and asterisks (*) used as small, inconspicuous design elements functioning as punctuation or parts of letters should only be coded in 29.01.07.",
        "Many star designs are cross-coded in the appropriate section(s) of Division 01.01 and in an appropriate section of Category 26 (Geometric figures and solids).",
        "Stars grouped in circles, semi-circles, ovals or other geometric figures are coded in 01.03.03 exclusively. Do not code these designs in 01.01.",
        "Stars in flags are not coded in 01.01. Flags are coded in 24.09. Stars in shields or medals are not coded in 01.01. Shields are coded in 24.01 and medals are coded in 24.07."
      ]
    },
    "01.03": { 
      code: "01.03", 
      description: "Constellations, starry sky",
      category: "01",
      guidelines: [
        "Some marks consist of stars that form a geometric shape and also have an individual star that creates a separate commercial impression. These marks are coded in both 01.03.02 and the appropriate code for the individual star."
      ]
    },
    "01.05": { 
      code: "01.05", 
      description: "Sun",
      category: "01"
    },
    "01.07": { 
      code: "01.07", 
      description: "Globes",
      category: "01",
      guidelines: [
        "A globe is a spherical representation of the earth that often bears an outline of continents and/or meridian and/or parallel lines on its surface. But see 01.07.04 for flattened globes.",
        "Partial globes are considered whole globes."
      ]
    },
    "01.09": { 
      code: "01.09", 
      description: "Planets, asteroids, meteors, the solar system and atomic or molecular models",
      category: "01",
      guidelines: ["The earth (01.07) is not coded in 01.09."]
    },
    "01.11": { 
      code: "01.11", 
      description: "Moons",
      category: "01",
      guidelines: [
        "Many moon designs are also coded in Category 26.",
        "Many rising or setting moons are coded in 01.05.01. In many instances, the drawing appears to be an unidentifiable rising or setting celestial body."
      ]
    },
    "01.15": { 
      code: "01.15", 
      description: "Natural phenomena",
      category: "01"
    },
    "01.17": {
      code: "01.17",
      description: "Maps or outlines of continents, countries and other geographical areas",
      category: "01",
      guidelines: ["Globes (01.07) are not coded in 01.17"]
    },
    "02.01": { code: "02.01", description: "Men", category: "02" },
    "02.03": { code: "02.03", description: "Women", category: "02" },
    "02.05": { code: "02.05", description: "Children", category: "02" },
    "02.07": { code: "02.07", description: "Groups of humans", category: "02" },
    "02.09": { code: "02.09", description: "Humans depicted engaging in activities", category: "02" },
    "02.11": { code: "02.11", description: "Parts of the human body, skeletons, skulls", category: "02" },
    "03.01": { code: "03.01", description: "Cats, dogs, wolves, foxes, bears, lions, tigers", category: "03" },
    "03.03": { code: "03.03", description: "Elephants, hippos, rhinos, giraffes, alpacas, camels, llamas", category: "03" },
    "03.05": { code: "03.05", description: "Horses, donkeys, zebras", category: "03" },
    "03.07": { code: "03.07", description: "Bovines, deer, antelopes, goats, sheep, pigs, cows, bulls, buffalo, moose", category: "03" },
    "03.09": { code: "03.09", description: "Rodents, kangaroos, and other small mammals, not including cats and dogs", category: "03" },
    "03.11": { code: "03.11", description: "Primates other than humans, such as monkeys and gorillas", category: "03" },
    "03.13": { code: "03.13", description: "Parts of the body (excluding heads) of mammals and primates other than humans; Animal skeletons; Animal skulls; Horns of animals; Claws, paws, and nail marks of animals other than birds", category: "03" },
    "03.15": { code: "03.15", description: "Birds, bats", category: "03" },
    "03.17": { code: "03.17", description: "Parts of birds; Nests and birdhouses; Eggs in nests", category: "03" },
    "03.19": { code: "03.19", description: "Fish, whales, seals, and the like, and other underwater animals", category: "03" },
    "03.21": { code: "03.21", description: "Amphibians and reptiles, including frogs, snakes, lizards, and turtles", category: "03" },
    "03.23": { code: "03.23", description: "Insects, spiders, micro-organisms", category: "03" },
    "04.01": { code: "04.01", description: "Winged or horned personages, fairies, supernatural beings, mythological or legendary personages", category: "04" },
    "04.03": { code: "04.03", description: "Beings partly human and partly animal", category: "04" },
    "04.05": { code: "04.05", description: "Mythological or legendary animals", category: "04" },
    "04.07": { code: "04.07", description: "Plants, objects or geometric figures representing a person or an animal", category: "04" },
    "04.09": { code: "04.09", description: "Masks", category: "04" },
    "05.01": { code: "05.01", description: "Trees, bushes", category: "05" },
    "05.03": { code: "05.03", description: "Leaves, branches with leaves or needles; needles", category: "05" },
    "05.05": { code: "05.05", description: "Flowers", category: "05" },
    "05.07": { code: "05.07", description: "Grain, nuts, seeds", category: "05" },
    "05.09": { code: "05.09", description: "Fruits", category: "05" },
    "05.11": { code: "05.11", description: "Vegetables", category: "05" },
    "05.13": { code: "05.13", description: "Other plants", category: "05" },
    "05.15": { code: "05.15", description: "Decorations made of plants", category: "05" },
    "06.01": { code: "06.01", description: "Mountains, rocks, caves", category: "06" },
    "06.03": { code: "06.03", description: "Scenery with water, rivers or streams", category: "06" },
    "06.05": { code: "06.05", description: "Desert Scenery", category: "06" },
    "06.07": { code: "06.07", description: "Urban scenery or village scenes", category: "06" },
    "06.09": { code: "06.09", description: "Other scenery", category: "06" },
    "07.01": { code: "07.01", description: "Dwellings, cages or kennels", category: "07" },
    "07.03": { code: "07.03", description: "Buildings", category: "07" },
    "07.05": { code: "07.05", description: "Interiors and interior parts of dwellings or buildings", category: "07" },
    "07.07": { code: "07.07", description: "Exteriors and exterior parts of dwellings or buildings", category: "07" },
    "07.09": { code: "07.09", description: "Monuments, stadiums, fountains", category: "07" },
    "07.11": { code: "07.11", description: "Structural works", category: "07" },
    "07.13": { code: "07.13", description: "Billboards, signs", category: "07" },
    "07.15": { code: "07.15", description: "Building Materials", category: "07" },
    "08.01": { code: "08.01", description: "Baked goods", category: "08" },
    "08.03": { code: "08.03", description: "Candies", category: "08" },
    "08.05": { code: "08.05", description: "Sandwiches", category: "08" },
    "08.07": { code: "08.07", description: "Dairy products", category: "08" },
    "08.09": { code: "08.09", description: "Frozen confections, ice", category: "08" },
    "08.11": { code: "08.11", description: "Meat and fish products", category: "08" },
    "08.13": { code: "08.13", description: "Other foodstuffs", category: "08" },
    "09.01": { code: "09.01", description: "Textiles other than clothing", category: "09" },
    "09.03": { code: "09.03", description: "Clothing", category: "09" },
    "09.05": { code: "09.05", description: "Headwear", category: "09" },
    "09.07": { code: "09.07", description: "Footwear", category: "09" },
    "09.09": { code: "09.09", description: "Sewing accessories and equipment; patterns for dressmaking", category: "09" },
    "10.01": { code: "10.01", description: "Tobacco, smokers' materials, matches", category: "10" },
    "10.03": { code: "10.03", description: "Fans, canes, umbrellas", category: "10" },
    "10.05": { code: "10.05", description: "Toilet articles, grooming devices, mirrors", category: "10" },
    "10.07": { code: "10.07", description: "Medical devices and apparatus", category: "10" },
    "10.09": { code: "10.09", description: "Medicines; medical and nonmedical products in tablet, capsule or powder form", category: "10" },
    "11.01": { code: "11.01", description: "Knives, forks, spoons; kitchen utensils (Non-electric)", category: "11" },
    "11.03": { code: "11.03", description: "Containers for beverages; plates and dishes; cooking and serving ware (Non-electric)", category: "11" },
    "11.05": { code: "11.05", description: "Small electric kitchen appliances", category: "11" },
    "11.07": { code: "11.07", description: "Cutlery", category: "11" },
    "11.09": { code: "11.09", description: "Miscellaneous household utensils", category: "11" },
    "12.01": { code: "12.01", description: "Furniture Including: Office furniture", category: "12" },
    "12.03": { code: "12.03", description: "Plumbing fixtures", category: "12" },
    "13.01": { code: "13.01", description: "Lighting equipment", category: "13" },
    "13.03": { code: "13.03", description: "Cooking, heating or refrigeration equipment", category: "13" },
    "14.01": { code: "14.01", description: "Tubes, cables, heavy hardware articles", category: "14" },
    "14.03": { code: "14.03", description: "Small hardware articles, springs", category: "14" },
    "14.05": { code: "14.05", description: "Tools (hand and power)", category: "14" },
    "14.07": { code: "14.07", description: "Non-motorized agricultural or horticultural implements", category: "14" },
    "14.09": { code: "14.09", description: "Ladders", category: "14" },
    "14.11": { code: "14.11", description: "Keys for locks; locks", category: "14" },
    "15.01": { code: "15.01", description: "Machines for industry or agriculture; industrial installations; motors; engines; various mechanical appliances", category: "15" },
    "15.03": { code: "15.03", description: "Household machines, appliances", category: "15" },
    "15.05": { code: "15.05", description: "Computer devices and office and business machines", category: "15" },
    "15.07": { code: "15.07", description: "Wheels, bearings", category: "15" },
    "15.09": { code: "15.09", description: "Electrical equipment", category: "15" },
    "16.01": { code: "16.01", description: "Telecommunications and sound recording or reproduction equipment", category: "16" },
    "16.03": { code: "16.03", description: "Photography, cinematography, optics", category: "16" },
    "17.01": { code: "17.01", description: "Time-measuring instruments", category: "17" },
    "17.03": { code: "17.03", description: "Jewelry", category: "17" },
    "17.05": { code: "17.05", description: "Scales, weights", category: "17" },
    "17.07": { code: "17.07", description: "Measuring instruments", category: "17" },
    "18.01": { code: "18.01", description: "Vehicles propelled by animal power", category: "18" },
    "18.03": { code: "18.03", description: "Land vehicles propelled by human power", category: "18" },
    "18.05": { code: "18.05", description: "Land motor vehicles", category: "18" },
    "18.07": { code: "18.07", description: "Vehicles for use on water; amphibious vehicles", category: "18" },
    "18.09": { code: "18.09", description: "Air or space vehicles", category: "18" },
    "18.11": { code: "18.11", description: "Parts of land vehicles, water vehicles or air vehicles", category: "18" },
    "18.13": { code: "18.13", description: "Equipment for animals", category: "18" },
    "18.15": { code: "18.15", description: "Traffic signs", category: "18" },
    "19.01": { code: "19.01", description: "Baggage, portfolios, pocketbooks, wallets", category: "19" },
    "19.03": { code: "19.03", description: "Animal containers", category: "19" },
    "19.05": { code: "19.05", description: "Large containers", category: "19" },
    "19.07": { code: "19.07", description: "Small containers", category: "19" },
    "19.09": { code: "19.09", description: "Bottles, jars, flasks", category: "19" },
    "19.11": { code: "19.11", description: "Parts or accessories of bottles, jars and flasks", category: "19" },
    "19.13": { code: "19.13", description: "Receptacles for laboratory use", category: "19" },
    "20.01": { code: "20.01", description: "Writing, drawing or painting materials, small office materials", category: "20" },
    "20.03": { code: "20.03", description: "Paper goods, documents", category: "20" },
    "20.05": { code: "20.05", description: "Books, magazines, newspapers", category: "20" },
    "21.01": { code: "21.01", description: "Games, toys", category: "21" },
    "21.03": { code: "21.03", description: "Sporting articles, merry-go-rounds", category: "21" },
    "22.01": { code: "22.01", description: "Musical instruments and their accessories", category: "22" },
    "22.03": { code: "22.03", description: "Bells", category: "22" },
    "22.05": { code: "22.05", description: "Sculptures", category: "22" },
    "23.01": { code: "23.01", description: "Weapons", category: "23" },
    "23.03": { code: "23.03", description: "Firearms, ammunition, explosives", category: "23" },
    "23.05": { code: "23.05", description: "Armor (wearable)", category: "23" },
    "24.01": { code: "24.01", description: "Shields, crests", category: "24" },
    "24.03": { code: "24.03", description: "Emblems, insignia", category: "24" },
    "24.05": { code: "24.05", description: "Seals", category: "24" },
    "24.07": { code: "24.07", description: "Coins, medals", category: "24" },
    "24.09": { code: "24.09", description: "Flags, banners", category: "24" },
    "24.11": { code: "24.11", description: "Crowns", category: "24" },
    "24.13": { code: "24.13", description: "Crosses", category: "24" },
    "24.15": { code: "24.15", description: "Arrows", category: "24" },
    "24.17": { code: "24.17", description: "Notational signs and symbols", category: "24" },
    "24.19": { code: "24.19", description: "Signs and symbols associated with electronic and computerized devices", category: "24" },
    "24.21": { code: "24.21", description: "Signs and symbols associated with travel and mapping", category: "24" },
    "25.01": { code: "25.01", description: "Framework", category: "25" },
    "25.03": { code: "25.03", description: "Repeated figurative elements or inscriptions", category: "25" },
    "26.01": { code: "26.01", description: "Circles", category: "26" },
    "26.03": { code: "26.03", description: "Ovals", category: "26" },
    "26.05": { code: "26.05", description: "Triangles", category: "26" },
    "26.07": { code: "26.07", description: "Diamonds", category: "26" },
    "26.09": { code: "26.09", description: "Squares", category: "26" },
    "26.11": { code: "26.11", description: "Rectangles", category: "26" },
    "26.13": { code: "26.13", description: "Quadrilaterals", category: "26" },
    "26.15": { code: "26.15", description: "Polygons (geometric figures with five or more sides)", category: "26" },
    "26.17": { code: "26.17", description: "Lines, bands, bars, chevrons and angles", category: "26" },
    "26.19": { code: "26.19", description: "Geometrical solids", category: "26" },
    "27.01": { code: "27.01", description: "Letters or numerals including punctuation, forming figurative elements", category: "27" },
    "27.03": { code: "27.03", description: "Figurative elements forming representations of letters or numerals, including punctuation", category: "27" },
    "27.05": { code: "27.05", description: "Illegible signatures", category: "27" },
    "28.01": { code: "28.01", description: "Inscriptions", category: "28" },
    "28.02": { code: "28.02", description: "Other forms of communication", category: "28" },
    "29.01": { code: "29.01", description: "Miscellaneous", category: "29" },
    "29.02": { code: "29.02", description: "Single color used on the entire surface of the goods or on items use in rendering the services", category: "29" },
    "29.03": { code: "29.03", description: "Single color used on a portion of the goods or on a portion of items used in rendering the services", category: "29" },
    "29.04": { code: "29.04", description: "Single color used on packaging or labels for goods or in signs, advertisements or like matter for services", category: "29" },
    "29.05": { code: "29.05", description: "Multiple colors used on the entire surface of the goods or on items used in rendering the services", category: "29" },
    "29.06": { code: "29.06", description: "Multiple colors used on a portion of the goods or on a portion of the items used in rendering the services", category: "29" },
    "29.07": { code: "29.07", description: "Multiple colors used on packaging or labels for goods or on signs, advertisements or like matter for services", category: "29" }
    // do not apply your edits here. Your additions to the sections shouldbe in the getDesignSections function below.
} // do not apply your edits here. Your additions to the sections shouldbe in the getDesignSections function below.
  
  // Helper function to get division code
  export function getDivisionCode(categoryCode: string, divisionCode: string): string {
    return `${categoryCode}.${divisionCode}`;
  }
  
  // Helper function to get section code
  export function getSectionCode(categoryCode: string, divisionCode: string, sectionCode: string): string {
    return `${categoryCode}.${divisionCode}.${sectionCode}`;
  }
  
  // Helper function to format design code description
  export function getDesignCodeDescription(code: string): string {
    const [categoryCode, divisionCode, sectionCode] = code.split('.');
    
    if (!categoryCode || !divisionCode || !sectionCode) {
      return 'Invalid design code format';
    }
  
    const category = designCodeCategories[categoryCode];
    const division = designCodeDivisions[getDivisionCode(categoryCode, divisionCode)];
    const section = designCodeSections[getSectionCode(categoryCode, divisionCode, sectionCode)];
  
    if (!category || !division || !section) {
      return 'Design code not found';
    }
  
    return `${code} - {${category.description}; ${division.description}; ${section.description}}`;
  }
  
  // Sections (XX.YY.ZZ) will be added in subsequent updates
  export const designCodeSections: Record<string, DesignCodeSection> = {
    "01.01.01": {
      code: "01.01.01",
      description: "Stars with three points",
      division: "01.01"
    },
    "01.01.02": {
      code: "01.01.02",
      description: "A single star with four points",
      division: "01.01",
      guidelines: "Code more than one star with four points in 01.01.12."
    },
    "01.01.03": {
      code: "01.01.03",
      description: "A single star with five points",
      division: "01.01",
      guidelines: "Code more than one star with five points in 01.01.13."
    },
    "01.01.04": {
      code: "01.01.04",
      description: "A single star with six points",
      division: "01.01",
      guidelines: "Code more than one star with six points in 01.01.14."
    },
    "01.01.05": {
      code: "01.01.05",
      description: "Stars with seven or more points",
      division: "01.01"
    },
    "01.01.06": {
      code: "01.01.06",
      description: "Stars with rays or radiating lines",
      division: "01.01",
      guidelines: "Rays or radiating lines are not points of the stars."
    },
    "01.01.07": {
      code: "01.01.07",
      description: "Stars with tails or comets",
      division: "01.01"
    },
    "01.01.08": {
      code: "01.01.08",
      description: "Stars representing a human face or head of an animal",
      division: "01.01",
      guidelines: "A star representing a human face or the head of an animal is not cross-coded with humans in category 02, with animals in category 03 or in any other section in 01.01."
    },
    "01.01.09": {
      code: "01.01.09",
      description: "Two stars",
      division: "01.01"
    },
    "01.01.10": {
      code: "01.01.10",
      description: "Three or more stars",
      division: "01.01"
    },
    "01.01.11": {
      code: "01.01.11",
      description: "Incomplete stars",
      division: "01.01",
      guidelines: "An incomplete star should be coded with the appropriate stars in sections 01.01.01 through 01.01.05. When coding in the appropriate section, complete the star if you can determine the number of points. Otherwise do not double code."
    },
    "01.01.12": {
      code: "01.01.12",
      description: "More than one star with four points",
      division: "01.01",
      guidelines: "A single star with four points is coded in 01.01.02."
    },
    "01.01.13": {
      code: "01.01.13",
      description: "More than one star with five points",
      division: "01.01",
      guidelines: "A single star with five points is coded in 01.01.03."
    },
    "01.01.14": {
      code: "01.01.14",
      description: "More than one star with six points",
      division: "01.01",
      guidelines: "A single star with six points is coded in 01.01.04."
    },
    "01.03.01": {
      code: "01.03.01",
      description: "Big Dipper, Little Dipper",
      division: "01.03"
    },
    "01.03.02": {
      code: "01.03.02",
      description: "Other constellations",
      division: "01.03"
    },
    "01.03.03": {
      code: "01.03.03",
      description: "Stars grouped in circles, semi-circles, ovals or geometric figures",
      division: "01.03",
      guidelines: "Stars grouped in geometric figures are in 01.03.03 and in the appropriate section of Category 26 (Geometric figures and solids).",
      excludes: "Stars grouped in geometric figures in 01.03.03 are not coded in 01.01."
    },
    "01.03.04": {
      code: "01.03.04",
      description: "Starry sky, including galaxies",
      division: "01.03",
      guidelines: "Multiple stars in the sky or an expanse of space above the earth are in 01.03.04. Multiple stars which are not depicted in the sky are in Division 01.01."
    },
    "01.05.01": {
      code: "01.05.01",
      description: "Sun, rising or setting (partially exposed or partially obstructed)",
      division: "01.05",
      guidelines: [
        "Suns coded in this section are not coded in 01.05.04 (suns with rays) or 01.05.03 (suns with a human or an animal face).",
        "Many rising or setting globes, moons or planets are coded in this section. In many instances the drawing appears to be an unidentifiable rising or setting celestial body."
      ].join("\n"),
      excludes: "A rising sun with a face is coded in 01.05.03."
    },
    "01.05.03": {
      code: "01.05.03",
      description: "Sun representing a human face or an animal",
      division: "01.05",
      guidelines: "A sun representing a human face or an animal is not cross-coded with humans in Category 02, with animals in Category 03 or in any other section in 01.05."
    },
    "01.05.04": {
      code: "01.05.04",
      description: "Suns with rays",
      division: "01.05",
      guidelines: "Suns coded in this section are not coded in 01.05.01 (suns rising or setting).",
      excludes: "Suns with rays and a face are coded in 01.05.03."
    },
    "01.05.25": {
      code: "01.05.25",
      description: "Other representations of the sun",
      division: "01.05",
      guidelines: "This section is exclusive. If a sun is assigned the code 01.05.25, it should not have any other code in 01.05."
    },
    "01.07.01": {
      code: "01.07.01",
      description: "Globes with outlines of continents",
      division: "01.07",
      guidelines: "A globe that contains both continents and meridians and parallels is in 01.07.01."
    },
    "01.07.02": {
      code: "01.07.02",
      description: "Globes with meridians and parallel lines only",
      division: "01.07",
      excludes: "Globes with continents and meridians and/or parallels are not coded in 01.07.02."
    },
    "01.07.04": {
      code: "01.07.04",
      description: "Flattened or squashed globes",
      division: "01.07",
      guidelines: [
        "A flattened or squashed globe is a globe that appears to have been cut or flattened but still retains its spherical quality.",
        "See 01.17.14 for guidelines about maps."
      ].join("\n")
    },
    "01.07.05": {
      code: "01.07.05",
      description: "Globes held by a human",
      division: "01.07",
      guidelines: "Do not cross-code globes held by humans with any other section in 01.07."
    },
    "01.07.06": {
      code: "01.07.06",
      description: "Globes forming human face or part of a human body",
      division: "01.07",
      guidelines: "Do not cross-code globes forming or formed by humans with any other section in 01.07 or in Category 02."
    },
    "01.07.07": {
      code: "01.07.07",
      description: "Globes with rings or orbits",
      division: "01.07"
    },
    "01.07.08": {
      code: "01.07.08",
      description: "Globes with bars, bands, or wavy lines, excluding meridian or parallel lines",
      division: "01.07"
    },
    "01.07.25": {
      code: "01.07.25",
      description: "Other globes",
      division: "01.07",
      guidelines: "This section is exclusive. If a globe is assigned code 01.07.25, it should not have any other code in 01.07."
    },
    "01.09.01": {
      code: "01.09.01",
      description: "Saturn or other planets with rings",
      division: "01.09",
      excludes: "Globes with rings or orbits (01.07.07) are not coded in 01.09.01."
    },
    "01.09.03": {
      code: "01.09.03",
      description: "Models or representations of the solar system, other astronomic orbits, such as a moon or satellite orbiting a planet",
      division: "01.09"
    },
    "01.09.05": {
      code: "01.09.05",
      description: "Atoms or molecular models",
      division: "01.09",
      guidelines: "This section does not include DNA helixes. Code DNA helixes in 26.01.26."
    },
    "01.09.25": {
      code: "01.09.25",
      description: "Other planets, asteroids, meteors",
      division: "01.09",
      guidelines: "This section is exclusive. If a planet, asteroid or meteor is assigned code 01.09.25, it should not have any other code in 01.09."
    },
    "01.11.01": {
      code: "01.11.01",
      description: "Full moons",
      division: "01.11",
      guidelines: "Do not code a moon with craters (01.11.25) in this section."
    },
    "01.11.02": {
      code: "01.11.02",
      description: "Partial moons, including half moons and crescent moons",
      division: "01.11",
      guidelines: "Do not code a moon with craters (01.11.25) in this section."
    },
    "01.11.03": {
      code: "01.11.03",
      description: "Moons representing a human face",
      division: "01.11",
      guidelines: "Do not cross-code a moon representing a human face with any other code in 01.11 or in Category 02."
    },
    "01.11.25": {
      code: "01.11.25",
      description: "Other representations of the moon or moons, including moons with craters",
      division: "01.11",
      guidelines: [
        "This section is exclusive. If a moon is assigned code 01.11.25, it should not have any other code in 01.11.",
        "A moon representing a human face that has craters should be coded in 01.11.03."
      ].join("\n")
    },
    "01.15.01": {
      code: "01.15.01",
      description: "Rainbows",
      division: "01.15",
      guidelines: "If highly stylized, rainbows may also be found in Category 26, semi-circles (26.01.05) or curved lines (26.17.09)."
    },
    "01.15.02": {
      code: "01.15.02",
      description: "Lightning or electricity",
      division: "01.15",
      guidelines: "Sparks depicted as jagged lines similar in appearance to lightning are in 01.15.02 exclusively."
    },
    "01.15.03": {
      code: "01.15.03",
      description: "Flames",
      division: "01.15",
      guidelines: "Specific 13.01.02); Flames emanating from objects, numbers or words in 01.15.15; Flames in fireplaces are in 07.05.07; and Flames emanating from candles are in 13.01.01.",
      excludes: "Torch"
    },
    "01.15.04": {
      code: "01.15.04",
      description: "Sparks, sparkles, explosions",
      division: "01.15",
      excludes: "Sparks depicted as jagged lines similar in appearance to lightning are coded in 01.15.02."
    },
    "01.15.05": {
      code: "01.15.05",
      description: "Smoke, steam and vapor",
      division: "01.15"
    },
    "01.15.06": {
      code: "01.15.06",
      description: "Clouds, fog",
      division: "01.15"
    },
    "01.15.07": {
      code: "01.15.07",
      description: "Rain, hail, sleet or snow depicted in a storm",
      division: "01.15",
      excludes: "Clear representations of multiple drops are coded in 01.15.18."
    },
    "01.15.08": {
      code: "01.15.08",
      description: "A single drop (including a single raindrop or a single teardrop)",
      division: "01.15",
      guidelines: "Clear representations of a single drop are in 01.15.08. Large numbers of small drops or broken lines merely intended to represent rain are in 01.15.07.\nMultiple drops are coded in 01.15.18."
    },
    "01.15.09": {
      code: "01.15.09",
      description: "Snowflakes, snow crystals",
      division: "01.15",
      excludes: "Snow-covered landscapes (06.09.06) and snow appearing on top of letters (01.15.14) are not coded in 01.15.09."
    },
    "01.15.10": {
      code: "01.15.10",
      description: "Icicles, stalactites, stalagmites",
      division: "01.15"
    },
    "01.15.11": {
      code: "01.15.11",
      description: "Bubbles, foamy masses",
      division: "01.15"
    },
    "01.15.12": {
      code: "01.15.12",
      description: "Whirlpools, tornadoes and cyclones",
      division: "01.15"
    },
    "01.15.13": {
      code: "01.15.13",
      description: "Single wave of water",
      division: "01.15",
      excludes: "Multiple waves, open sea and stretches of water without shore (06.03.03) are not coded in 01.15.13."
    },
    "01.15.14": {
      code: "01.15.14",
      description: "Snow or ice appearing on top of letters",
      division: "01.15"
    },
    "01.15.15": {
      code: "01.15.15",
      description: "Flames emanating from objects, numbers or words",
      division: "01.15",
      excludes: "Distinctive flames in fireplaces, on candles or Bunsen burners"
    },
    "01.15.17": {
      code: "01.15.17",
      description: "Thought or speech clouds either empty or with wording and/or punctuation",
      division: "01.15"
    },
    "01.15.18": {
      code: "01.15.18",
      description: "More than one drop including teardrops or raindrops",
      division: "01.15"
    },
    "01.15.24": {
      code: "01.15.24",
      description: "Sound waves, including designs depicting sound",
      division: "01.15"
    },
    "01.15.25": {
      code: "01.15.25",
      description: "Other natural phenomena and observable events",
      division: "01.15",
      guidelines: "This section is exclusive. If a design is assigned code 01.15.25, it should not have any other code in 01.15 assigned to the same phenomena.",
      excludes: "Including: Light rays, sand, dust, lumps of coal, spilling or pouring liquids or water such as puddles."
    },
    "01.17.01": {
      code: "01.17.01",
      description: "Europe",
      division: "01.17"
    },
    "01.17.02": {
      code: "01.17.02",
      description: "Asia",
      division: "01.17"
    },
    "01.17.03": {
      code: "01.17.03",
      description: "North America",
      division: "01.17"
    },
    "01.17.04": {
      code: "01.17.04",
      description: "South America",
      division: "01.17"
    },
    "01.17.05": {
      code: "01.17.05",
      description: "Africa",
      division: "01.17"
    },
    "01.17.06": {
      code: "01.17.06",
      description: "Australia",
      division: "01.17"
    },
    "01.17.08": {
      code: "01.17.08",
      description: "United States",
      division: "01.17"
    },
    "01.17.09": {
      code: "01.17.09",
      description: "Other countries",
      division: "01.17"
    },
    "01.17.11": {
      code: "01.17.11",
      description: "States of the United States",
      division: "01.17",
      guidelines: "Maps of single states and groups of states are in 01.17.11.",
      excludes: "Maps of Texas are coded in 01.17.12."
    },
    "01.17.12": {
      code: "01.17.12",
      description: "State of Texas",
      division: "01.17"
    },
    "01.17.13": {
      code: "01.17.13",
      description: "Maps of islands",
      division: "01.17",
      guidelines: "See islands in 06.03.02."
    },
    "01.17.14": {
      code: "01.17.14",
      description: "World maps",
      division: "01.17",
      guidelines: [
        "A world map is a flat representation of the earth depicting at least two hemispheres (including or excluding Antarctica). If only one hemisphere is depicted, each continent is coded separately.",
        "World maps are distinguished from flattened or squashed globes (01.07.04) since they do not retain the spherical quality of a globe."
      ].join("\n")
    },
    "01.17.25": {
      code: "01.17.25",
      description: "Maps or outlines of other geographical areas, such as cities, bodies of water and counties within states",
      division: "01.17"
    },

    // ... divisions 02 through 25

    "26.01.01": {
      code: "26.01.01",
      description: "Circles as carriers or as single line borders",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "If a circle is coded as a carrier or a single line border, the drawing should not have any other code in 26.01. If there are multiple circles, one of which is a carrier or a border, the significant circular element will be coded. The carrier or border will not be coded."
      ].join("\n"),
      excludes: "Carriers and borders do not include plain single line circles (26.01.02)"
    },
    "26.01.02": {
      code: "26.01.02",
      description: "Plain single line circles Including: A solid white circle in another design element. For example, a solid white circle in a square",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
      excludes: "Single line circles do not include concentric circles (26.01.17 and 26.01.18) or circles as carriers or as single line borders (26.01.01)"
    },
    "26.01.03": {
      code: "26.01.03",
      description: "Incomplete circles (more than semi-circles)",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "Circles whose borders are broken by words, letters or design elements are not incomplete."
      ].join("\n"),
      excludes: "Incomplete circles do not include entire circles made of broken or dotted lines (26.01.05)"
    },
    "26.01.04": {
      code: "26.01.04",
      description: "Circles with two breaks or divided in the middle",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.01.05": {
      code: "26.01.05",
      description: "Circles made of broken or dotted lines Including: Circles with more than two breaks",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.01.06": {
      code: "26.01.06",
      description: "Semi-circles",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "A semi-circle is a mark which resembles a half-circle. The mark may be an object or arrangement of objects in the shape of a 'half-circle'."
      ].join("\n")
    },
    "26.01.07": {
      code: "26.01.07",
      description: "Circles with a decorative border, including scalloped, ruffled and zig-zag edges",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.01.08": {
      code: "26.01.08",
      description: "Letters, numerals or punctuation forming or bordering the perimeter of a circle",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.01.09": {
      code: "26.01.09",
      description: "Geometric figures, objects, humans, plants or animals forming or bordering the perimeter of a circle",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "This section is cross-coded with the specific section(s) for the objects, humans, plants or animals which form or border the perimeter the circle."
      ].join("\n")
    },
    "26.01.11": {
      code: "26.01.11",
      description: "Letters, numerals, punctuation, geometric figures, objects, humans, plants or animals comprising a circle",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "This section is cross-coded with the specific section(s) for the objects, humans, plants or animals which comprise the circle.",
        "If a design falling in this section is surrounded by a circle, do not cross-code the design as concentric circles (26.01.17 and 26.01.18) or as a circle within a circle (26.01.20)."
      ].join("\n")
    },
    "26.01.12": {
      code: "26.01.12",
      description: "Circles with bars, bands and lines",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
      excludes: "Lining for color is not considered a bar, band or line unless the color comprises a bar, band or line."
    },
    "26.01.13": {
      code: "26.01.13",
      description: "Two circles",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
      excludes: "Concentric circles (26.01.17 and 26.01.18) and circles within a circle (26.01.20) are not considered two circles for coding."
    },
    "26.01.15": {
      code: "26.01.15",
      description: "Three circles",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
      excludes: "Concentric circles (26.01.17 and 26.01.18) and circles within a circle (26.01.20) are not considered three circles for purposes of coding."
    },
    "26.01.16": {
      code: "26.01.16",
      description: "Circles touching or intersecting",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "Designs coded in this section must be cross-referenced with 26.01.13 or 26.01.15."
      ].join("\n")
    },
    "26.01.17": {
      code: "26.01.17",
      description: "Two concentric circles",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "Concentric circles share a common center."
      ].join("\n"),
      excludes: "Concentric circles are not coded as two circles (26.01.13) unless there is more than one concentric circle."
    },
    "26.01.18": {
      code: "26.01.18",
      description: "Three or more concentric circles",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "Concentric circles share a common center."
      ].join("\n"),
      excludes: "Concentric circles are not coded as three or more circles (26.01.15) unless there are more than one concentric circle."
    },
    "26.01.20": {
      code: "26.01.20",
      description: "Circles within a circle",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "Circles within a circle do not share a common center."
      ].join("\n"),
      excludes: "Circles within a circle are not coded as two and three or more circles (26.01.13 and 26.01.15)."
    },
    "26.01.21": {
      code: "26.01.21",
      description: "Circles that are totally or partially shaded",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.01.26": {
      code: "26.01.26",
      description: "Spirals, coils and swirls",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
      excludes: "Helixes are coded in 26.01.29"
    },
    "26.01.27": {
      code: "26.01.27",
      description: "Circles containing irregular exterior lining or elements not amounting to a decorative border",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "This section is for a design which is generally circular but has additional elements; a circle plus."
      ].join("\n")
    },
    "26.01.28": {
      code: "26.01.28",
      description: "Miscellaneous circular designs with an irregular circumference",
      division: "26.01",
      guidelines: [
        "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04).",
        "This section is for designs which look somewhat like a circle."
      ].join("\n")
    },
    "26.01.29": {
      code: "26.01.29",
      description: "Helixes",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.01.30": {
      code: "26.01.30",
      description: "Four Circles Including: Multiple concentric circles or circles within circles should be coded",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.01.31": {
      code: "26.01.31",
      description: "Five or more circles Including: Multiple concentric circles or circles within circles should be coded",
      division: "26.01",
      guidelines: "The term circle refers to semi-circles except in reference to carriers or borders (26.01.01), incomplete circles (26.01.03) and circles with two breaks (26.01.04)."
    },
    "26.03.01": {
      code: "26.03.01",
      description: "Ovals as carriers and single line borders",
      division: "26.03",
      guidelines: [
        "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
        "If an oval is coded as a carrier or a single line border, the drawing should not have any other code in 26.03. If there are multiple ovals, one of which is a carrier or border, the significant ovals should be coded. The carrier or border will not be coded."
      ].join("\n"),
      excludes: "Plain single line ovals (26.03.02)"
    },
    "26.03.02": {
      code: "26.03.02",
      description: "Plain single line ovals Including: A solid white oval in another design element. For example, a solid white oval in a square",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
      excludes: "Single line ovals do not include concentric ovals (26.03.17) or ovals as carriers or single line borders (26.03.01)"
    },
    "26.03.03": {
      code: "26.03.03",
      description: "Incomplete ovals",
      division: "26.03",
      guidelines: [
        "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
        "Ovals whose borders are broken by words, letters or design elements are not incomplete."
      ].join("\n"),
      excludes: "Incomplete ovals do not include entire ovals made of broken or dotted lines (26.03.05)"
    },
    "26.03.04": {
      code: "26.03.04",
      description: "Ovals with two breaks or divided in the middle",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape."
    },
    "26.03.05": {
      code: "26.03.05",
      description: "Ovals made of broken or dotted lines Including: Ovals made of broken or dotted lines include ovals with more than two breaks",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape."
    },
    "26.03.07": {
      code: "26.03.07",
      description: "Ovals with a decorative border, including scalloped, ruffled and zig-zag edges",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape."
    },
    "26.03.08": {
      code: "26.03.08",
      description: "Letters, numerals or punctuation forming the perimeter of an oval or bordering the perimeter of an oval",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape."
    },
    "26.03.09": {
      code: "26.03.09",
      description: "Geometric figures, objects, humans, plants or animals forming the perimeter of an oval or bordering the perimeter of an oval",
      division: "26.03",
      guidelines: [
        "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
        "This section is cross-coded with the specific section(s) for the objects, humans, plants or animals which form or border the perimeter of the oval."
      ].join("\n")
    },
    "26.03.11": {
      code: "26.03.11",
      description: "Letters, numerals, punctuation, geometric figures, objects, humans, plants or animals comprising an oval",
      division: "26.03",
      guidelines: [
        "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
        "This section is cross-coded with the specific section(s) for the objects, humans, plants or animals which comprise the oval.",
        "If a design falling in this section is surrounded by an oval, do not cross-code the design as concentric ovals (26.03.17)."
      ].join("\n")
    },
    "26.03.12": {
      code: "26.03.12",
      description: "Ovals with bars, bands or lines",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape."
    },
    "26.03.13": {
      code: "26.03.13",
      description: "Two ovals",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
      excludes: "Concentric ovals 26.03.17 are not considered two ovals for coding."
    },
    "26.03.14": {
      code: "26.03.14",
      description: "Three or more ovals",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
      excludes: "Concentric ovals 26.03.17 are not considered three or more ovals for coding."
    },
    "26.03.16": {
      code: "26.03.16",
      description: "Ovals touching or intersecting",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape."
    },
    "26.03.17": {
      code: "26.03.17",
      description: "Concentric ovals and ovals within ovals",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
      excludes: "Concentric ovals are not coded as two ovals (26.03.13)."
    },
    "26.03.21": {
      code: "26.03.21",
      description: "Ovals that are completely or partially shaded",
      division: "26.03",
      guidelines: "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape."
    },
    "26.03.28": {
      code: "26.03.28",
      description: "Miscellaneous designs with overall oval shape, including amoeba-like shapes and irregular ovals",
      division: "26.03",
      guidelines: [
        "The term oval refers to a geometric shape that resembles an ellipse or an egg in shape.",
        "This section is for designs which look somewhat like an oval."
      ].join("\n"),
      excludes: "Rectangles with curved sides (26.11.25). For example, if the design has two straight sides and two curved sides, the design should be coded as a rectangle with curved sides or as an oblong shape."
    },
    "26.05.01": {
      code: "26.05.01",
      description: "Triangles as borders or carriers",
      division: "26.05",
      guidelines: [
        "Chevrons or other V-shaped patterns are coded in 26.17.12.",
        "If a triangle is coded as a carrier or a border, the drawing should not have any other code in 26.05. If there are multiple triangles, one of which is a carrier or border, the significant triangle should be coded. The carrier or border will not be coded."
      ].join("\n")
    },
    "26.05.02": {
      code: "26.05.02",
      description: "Plain single line triangles Including: Triangles with slightly rounded corners and a solid white triangle in another design element. For example, a solid white triangle in a square",
      division: "26.05",
      guidelines: "Triangles whose borders are broken by words, letters or designs are not incomplete."
    },
    "26.05.03": {
      code: "26.05.03",
      description: "Incomplete triangles (must have two angles)",
      division: "26.05",
      guidelines: "Triangles whose borders are broken by words, letters or design elements are not incomplete.",
      excludes: "Entire triangles made of broken or dotted lines (26.05.05) are not coded as incomplete triangles."
    },
    "26.05.05": {
      code: "26.05.05",
      description: "Triangles made of broken or dotted lines",
      division: "26.05"
    },
    "26.05.07": {
      code: "26.05.07",
      description: "Triangles with a decorative border, including scalloped, ruffled and zig-zag edges",
      division: "26.05"
    },
    "26.05.08": {
      code: "26.05.08",
      description: "Letters, numerals or punctuation forming the perimeter of a triangle, bordering the perimeter of a triangle or forming a triangle",
      division: "26.05"
    },
    "26.05.09": {
      code: "26.05.09",
      description: "Triangles made of geometric figures, objects, humans, plants or animals",
      division: "26.05",
      guidelines: "This section is cross-coded with the specific section(s) for the objects, humans, plants or animals which either form or border the perimeter or comprise the triangle."
    },
    "26.05.12": {
      code: "26.05.12",
      description: "Triangles with bars, bands and lines",
      division: "26.05"
    },
    "26.05.13": {
      code: "26.05.13",
      description: "Two Triangles",
      division: "26.05",
      excludes: "Triangles inside one another (26.05.20) are not coded as more than one triangle."
    },
    "26.05.14": {
      code: "26.05.14",
      description: "Three triangles",
      division: "26.05"
    },
    "26.05.15": {
      code: "26.05.15",
      description: "Four or more triangles",
      division: "26.05"
    },
    "26.05.16": {
      code: "26.05.16",
      description: "Triangles touching or intersecting",
      division: "26.05"
    },
    "26.05.20": {
      code: "26.05.20",
      description: "Triangles inside other triangles",
      division: "26.05",
      guidelines: [
        "Only a triangle inside another triangle is coded in this section.",
        "A triangle inside another triangle is not coded as more than one triangle. (26.05.13)."
      ].join("\n")
    },
    "26.05.21": {
      code: "26.05.21",
      description: "Triangles that are completely or partially shaded",
      division: "26.05"
    },
    "26.05.25": {
      code: "26.05.25",
      description: "Triangles with one or more curved sides",
      division: "26.05",
      excludes: "Triangle with curved corners (26.05.02) are not coded as triangles with curved sides."
    },
    "26.05.28": {
      code: "26.05.28",
      description: "Miscellaneous designs with overall triangular shape",
      division: "26.05"
    },
    "26.07.01": {
      code: "26.07.01",
      description: "Plain diamonds with single or multiple line borders Including: Diamonds with slightly rounded corners and a solid white diamond in another design element. For example, a solid white diamond in a square",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    },
    "26.07.02": {
      code: "26.07.02",
      description: "Diamonds with decorative borders",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    },
    "26.07.03": {
      code: "26.07.03",
      description: "Incomplete diamonds or divided in the middle",
      division: "26.07",
      guidelines: "Diamonds whose borders are broken by words, letters or design elements are not incomplete.",
      excludes: "Jewelry (17.03)"
    },
    "26.07.12": {
      code: "26.07.12",
      description: "Diamonds with bars, bands and lines",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    },
    "26.07.13": {
      code: "26.07.13",
      description: "Two diamonds",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    },
    "26.07.14": {
      code: "26.07.14",
      description: "Three diamonds",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    },
    "26.07.15": {
      code: "26.07.15",
      description: "Four or more diamonds",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    },
    "26.07.21": {
      code: "26.07.21",
      description: "Diamonds that are completely or partially shaded",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    },
    "26.07.28": {
      code: "26.07.28",
      description: "Miscellaneous designs with overall diamond shape, including letters forming or comprising a diamond",
      division: "26.07",
      excludes: "Jewelry (17.03)"
    }
  } 
  
  
  
  
  
  