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
  }
  
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
  
  // Sections (XX.YY.ZZ)
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
    "02.01.01": {
      code: "02.01.01",
      description: "Heads, portraits, busts of men not in profile",
      division: "02.01",
      guidelines: [
        "This section is limited to designs which reveal only a small portion of the shoulder area of the upper torso.",
        "Heads, portraits, busts of men in profile are in 02.01.37."
      ].join("\n")
    },
    "02.01.02": {
      code: "02.01.02",
      description: "Shadows or silhouettes of men",
      division: "02.01",
      excludes: "Shadows or silhouettes does not include stick figures."
    },
    "02.01.03": {
      code: "02.01.03",
      description: "Men wearing crowns or other symbols of royalty, including kings, princes and jacks",
      division: "02.01"
    },
    "02.01.04": {
      code: "02.01.04",
      description: "Religious figures, men wearing robes, shepherds, monks and priests",
      division: "02.01",
      excludes: "Asian-Pacific men (02.01.11) and wizards (04.01.25) are not coded in this section."
    },
    "02.01.05": {
      code: "02.01.05",
      description: "Famous men",
      division: "02.01",
      guidelines: "This section is limited to famous American historical figures such as Ben Franklin, presidents, etc. This section will include other recognizable American personalities such as Groucho Marx and W. C. Fields."
    },
    "02.01.06": {
      code: "02.01.06",
      description: "Men in colonial dress, Pilgrims, Quakers and colonial militiamen",
      division: "02.01"
    },
    "02.01.07": {
      code: "02.01.07",
      description: "Cowboys, and westerners",
      division: "02.01"
    },
    "02.01.08": {
      code: "02.01.08",
      description: "Frontiersmen, pioneers, mountaineers, trappers and other men wearing buckskins and/or coonskin caps",
      division: "02.01"
    },
    "02.01.09": {
      code: "02.01.09",
      description: "American Indians",
      division: "02.01"
    },
    "02.01.10": {
      code: "02.01.10",
      description: "Spaniards or Mexicans, including men wearing sombreros",
      division: "02.01"
    },
    "02.01.11": {
      code: "02.01.11",
      description: "Asian-Pacific men",
      division: "02.01"
    },
    "02.01.12": {
      code: "02.01.12",
      description: "Romans, Greeks and Egyptians (ancient dress)",
      division: "02.01",
      excludes: "Roman, Greek and other ancient soldiers (02.01.22) are not coded in this section. They are coded in 02.01.13."
    },
    "02.01.13": {
      code: "02.01.13",
      description: "Roman, Greek and other ancient soldiers, gladiators and vikings",
      division: "02.01",
      excludes: "Romans, Greeks and Egyptians (ancient dress) (02.01.12) are not coded in this section."
    },
    "02.01.14": {
      code: "02.01.14",
      description: "Pirates",
      division: "02.01"
    },
    "02.01.15": {
      code: "02.01.15",
      description: "Scottish men and other men wearing kilts",
      division: "02.01"
    },
    "02.01.16": {
      code: "02.01.16",
      description: "Other men wearing folk or historical costumes",
      division: "02.01"
    },
    "02.01.17": {
      code: "02.01.17",
      description: "Clowns, actors, mimes, carnival characters, harlequins, jesters, men wearing tights",
      division: "02.01",
      guidelines: "Cross-reference men in tights, such as Superman or other superheroes, with 04.01.07."
    },
    "02.01.18": {
      code: "02.01.18",
      description: "Farmers, hobos and other men wearing overalls",
      division: "02.01"
    },
    "02.01.19": {
      code: "02.01.19",
      description: "Athletes, strongmen",
      division: "02.01"
    },
    "02.01.20": {
      code: "02.01.20",
      description: "Butchers, chefs, and bakers",
      division: "02.01"
    },
    "02.01.21": {
      code: "02.01.21",
      description: "Waiters, butlers, men wearing tuxedos including magicians",
      division: "02.01",
      guidelines: "Wizards are coded in 04.01.25."
    },

    // ... divisions 02 - 08
    
    "08.01.01": {
      code: "08.01.01",
      description: "Bread including pita bread",
      division: "08.01"
    },
    "08.01.02": {
      code: "08.01.02",
      description: "Slices of bread, with or without spread",
      division: "08.01",
      excludes: "Sandwiches 08.05"
    },
    "08.01.03": {
      code: "08.01.03",
      description: "Rolls, including sweet rolls and biscuits",
      division: "08.01",
      excludes: "Sandwiches 08.05"
    },
    "08.01.04": {
      code: "08.01.04",
      description: "Croissants",
      division: "08.01"
    },
    "08.01.05": {
      code: "08.01.05",
      description: "Cookies including fortune cookies",
      division: "08.01"
    },
    "08.01.06": {
      code: "08.01.06",
      description: "Crackers",
      division: "08.01"
    },
    "08.01.07": {
      code: "08.01.07",
      description: "Pies, pieces of pies, tarts",
      division: "08.01"
    },
    "08.01.08": {
      code: "08.01.08",
      description: "Cakes, cupcakes, muffins",
      division: "08.01"
    },
    "08.01.09": {
      code: "08.01.09",
      description: "Doughnuts, bagels",
      division: "08.01"
    },
    "08.01.10": {
      code: "08.01.10",
      description: "Pretzels",
      division: "08.01"
    },
    "08.01.11": {
      code: "08.01.11",
      description: "Waffles, pancakes, crepes",
      division: "08.01"
    },
    "08.01.12": {
      code: "08.01.12",
      description: "Pizza, slices of pizza",
      division: "08.01"
    },
    "08.01.25": {
      code: "08.01.25",
      description: "Other baked goods, including tortillas, breadsticks and taco shells",
      division: "08.01"
    },
    "08.03.01": {
      code: "08.03.01",
      description: "Chocolate candies including chocolate candy bars",
      division: "08.03"
    },
    "08.03.02": {
      code: "08.03.02",
      description: "Candy on a stick, such as suckers",
      division: "08.03",
      excludes: "Frozen confections on a stick 08.09.03"
    },
    "08.03.03": {
      code: "08.03.03",
      description: "Individually wrapped bite-size candies excluding candy bars",
      division: "08.03",
      guidelines: "Bite-sized wrapped candy is in 08.03.03. Candy in boxes is in 19.07.06. If the outline of the candy in the box is distinctive, it is also in the appropriate section of Division 08.03."
    },
    "08.03.04": {
      code: "08.03.04",
      description: "Candy sticks, candy canes",
      division: "08.03"
    },
    "08.03.25": {
      code: "08.03.25",
      description: "Other candies, including jelly beans, chewing gum and gumdrops",
      division: "08.03"
    },
    "08.05.01": {
      code: "08.05.01",
      description: "Hamburger sandwiches",
      division: "08.05",
      excludes: "Ice cream sandwiches 08.09.02"
    },
    "08.05.02": {
      code: "08.05.02",
      description: "Hotdog sandwiches",
      division: "08.05"
    },
    "08.05.03": {
      code: "08.05.03",
      description: "Submarine, hero, or other sandwiches on an elongated roll",
      division: "08.05"
    },
    "08.05.25": {
      code: "08.05.25",
      description: "Other sandwiches including wraps",
      division: "08.05"
    },
    "08.07.01": {
      code: "08.07.01",
      description: "Whipped cream",
      division: "08.07",
      excludes: "Milk bottles and cartons 11.03.04; milkcans 11.03.05"
    },
    "08.07.02": {
      code: "08.07.02",
      description: "Butter, margarine (including pats, cups, tubs, quarters and other shapes)",
      division: "08.07"
    },
    "08.07.03": {
      code: "08.07.03",
      description: "Cheeses (all shapes, whole and cut)",
      division: "08.07"
    },
    "08.07.25": {
      code: "08.07.25",
      description: "Other dairy products including yogurt",
      division: "08.07",
      excludes: "Ice cream, frozen yogurt 08.09; custards, puddings 08.13.05"
    },
    "08.09.01": {
      code: "08.09.01",
      description: "Ice cream, sherbet and frozen yogurt in cones",
      division: "08.09"
    },
    "08.09.02": {
      code: "08.09.02",
      description: "Ice cream sandwiches",
      division: "08.09"
    },
    "08.09.03": {
      code: "08.09.03",
      description: "Frozen confections on a stick",
      division: "08.09"
    },
    "08.09.04": {
      code: "08.09.04",
      description: "Other forms of ice cream, sherbet and frozen yogurt",
      division: "08.09"
    },
    "08.09.05": {
      code: "08.09.05",
      description: "Ice in block or cube form",
      division: "08.09"
    },
    "08.09.25": {
      code: "08.09.25",
      description: "Other frozen confections and ice",
      division: "08.09"
    },
    "08.11.01": {
      code: "08.11.01",
      description: "Ham, legs of lamb, roasts",
      division: "08.11"
    },
    "08.11.02": {
      code: "08.11.02",
      description: "Chops, steaks",
      division: "08.11"
    },
    "08.11.03": {
      code: "08.11.03",
      description: "Sausage, salami, hot dogs",
      division: "08.11",
      guidelines: "Whole or partial tubes of sausage, salami and hot dogs are in 08.11.03. Images depicting only sliced meat or cold cuts are in 08.11.04. If the image contains both tubes or partial tubes of meat and meat slices, then it is double coded in 08.11.03 and 08.11.04.",
      excludes: "Hot dog sandwiches 08.05.02"
    },
    "08.11.04": {
      code: "08.11.04",
      description: "Sliced meat, cold cuts",
      division: "08.11",
      guidelines: "See Specific Guideline 08.11.03 for coding sliced meat."
    },
    "08.11.05": {
      code: "08.11.05",
      description: "Fowl-cooked or prepared for eating",
      division: "08.11"
    },
    "08.11.06": {
      code: "08.11.06",
      description: "Fish and sea-food products cooked or prepared for eating",
      division: "08.11"
    },
    "08.11.25": {
      code: "08.11.25",
      description: "Other meat or fish products",
      division: "08.11"
    },
    "08.13.01": {
      code: "08.13.01",
      description: "Macaroni, other pasta",
      division: "08.13"
    },
    "08.13.02": {
      code: "08.13.02",
      description: "Eggs, in shell",
      division: "08.13"
    },
    "08.13.03": {
      code: "08.13.03",
      description: "Eggs, cooked",
      division: "08.13"
    },
    "08.13.04": {
      code: "08.13.04",
      description: "Fruit and vegetable salads, cooked fruit",
      division: "08.13"
    },
    "08.13.05": {
      code: "08.13.05",
      description: "Custards, puddings",
      division: "08.13"
    },
    "08.13.06": {
      code: "08.13.06",
      description: "Popped popcorn",
      division: "08.13",
      excludes: "Corn kernels 05.07.25"
    },
    "08.13.25": {
      code: "08.13.25",
      description: "Other foodstuffs including snack foods",
      division: "08.13"
    },
    "09.01.01": {
      code: "09.01.01",
      description: "Thread and wool (wound or unwound), including thread on spools and skeins of yarn",
      division: "09.01"
    },
    "09.01.02": {
      code: "09.01.02",
      description: "Stitches and embroidery including crocheted stitches and loose weaving but excluding stitches or embroidery on clothing pockets",
      division: "09.01",
      guidelines: "The following designs are not in 20.03.06 (Tags and labels)."
    },
    "09.01.03": {
      code: "09.01.03",
      description: "Lace, doilies",
      division: "09.01"
    },
    "09.01.04": {
      code: "09.01.04",
      description: "Ribbons, bows",
      division: "09.01",
      excludes: "Prize ribbons (24.07.07)"
    },
    "09.01.05": {
      code: "09.01.05",
      description: "Tablecloths and napkins (paper or textile)",
      division: "09.01"
    },
    "09.01.06": {
      code: "09.01.06",
      description: "Sheets, pillowcases",
      division: "09.01"
    },
    "09.01.07": {
      code: "09.01.07",
      description: "Bedspreads, cushions, pillows, comforters, blankets, bed pads",
      division: "09.01"
    },
    "09.01.08": {
      code: "09.01.08",
      description: "Handkerchiefs and diapers (paper or textile)",
      division: "09.01"
    },
    "09.01.09": {
      code: "09.01.09",
      description: "Towels (paper or textile)",
      division: "09.01",
      excludes: "Rolls of paper towels (20.03.02)"
    },
    "09.01.10": {
      code: "09.01.10",
      description: "Curtains, draperies, blinds and the like",
      division: "09.01"
    },
    "09.01.11": {
      code: "09.01.11",
      description: "Other linens including pot holders",
      division: "09.01"
    },
    "09.01.12": {
      code: "09.01.12",
      description: "Carpeting, rugs, including flying carpets and mats",
      division: "09.01"
    },
    "09.01.13": {
      code: "09.01.13",
      description: "Rope, string, shoe laces, braids, cords",
      division: "09.01",
      excludes: "Cables, wires or cords with electric plugs are coded in 14.01.03; electric cables or cords without electric plugs are coded in 14.01.04"
    },
    "09.01.25": {
      code: "09.01.25",
      description: "Other textile articles which are not generally recognized as clothing, such as chamois cloths, dust cloths and hammocks",
      division: "09.01"
    },
    "09.03.01": {
      code: "09.03.01",
      description: "Jackets, vests, coats, cloaks, capes",
      division: "09.03",
      excludes: "Life jackets are coded in 18.11.06"
    },
    "09.03.02": {
      code: "09.03.02",
      description: "Trousers, slacks, shorts, bloomers",
      division: "09.03"
    },
    "09.03.03": {
      code: "09.03.03",
      description: "Men's suits",
      division: "09.03"
    },
    "09.03.04": {
      code: "09.03.04",
      description: "Ladies' suits, dresses, skirts",
      division: "09.03"
    },
    "09.03.05": {
      code: "09.03.05",
      description: "Sweaters",
      division: "09.03"
    },
    "09.03.06": {
      code: "09.03.06",
      description: "Shirts (including sweatshirts), camisoles, blouses, halters and tank tops",
      division: "09.03"
    },
    "09.03.07": {
      code: "09.03.07",
      description: "T-shirts",
      division: "09.03",
      guidelines: "Design must have short sleeves and no collar."
    },
    "09.03.08": {
      code: "09.03.08",
      description: "Scarves, bandanas, neckerchiefs, and other neckwear",
      division: "09.03",
      excludes: "Neckties and bow ties in 09.03.15"
    },
    "09.03.09": {
      code: "09.03.09",
      description: "Stockings, socks, hosiery and garter belts",
      division: "09.03"
    },
    "09.03.10": {
      code: "09.03.10",
      description: "Underpants, corsets, brassieres, girdles, other underwear and sleepwear",
      division: "09.03",
      guidelines: "For athletic supporters, see also 21.03.25"
    },
    "09.03.11": {
      code: "09.03.11",
      description: "Bathing suits",
      division: "09.03"
    },
    "09.03.12": {
      code: "09.03.12",
      description: "Gloves, including golf and ski gloves, mittens",
      division: "09.03",
      excludes: "Baseball and boxing gloves are coded in 21.03.06"
    },
    "09.03.13": {
      code: "09.03.13",
      description: "Belts, belt buckles",
      division: "09.03"
    },
    "09.03.14": {
      code: "09.03.14",
      description: "Bibs, aprons",
      division: "09.03"
    },
    "09.03.15": {
      code: "09.03.15",
      description: "Neckties and bow ties",
      division: "09.03"
    },
    "09.03.16": {
      code: "09.03.16",
      description: "Pockets and other parts of clothing, including collars and cuffs",
      division: "09.03"
    },
    "09.03.25": {
      code: "09.03.25",
      description: "Other clothing including robes",
      division: "09.03",
      excludes: "Headwear is coded in 09.05; footwear is coded in 09.07"
    },
    "09.05.01": {
      code: "09.05.01",
      description: "Caps, including visors, military caps and baseball caps",
      division: "09.05"
    },
    "09.05.02": {
      code: "09.05.02",
      description: "Top hats",
      division: "09.05"
    },
    "09.05.03": {
      code: "09.05.03",
      description: "Fezzes, turbans, berets, other visorless and brimless hats",
      division: "09.05"
    },
    "09.05.04": {
      code: "09.05.04",
      description: "Tri-cornered hats",
      division: "09.05"
    },
    "09.05.05": {
      code: "09.05.05",
      description: "Sombreros, cowboy hats (10 gallon hats), other broad-brimmed hats",
      division: "09.05"
    },
    "09.05.06": {
      code: "09.05.06",
      description: "Chef's hat",
      division: "09.05"
    },
    "09.05.07": {
      code: "09.05.07",
      description: "Bonnets (women's and children's)",
      division: "09.05"
    },
    "09.05.08": {
      code: "09.05.08",
      description: "Women's hats other than bonnets",
      division: "09.05"
    },
    "09.05.09": {
      code: "09.05.09",
      description: "Babies' caps, other than bonnets",
      division: "09.05"
    },
    "09.05.10": {
      code: "09.05.10",
      description: "Men's narrow-brimmed hats, including fedoras and derbies",
      division: "09.05"
    },
    "09.05.11": {
      code: "09.05.11",
      description: "Mortarboards (graduation hats)",
      division: "09.05"
    },
    "09.05.25": {
      code: "09.05.25",
      description: "Other headwear, including military helmets Including: Protective helmets such as motorcycle and sports helmets, hard hats, fireman's hats",
      division: "09.05",
      excludes: "Mortarboards are coded in 09.05.11; Medieval helmets which are part of armor are coded in 23.05.01; Mitres (Bishop's hats) are coded in 24.03.02; Mercury's helmet (winged helmet) is coded in 24.03.03"
    },
    "09.07.01": {
      code: "09.07.01",
      description: "Boots, including hiking and cowboy boots and galoshes (overboots)",
      division: "09.07"
    },
    "09.07.02": {
      code: "09.07.02",
      description: "Sports footwear, including jogging and tennis shoes, shoes with spikes, skates, snow shoes, ski boots",
      division: "09.07",
      guidelines: "For swim fins, see also 21.03.25"
    },
    "09.07.03": {
      code: "09.07.03",
      description: "Babies' shoes, bootees",
      division: "09.07"
    },
    "09.07.04": {
      code: "09.07.04",
      description: "Wooden shoes (clogs), sandals, shoes without heels, including bedroom slippers, moccasins, ballet shoes and rubbers",
      division: "09.07"
    },
    "09.07.05": {
      code: "09.07.05",
      description: "Other men's shoes",
      division: "09.07"
    },
    "09.07.06": {
      code: "09.07.06",
      description: "Other women's shoes",
      division: "09.07"
    },
    "09.07.07": {
      code: "09.07.07",
      description: "Boot and shoe prints, soles of shoes",
      division: "09.07",
      excludes: "Imprints of feet or toes are coded in 02.11.08"
    },
    "09.07.08": {
      code: "09.07.08",
      description: "Parts of footwear",
      division: "09.07",
      excludes: "Soles of shoes are coded in 09.07.07"
    },
    "09.07.25": {
      code: "09.07.25",
      description: "Other stylized footwear",
      division: "09.07"
    },
    "09.09.01": {
      code: "09.09.01",
      description: "Needles, pins, crochet hooks, knitting needles",
      division: "09.09"
    },
    "09.09.03": {
      code: "09.09.03",
      description: "Buttons",
      division: "09.09"
    },
    "09.09.04": {
      code: "09.09.04",
      description: "Snaps, fastening hooks",
      division: "09.09",
      excludes: "Hooks (small hardware) (14.03.25)"
    },
    "09.09.05": {
      code: "09.09.05",
      description: "Textile and clothing zippers",
      division: "09.09"
    },
    "09.09.06": {
      code: "09.09.06",
      description: "Patterns for clothing",
      division: "09.09",
      excludes: "Patterns resembling clothing (09.03)"
    },
    "09.09.07": {
      code: "09.09.07",
      description: "Spinning wheels, looms",
      division: "09.09"
    },
    "09.09.08": {
      code: "09.09.08",
      description: "Sewing machines",
      division: "09.09"
    },
    "09.09.25": {
      code: "09.09.25",
      description: "Other sewing accessories and equipment, including thimbles",
      division: "09.09",
      excludes: "Scissors, shears (11.07.01)"
    },
    "10.01.01": {
      code: "10.01.01",
      description: "Cigars, cigar bands, cigar holders",
      division: "10.01",
      excludes: "Cigarette packages and cartons are coded in 19.07.03; tobacco pouches are coded in 19.07.22"
    },
    "10.01.02": {
      code: "10.01.02",
      description: "Cigarettes, cigarette holders",
      division: "10.01"
    },
    "10.01.04": {
      code: "10.01.04",
      description: "Pipes",
      division: "10.01"
    },
    "10.01.05": {
      code: "10.01.05",
      description: "Water pipes (hookahs)",
      division: "10.01"
    },
    "10.01.06": {
      code: "10.01.06",
      description: "Lighters",
      division: "10.01"
    },
    "10.01.07": {
      code: "10.01.07",
      description: "Matches",
      division: "10.01"
    },
    "10.01.25": {
      code: "10.01.25",
      description: "Other forms of tobacco and smokers' materials including pipe cleaners and cigar cutters and ashtrays",
      division: "10.01",
      excludes: "Tobacco pouches are coded in 19.07.22"
    },
    "10.03.01": {
      code: "10.03.01",
      description: "Fans (non-motorized, hand-held)",
      division: "10.03",
      excludes: "Hand-held electric fans are coded in 13.03.25"
    },
    "10.03.02": {
      code: "10.03.02",
      description: "Canes, walking sticks, shepherd's crooks",
      division: "10.03"
    },
    "10.03.03": {
      code: "10.03.03",
      description: "Umbrellas, parasols",
      division: "10.03"
    },
    "10.05.01": {
      code: "10.05.01",
      description: "Toothbrushes",
      division: "10.05"
    },
    "10.05.02": {
      code: "10.05.02",
      description: "Razors, shavers, electric shavers",
      division: "10.05"
    },
    "10.05.03": {
      code: "10.05.03",
      description: "Other shaving articles, including razor blades and shaving brushes",
      division: "10.05"
    },
    "10.05.05": {
      code: "10.05.05",
      description: "Combs, hairbrushes, other personal care brushes excluding toothbrushes",
      division: "10.05"
    },
    "10.05.06": {
      code: "10.05.06",
      description: "Hair clippers (electric)",
      division: "10.05",
      excludes: "Scissors are coded in 11.07.01"
    },
    "10.05.07": {
      code: "10.05.07",
      description: "Hair nets, barrettes, bobby pins, other hair ornaments excluding hair ribbons",
      division: "10.05",
      excludes: "Ribbons are coded in 09.01.04"
    },
    "10.05.08": {
      code: "10.05.08",
      description: "Hair dryers, electric curling irons, curlers",
      division: "10.05"
    },
    "10.05.09": {
      code: "10.05.09",
      description: "Make-up products, including lipstick, mascara, eye shadow, rouge",
      division: "10.05"
    },
    "10.05.10": {
      code: "10.05.10",
      description: "Soap bars",
      division: "10.05",
      guidelines: "Only bars of soap are in 10.05.10. Containers of liquid soap are in the appropriate section of Category 19."
    },
    "10.05.12": {
      code: "10.05.12",
      description: "Hand-held mirrors, compacts",
      division: "10.05",
      excludes: "Wall and freestanding mirrors are coded in 12.01.11"
    },
    "10.05.13": {
      code: "10.05.13",
      description: "Tweezers",
      division: "10.05"
    },
    "10.05.25": {
      code: "10.05.25",
      description: "Other toilet articles and grooming articles, including dental floss and feminine hygiene products",
      division: "10.05"
    },
    "10.07.01": {
      code: "10.07.01",
      description: "Syringes",
      division: "10.07",
      guidelines: "Items which have a household or other use are coded only in those divisions."
    },
    "10.07.02": {
      code: "10.07.02",
      description: "Crutches, walkers",
      division: "10.07",
      excludes: "Canes and walking sticks are coded on 10.03.02"
    },
    "10.07.03": {
      code: "10.07.03",
      description: "Wheel chairs",
      division: "10.07"
    },
    "10.07.04": {
      code: "10.07.04",
      description: "Bandages, casts, slings",
      division: "10.07"
    },
    "10.07.05": {
      code: "10.07.05",
      description: "Stethoscopes",
      division: "10.07"
    },
    "10.07.25": {
      code: "10.07.25",
      description: "Other medical or surgical apparatus, instruments, attire, or utensils, including medical inhalers and eyepatches Including: X-ray machines, CAT scan machines and the like",
      division: "10.07",
      excludes: "Scalpels are coded in 11.07.25; hemostats and forceps are coded in 14.05.06; Stethoscopes are coded in 10.07.05"
    },
    "10.09.01": {
      code: "10.09.01",
      description: "Medicines and nonmedical products in tablet, capsule or powder form; suppositories",
      division: "10.09"
    },
    "10.09.02": {
      code: "10.09.02",
      description: "Other medicines",
      division: "10.09",
      guidelines: "Medicine in containers are cross coded in the appropriate container code. For example, ointments in tubes are also coded in 19.07.18; nasal sprays are coded in 19.09.12"
    },
    "11.01.01": {
      code: "11.01.01",
      description: "Spoons",
      division: "11.01"
    },
    "11.01.02": {
      code: "11.01.02",
      description: "Table knives without pointed ends (non-electric)",
      division: "11.01",
      excludes: "Electric knives are coded in 11.05.01; kitchen knives are coded in 11.07.25"
    },
    "11.01.03": {
      code: "11.01.03",
      description: "Forks",
      division: "11.01"
    },
    "11.01.04": {
      code: "11.01.04",
      description: "Settings of flatware with or without plates",
      division: "11.01"
    },
    "11.01.05": {
      code: "11.01.05",
      description: "Rolling pins, spatulas, cooking and serving implements other than knives, forks and spoons",
      division: "11.01"
    },
    "11.01.06": {
      code: "11.01.06",
      description: "Strainers, colanders, funnels, coffee filters",
      division: "11.01"
    },
    "11.01.07": {
      code: "11.01.07",
      description: "Can openers, bottle openers, corkscrews (non-electric)",
      division: "11.01"
    },
    "11.01.08": {
      code: "11.01.08",
      description: "Vegetable and meat grinders, choppers, blenders (non-electric)",
      division: "11.01"
    },
    "11.01.09": {
      code: "11.01.09",
      description: "Chopping, cutting or carving boards",
      division: "11.01"
    },
    "11.01.10": {
      code: "11.01.10",
      description: "Pepper, spice and coffee mills; salt cellars and shakers (non-electric)",
      division: "11.01"
    },
    "11.01.11": {
      code: "11.01.11",
      description: "Mixers, beaters, whisks (non-electric)",
      division: "11.01"
    },
    "11.01.25": {
      code: "11.01.25",
      description: "Other non-electric kitchen utensils, utensil holders",
      division: "11.01"
    },
    "11.03.01": {
      code: "11.03.01",
      description: "Glasses without stems including paper or plastic beverage containers",
      division: "11.03"
    },
    "11.03.02": {
      code: "11.03.02",
      description: "Tankards, glasses with handles, beer mugs, steins",
      division: "11.03"
    },
    "11.03.03": {
      code: "11.03.03",
      description: "Cups, saucers",
      division: "11.03"
    },
    "11.03.04": {
      code: "11.03.04",
      description: "Milk bottles and cartons",
      division: "11.03"
    },
    "11.03.05": {
      code: "11.03.05",
      description: "Milk cans",
      division: "11.03"
    },
    "11.03.06": {
      code: "11.03.06",
      description: "Bowls (empty)",
      division: "11.03"
    },
    "11.03.07": {
      code: "11.03.07",
      description: "Bowls (filled)",
      division: "11.03",
      guidelines: "Circular concave eating vessels holding liquids are presumed to be bowls. All filled bowls, such as bowls of soup, are in 11.03.07"
    },
    "11.03.08": {
      code: "11.03.08",
      description: "Pitchers",
      division: "11.03"
    },
    "11.03.09": {
      code: "11.03.09",
      description: "Plates (empty)",
      division: "11.03"
    },
    "11.03.10": {
      code: "11.03.10",
      description: "Plates (filled)",
      division: "11.03",
      guidelines: "All plates containing food are in 11.03.10"
    },
    "11.03.11": {
      code: "11.03.11",
      description: "Sauce boats, cruets, mustard pots, soup tureens",
      division: "11.03"
    },
    "11.03.12": {
      code: "11.03.12",
      description: "Tea, coffee pots (non-electric)",
      division: "11.03"
    },
    "11.03.13": {
      code: "11.03.13",
      description: "Sauce pans, pots, frying pans (non-electric)",
      division: "11.03",
      excludes: "Electric frying pans are coded in 13.03.05"
    },
    "11.03.14": {
      code: "11.03.14",
      description: "Baking dishes, including casseroles, cake and pie pans",
      division: "11.03"
    },
    "11.03.15": {
      code: "11.03.15",
      description: "Glasses with stems",
      division: "11.03"
    },
    "11.03.16": {
      code: "11.03.16",
      description: "Coffee mugs",
      division: "11.03"
    },
    "11.03.25": {
      code: "11.03.25",
      description: "Other non-electric cooking and serving ware, including woks",
      division: "11.03",
      guidelines: "For designs of paper, or plastic beverage containers, see also 11.03.01",
      excludes: "Kitchen utensils are coded in 11.01; baskets, bowls and other containers of fruit or vegetables are coded in 05.09.14 or 05.11.10; small electric cooking appliances are coded in 13.03"
    },
    "11.05.01": {
      code: "11.05.01",
      description: "Knives (electric)",
      division: "11.05",
      excludes: "Small electric cooking appliances are coded in 13.03"
    },
    "11.05.02": {
      code: "11.05.02",
      description: "Food processors, grinders (electric)",
      division: "11.05"
    },
    "11.05.03": {
      code: "11.05.03",
      description: "Blenders (electric)",
      division: "11.05"
    },
    "11.05.04": {
      code: "11.05.04",
      description: "Mixers (electric)",
      division: "11.05"
    },
    "11.05.05": {
      code: "11.05.05",
      description: "Coffee grinders (electric)",
      division: "11.05"
    },
    "11.05.06": {
      code: "11.05.06",
      description: "Coffee makers, including percolators and drip coffee makers (electric)",
      division: "11.05"
    },
    "11.05.07": {
      code: "11.05.07",
      description: "Can openers (electric)",
      division: "11.05"
    },
    "11.05.25": {
      code: "11.05.25",
      description: "Other small electric kitchen appliances, including knife sharpeners, juicers, and pasta makers",
      division: "11.05"
    },
    "11.07.01": {
      code: "11.07.01",
      description: "Scissors, shears, long handled shears and cutters Including: All scissors regardless of their specific use, such as hair scissors and tin snips",
      division: "11.07",
      excludes: "Pliers or small pincers for holding small objects are coded in 14.05.06"
    },
    "11.07.25": {
      code: "11.07.25",
      description: "Kitchen knives and other cutlery, including scalpels and folding knives",
      division: "11.07",
      excludes: "Table knives without pointed ends (non-electric) are coded in 11.01.02; electric knives are coded in 11.05.01"
    },
    "11.09.01": {
      code: "11.09.01",
      description: "Irons, ironing boards",
      division: "11.09"
    },
    "11.09.02": {
      code: "11.09.02",
      description: "Coat hangers",
      division: "11.09"
    },
    "11.09.03": {
      code: "11.09.03",
      description: "Brushes, sponges, steel wool, scouring pads of all types",
      division: "11.09",
      excludes: "Toothbrushes are coded in 10.05.01; hairbrushes, other personal care brushes are coded in 10.05.05; paint brushes are coded in 20.01.02"
    },
    "11.09.04": {
      code: "11.09.04",
      description: "Brooms, mops, dusters, window cleaning instruments",
      division: "11.09",
      excludes: "Chamois cloths and dust cloths are coded in 09.01.25"
    },
    "11.09.05": {
      code: "11.09.05",
      description: "Mouse traps",
      division: "11.09",
      excludes: "Wild animal traps are coded in 21.03.10"
    },
    "11.09.25": {
      code: "11.09.25",
      description: "Other household utensils, including drain plungers and washboards",
      division: "11.09"
    },
    "12.01.01": {
      code: "12.01.01",
      description: "Beds, cots, mattresses",
      division: "12.01",
      guidelines: "Sleep sofas are coded 12.01.05",
      excludes: "Pillows, cushions are coded in 09.01.07"
    },
    "12.01.03": {
      code: "12.01.03",
      description: "Cradles, bassinets, cribs",
      division: "12.01"
    },
    "12.01.04": {
      code: "12.01.04",
      description: "Chairs, stools, ottomans",
      division: "12.01"
    },
    "12.01.05": {
      code: "12.01.05",
      description: "Sofas, benches with or without backs, including exercise benches",
      division: "12.01"
    },
    "12.01.07": {
      code: "12.01.07",
      description: "Tables, including pool tables",
      division: "12.01"
    },
    "12.01.08": {
      code: "12.01.08",
      description: "Chests of drawers, sideboards, buffets, workbenches, butchers' blocks, store counters, sets of shelves, including bookcases, china closets",
      division: "12.01",
      guidelines: "Shelf units, brackets and anything resembling a shelf in form or position are in 12.01.08"
    },
    "12.01.09": {
      code: "12.01.09",
      description: "Desks",
      division: "12.01"
    },
    "12.01.11": {
      code: "12.01.11",
      description: "Wall and free-standing mirrors",
      division: "12.01",
      excludes: "Hand-held mirrors are coded in 10.05.12"
    },
    "12.01.25": {
      code: "12.01.25",
      description: "Other items of furniture, including wine racks, spice racks, serving carts",
      division: "12.01",
      guidelines: "This section includes parts of furniture. Parts are coded in 12.01.25 when the part is not a representational component of the furniture as a whole"
    },
    "12.03.01": {
      code: "12.03.01",
      description: "Sinks, wash basins, wash basin and pitcher sets",
      division: "12.03"
    },
    "12.03.02": {
      code: "12.03.02",
      description: "Bathtubs, showers",
      division: "12.03",
      guidelines: "For hot tubs, see also 07.09.11"
    },
    "12.03.03": {
      code: "12.03.03",
      description: "Toilets, bidets",
      division: "12.03"
    },
    "12.03.04": {
      code: "12.03.04",
      description: "Water turn-on valves, spigots, faucets",
      division: "12.03"
    },
    "12.03.25": {
      code: "12.03.25",
      description: "Other plumbing fixtures or parts of plumbing fixtures",
      division: "12.03"
    },
    "13.01.01": {
      code: "13.01.01",
      description: "Candles, candlesticks, candelabra, menorahs",
      division: "13.01"
    },
    "13.01.02": {
      code: "13.01.02",
      description: "Torches, including the Olympic Torch, blowtorches and welding torches",
      division: "13.01",
      guidelines: "Torch and flame designs are in 13.01.02 exclusively"
    },
    "13.01.03": {
      code: "13.01.03",
      description: "Oil lamps, lanterns, hurricane lamps",
      division: "13.01"
    },
    "13.01.05": {
      code: "13.01.05",
      description: "Table lamps; indoor floor lamps; wall lamps, including sconces; hanging lamps such as chandeliers",
      division: "13.01"
    },
    "13.01.06": {
      code: "13.01.06",
      description: "Lampshades (alone)",
      division: "13.01"
    },
    "13.01.08": {
      code: "13.01.08",
      description: "Stagelights, spotlights",
      division: "13.01"
    },
    "13.01.09": {
      code: "13.01.09",
      description: "Christmas and other strings of lights",
      division: "13.01"
    },
    "13.01.10": {
      code: "13.01.10",
      description: "Street lights, outdoor lamp posts",
      division: "13.01"
    },
    "13.01.11": {
      code: "13.01.11",
      description: "Flashlights",
      division: "13.01"
    },
    "13.01.13": {
      code: "13.01.13",
      description: "Electric lightbulbs, flashbulbs, fluorescent tubes",
      division: "13.01"
    },
    "13.01.25": {
      code: "13.01.25",
      description: "Other lighting equipment excluding ceiling fans with lights",
      division: "13.01",
      guidelines: "Ceiling fans are coded in 13.03.25",
      excludes: "Traffic and pedestrian lights are coded in 18.15.04"
    },
    "13.03.01": {
      code: "13.03.01",
      description: "Grills, other cooking apparatus with open fire",
      division: "13.03",
      guidelines: "For open fires, such as campfires, see also logs (07.15.05) and flames (01.15.03)",
      excludes: "Fireplaces are coded in 07.05.07"
    },
    "13.03.02": {
      code: "13.03.02",
      description: "Kitchen stoves, ovens, micro-wave ovens",
      division: "13.03",
      excludes: "Wood-burning stoves (13.03.06)"
    },
    "13.03.03": {
      code: "13.03.03",
      description: "Plate warmers, hot trays, fondue pots, chafing dishes and the like",
      division: "13.03"
    },
    "13.03.04": {
      code: "13.03.04",
      description: "Toasters",
      division: "13.03"
    },
    "13.03.05": {
      code: "13.03.05",
      description: "Electric broilers, frying pans, popcorn poppers and other small electric cooking appliances",
      division: "13.03",
      excludes: "Nonelectric frying pans (11.03.13)"
    },
    "13.03.06": {
      code: "13.03.06",
      description: "Boilers for heating, furnaces, Franklin stoves, kerosene heaters, hot water heaters, wood burning stoves",
      division: "13.03",
      excludes: "Fireplaces (07.05.07)"
    },
    "13.03.07": {
      code: "13.03.07",
      description: "Radiators",
      division: "13.03"
    },
    "13.03.08": {
      code: "13.03.08",
      description: "Refrigerators, ice boxes, freezers",
      division: "13.03"
    },
    "13.03.25": {
      code: "13.03.25",
      description: "Other cooking, heating or refrigeration equipment, including space heaters, Bunsen burners, water coolers, fans, ceiling fans and air conditioners",
      division: "13.03",
      guidelines: "This section includes parts of cooking, heating or refrigeration equipment. Parts are coded in 13.03.25 when the part is not a representational component of the equipment as a whole. For solar panels, see also 07.07.25",
      excludes: "Nonelectric cooking and serving ware are coded in 11.03; small electric kitchen appliances are coded in 11.05"
    },
    "14.01.01": {
      code: "14.01.01",
      description: "Tubes, pipes, pipe fittings",
      division: "14.01"
    },
    "14.01.02": {
      code: "14.01.02",
      description: "Hoses",
      division: "14.01"
    },
    "14.01.03": {
      code: "14.01.03",
      description: "Cables or cords with electric plugs",
      division: "14.01",
      excludes: "Ropes, braids, cords (non-electric) (09.01.13)"
    },
    "14.01.04": {
      code: "14.01.04",
      description: "Electric cables or cords without electric plugs",
      division: "14.01",
      guidelines: "For cables or cords, see also 14.01.25",
      excludes: "Ropes braids, cords (non-electric) (09.01.13)"
    },
    "14.01.05": {
      code: "14.01.05",
      description: "Chains, links of chains",
      division: "14.01",
      excludes: "Jewelry chains (17.03.02)"
    },
    "14.01.06": {
      code: "14.01.06",
      description: "Girders, rods, rails",
      division: "14.01"
    },
    "14.01.07": {
      code: "14.01.07",
      description: "Barbed wire",
      division: "14.01",
      excludes: "Barbed wire fences (07.11.09)"
    },
    "14.01.08": {
      code: "14.01.08",
      description: "Window screening, other wire netting",
      division: "14.01"
    },
    "14.01.25": {
      code: "14.01.25",
      description: "Other heavy hardware articles",
      division: "14.01",
      guidelines: "For designs of cables, see also 14.01.04"
    },
    "14.03.01": {
      code: "14.03.01",
      description: "Springs",
      division: "14.03",
      excludes: "Door closers (15.01.25)"
    },
    "14.03.02": {
      code: "14.03.02",
      description: "Nails, screws, nuts, bolts, washers, eyelets, rivets, dowel pins, thumb tacks, railroad spikes",
      division: "14.03"
    },
    "14.03.03": {
      code: "14.03.03",
      description: "Valves",
      division: "14.03"
    },
    "14.03.04": {
      code: "14.03.04",
      description: "Terminal connectors for cables, cable clamps, collars, junction sleeves, rings, segments",
      division: "14.03",
      excludes: "Pipe fittings (14.01.01)"
    },
    "14.03.05": {
      code: "14.03.05",
      description: "Door handles, door knobs, window handles, hinges, door knockers",
      division: "14.03"
    },
    "14.03.07": {
      code: "14.03.07",
      description: "Sandpaper",
      division: "14.03"
    },
    "14.03.25": {
      code: "14.03.25",
      description: "Other small hardware articles, including hooks, magnets",
      division: "14.03",
      excludes: "Crochet hooks (09.09.01); fastening hooks for clothing (09.09.04); Sanitary fixtures (12.03)"
    },
    "14.05.01": {
      code: "14.05.01",
      description: "Hammers, gavels, mallets",
      division: "14.05",
      excludes: "Non-motorized agricultural or horticultural implements (14.07); blow torches and welding torches (13.01.02)"
    },
    "14.05.02": {
      code: "14.05.02",
      description: "Screwdrivers",
      division: "14.05"
    },
    "14.05.03": {
      code: "14.05.03",
      description: "Wrenches",
      division: "14.05"
    },
    "14.05.04": {
      code: "14.05.04",
      description: "Vises",
      division: "14.05"
    },
    "14.05.05": {
      code: "14.05.05",
      description: "Axes, hatchets, pick axes, tomahawks",
      division: "14.05"
    },
    "14.05.06": {
      code: "14.05.06",
      description: "Tongs, pincers, pliers, hemostats, forceps, tin snips",
      division: "14.05",
      guidelines: "Pliers, small pincers for holding small objects or cutting wire are in 14.05.06 exclusively",
      excludes: "Pruning shears in 11.07.01"
    },
    "14.05.07": {
      code: "14.05.07",
      description: "Drills, bits for drills",
      division: "14.05"
    },
    "14.05.08": {
      code: "14.05.08",
      description: "Jackhammers",
      division: "14.05"
    },
    "14.05.09": {
      code: "14.05.09",
      description: "Saws, saw blades",
      division: "14.05"
    },
    "14.05.10": {
      code: "14.05.10",
      description: "Bricklayers' trowels, plasterers' mortarboards",
      division: "14.05"
    },
    "14.05.11": {
      code: "14.05.11",
      description: "Branding irons",
      division: "14.05"
    },
    "14.05.25": {
      code: "14.05.25",
      description: "Other tools, including files, anvils, bellows",
      division: "14.05"
    },
    "14.07.01": {
      code: "14.07.01",
      description: "Spades and shovels of all kinds",
      division: "14.07",
      excludes: "Machines for agriculture (15.01.08); wheel barrows (18.03.03); agricultural vehicles (18.05)"
    },
    "14.07.02": {
      code: "14.07.02",
      description: "Pitchforks",
      division: "14.07",
      guidelines: "Specific 24.03.04 for the distinction between pitchforks and tridents",
      excludes: "Tridents"
    },
    "14.07.03": {
      code: "14.07.03",
      description: "Rakes, hoes",
      division: "14.07"
    },
    "14.07.04": {
      code: "14.07.04",
      description: "Sickles, scythes",
      division: "14.07"
    },
    "14.07.05": {
      code: "14.07.05",
      description: "Plows (non-motorized)",
      division: "14.07"
    },
    "14.07.06": {
      code: "14.07.06",
      description: "Water sprinklers",
      division: "14.07"
    },
    "14.07.25": {
      code: "14.07.25",
      description: "Other non-motorized agricultural or horticultural implements",
      division: "14.07"
    },
    "14.09.01": {
      code: "14.09.01",
      description: "Stepladders",
      division: "14.09",
      guidelines: "Only ladders which fold open to form a triangular profile are in 14.09.01. Other straight or extension ladders are in 14.09.02"
    },
    "14.09.02": {
      code: "14.09.02",
      description: "Other ladders, including fire escapes",
      division: "14.09",
      guidelines: "Specific Guideline 14.09.01 for distinction between straight or extension ladders and stepladders"
    },
    "14.11.01": {
      code: "14.11.01",
      description: "Keys with heads of circular, oval or lobed shape",
      division: "14.11",
      excludes: "Safes (19.05.06)"
    },
    "14.11.02": {
      code: "14.11.02",
      description: "Keys of some other shape",
      division: "14.11"
    },
    "14.11.05": {
      code: "14.11.05",
      description: "More than one key",
      division: "14.11"
    },
    "14.11.07": {
      code: "14.11.07",
      description: "Key rings, with or without keys",
      division: "14.11"
    },
    "14.11.08": {
      code: "14.11.08",
      description: "Locks and key holes; padlocks; combination locks",
      division: "14.11"
    },
    "14.11.09": {
      code: "14.11.09",
      description: "Restraints, including handcuffs, ball and chain, manacles and leg irons",
      division: "14.11"
    },
    "15.01.01": {
      code: "15.01.01",
      description: "Pressing, grinding, distilling or excavating machines, including printing presses and clothes presses",
      division: "15.01"
    },
    "15.01.02": {
      code: "15.01.02",
      description: "Other machines for industry; industrial installations",
      division: "15.01",
      guidelines: "This section includes parts of machines. Parts are coded in 15.01.02 when the part is not a representational component of the machinery as a whole. For similar designs, see also 15.01.25",
      excludes: "Industrial establishments, factory smokestacks (07.03.08)"
    },
    "15.01.03": {
      code: "15.01.03",
      description: "Conveyor belts",
      division: "15.01"
    },
    "15.01.04": {
      code: "15.01.04",
      description: "Motors, engines, generators",
      division: "15.01"
    },
    "15.01.05": {
      code: "15.01.05",
      description: "Propellers of all kinds, ventilators, blowers, turbines",
      division: "15.01",
      excludes: "Propellers for land, air, or sea vehicles in 18.11.04"
    },
    "15.01.06": {
      code: "15.01.06",
      description: "Pulleys",
      division: "15.01"
    },
    "15.01.07": {
      code: "15.01.07",
      description: "Sprayers, including paint spray guns, fire extinguishers and pump sprayers",
      division: "15.01",
      excludes: "Bottles or jugs with pumps or sprayers, including atomizers (19.09.12)"
    },
    "15.01.08": {
      code: "15.01.08",
      description: "Machines for agriculture, including power and manual lawn mowers",
      division: "15.01",
      excludes: "Non-motorized agricultural or horticultural implements 14.07; tractors, threshers, combines, tillers (18.05.08); riding lawn mowers (18.05.06)"
    },
    "15.01.09": {
      code: "15.01.09",
      description: "Gasoline pumps",
      division: "15.01"
    },
    "15.01.10": {
      code: "15.01.10",
      description: "Vending machines",
      division: "15.01"
    },
    "15.01.25": {
      code: "15.01.25",
      description: "Other mechanical appliances for industry, including door closers",
      division: "15.01",
      guidelines: "For similar designs see also 15.01.02",
      excludes: "Drills are coded in 14.05.07; jackhammers are coded in 14.05.08"
    },
    "15.03.01": {
      code: "15.03.01",
      description: "Vacuum cleaners, floor polishers, rug shampooers",
      division: "15.03",
      excludes: "Small electric kitchen appliances are coded in 11.05; small electric cooking appliances are coded in 13.03; sewing machines are coded in 09.09.08"
    },
    "15.03.02": {
      code: "15.03.02",
      description: "Washing machines, including dishwashers, clothes dryers",
      division: "15.03"
    },
    "15.03.25": {
      code: "15.03.25",
      description: "Other household machines, including trash compactors",
      division: "15.03"
    },
    "15.05.01": {
      code: "15.05.01",
      description: "Typewriters",
      division: "15.05"
    },
    "15.05.02": {
      code: "15.05.02",
      description: "Computer keys, keyboards, and keypads without monitors",
      division: "15.05",
      excludes: "Computer terminals and keyboards with monitors/screens (15.05.03) and telephone keypads (16.01.08)"
    },
    "15.05.03": {
      code: "15.05.03",
      description: "Desktop and laptop computers and computer monitors",
      division: "15.05",
      guidelines: "Video display monitors/screens accompanied by a keyboard are in 15.05.03. Also, video displays, even absent keypads, are in this section if it is otherwise clear from the content of the drawing that the display is part of a computer terminal"
    },
    "15.05.04": {
      code: "15.05.04",
      description: "Handheld personal or wireless computers and digital devices",
      division: "15.05",
      excludes: "Computers with screens (15.05.03) and devices clearly used as telephones (16.01.08). However, please also note that entry and/or search of multiple codes such as these may be necessary"
    },
    "15.05.05": {
      code: "15.05.05",
      description: "Machines for printing, copying, and scanning",
      division: "15.05"
    },
    "15.05.06": {
      code: "15.05.06",
      description: "Calculators, adding machines, and cash registers",
      division: "15.05"
    },
    "15.05.07": {
      code: "15.05.07",
      description: "Computer processing and data storage devices, not including computer terminals or devices or media for mere storage or playback of data, audio, or video",
      division: "15.05",
      excludes: "Computers terminals (15.05.03) and media and players solely for audio/video/data storage or playback (16.01.xx)"
    },
    "15.05.08": {
      code: "15.05.08",
      description: "Computer mouse, trackball, stylus, and touchpad",
      division: "15.05"
    },
    "15.05.25": {
      code: "15.05.25",
      description: "Controls and controllers for electronic devices, other than for audiovisual playback devices such as televisions and stereos (16.01.03)",
      division: "15.05",
      excludes: "remote controls for audiovisual playback devices such as televisions and stereos (16.01.03)"
    },
    "15.07.01": {
      code: "15.07.01",
      description: "Cog wheels (wheels with teeth), gears, several wheels in juxtaposition",
      division: "15.07",
      guidelines: "Many gear designs are double coded in 15.07.01 and 26.01.07"
    },
    "15.07.02": {
      code: "15.07.02",
      description: "Paddle wheels",
      division: "15.07"
    },
    "15.07.03": {
      code: "15.07.03",
      description: "Wheels with spokes",
      division: "15.07"
    },
    "15.07.04": {
      code: "15.07.04",
      description: "Ball bearings and other bearings",
      division: "15.07"
    },
    "15.07.25": {
      code: "15.07.25",
      description: "Other wheels including vehicular wheels without spokes; hubcaps",
      division: "15.07",
      excludes: "Vehicular wheels fitted with tires are coded in 18.11.01"
    },
    "15.09.01": {
      code: "15.09.01",
      description: "Batteries and battery terminals",
      division: "15.09",
      excludes: "Lighting equipment (13.01); electric cables or cords (14.01.03; 14.01.04)"
    },
    "15.09.02": {
      code: "15.09.02",
      description: "Plugs, spark; Spark plugs",
      division: "15.09"
    },
    "15.09.03": {
      code: "15.09.03",
      description: "Electrical outlets and switches",
      division: "15.09"
    },
    "15.09.25": {
      code: "15.09.25",
      description: "Electrical circuitry and power hardware and routing devices, including circuitry, chargers, fuses, and controllers, but not including mere cables",
      division: "15.09",
      guidelines: "Battery chargers and other devices for routing electrical power are in 15.09.25, while electrical cables and wires are in 14.01.xx. However, multiple codes for a given design may be appropriate"
    },
    "16.01.01": {
      code: "16.01.01",
      description: "Antennas, including satellite dishes",
      division: "16.01",
      excludes: "Transmitting towers and signal beacons are coded in 07.11.03"
    },
    "16.01.02": {
      code: "16.01.02",
      description: "Posts or lines for telephone, telegraph or electricity",
      division: "16.01"
    },
    "16.01.03": {
      code: "16.01.03",
      description: "Radio or television apparatus, including radios, televisions and projection screens",
      division: "16.01",
      guidelines: "Video screens are not in 16.01.03 when it is clear that they are video monitors or a part of computer terminals. Only actual televisions or screens are in 16.01.03. Clock radios are double coded in 16.01.03 and 17.01.02",
      excludes: "Video computer terminals are coded in 15.05.03; antennas are coded in 16.01.01"
    },
    "16.01.04": {
      code: "16.01.04",
      description: "Record players; tape players (video and audio); answering machines; stereo components, including sound amplifiers and speakers",
      division: "16.01"
    },
    "16.01.05": {
      code: "16.01.05",
      description: "Phonograph records, video discs, CDs, CD-ROMs, DVDs",
      division: "16.01"
    },
    "16.01.06": {
      code: "16.01.06",
      description: "Sound and video recording tapes and cassettes",
      division: "16.01"
    },
    "16.01.07": {
      code: "16.01.07",
      description: "Microphones, headphones",
      division: "16.01"
    },
    "16.01.08": {
      code: "16.01.08",
      description: "Telephones and other devices for personal vocal communication, including cellular phones and walkie-talkies",
      division: "16.01",
      excludes: "Handheld computer devices with no clear telephone function (15.05.04)"
    },
    "16.01.25": {
      code: "16.01.25",
      description: "Other apparatus and parts thereof for telecommunication or the recording or reproduction of sound; alarms; megaphones and pagers",
      division: "16.01"
    },
    "16.03.01": {
      code: "16.03.01",
      description: "Cameras, including motion picture cameras; photographic lenses",
      division: "16.03"
    },
    "16.03.02": {
      code: "16.03.02",
      description: "Projection apparatus, including slide projectors and motion picture projectors",
      division: "16.03",
      excludes: "Projection screens are coded in 16.01.03"
    },
    "16.03.03": {
      code: "16.03.03",
      description: "Film and containers for film, including slide or print film and motion picture reel film",
      division: "16.03"
    },
    "16.03.04": {
      code: "16.03.04",
      description: "Other apparatus, instruments or equipment for photography or the cinema, including tripods and flashguns",
      division: "16.03",
      excludes: "Stage lights, spotlights are coded in 13.01.08; flashbulbs are coded in 13.01.13"
    },
    "16.03.05": {
      code: "16.03.05",
      description: "Binoculars, opera glasses, telescopes, microscopes",
      division: "16.03"
    },
    "16.03.06": {
      code: "16.03.06",
      description: "Magnifying glasses, jeweler's loupes",
      division: "16.03"
    },
    "16.03.07": {
      code: "16.03.07",
      description: "Eyeglasses, eyeglass frames, sunglasses, goggles and safety goggles",
      division: "16.03"
    },
    "16.03.08": {
      code: "16.03.08",
      description: "Monocles and optical or spectacle lenses",
      division: "16.03"
    },
    "16.03.25": {
      code: "16.03.25",
      description: "Other optical apparatus instruments or equipment, including gun sights or cross-hairs",
      division: "16.03"
    },
    "17.01.01": {
      code: "17.01.01",
      description: "Watches, including bracelet watches and pocket watches",
      division: "17.01",
      guidelines: "Both digital watches and watches with hands are in 17.01.01. See Specific 17.01.02 for clock or watch faces with numbers or dots not shown as part of a watch or clock"
    },
    "17.01.02": {
      code: "17.01.02",
      description: "Clocks, including clock or watch faces alone",
      division: "17.01",
      guidelines: "This section includes clock or watch faces with numbers or dots standing alone and not part of a watch or clock. Clock radios are double coded in 17.01.02 and 16.01.03"
    },
    "17.01.03": {
      code: "17.01.03",
      description: "Hands of horological instruments",
      division: "17.01"
    },
    "17.01.04": {
      code: "17.01.04",
      description: "Sundials",
      division: "17.01"
    },
    "17.01.05": {
      code: "17.01.05",
      description: "Hourglasses",
      division: "17.01"
    },
    "17.01.25": {
      code: "17.01.25",
      description: "Other time measuring instruments and parts such as watchbands and pendulums",
      division: "17.01"
    },
    "17.03.01": {
      code: "17.03.01",
      description: "Stones for jewelry (cut or uncut), nuggets of precious metal",
      division: "17.03"
    },
    "17.03.02": {
      code: "17.03.02",
      description: "Necklaces, bracelets, chains",
      division: "17.03",
      excludes: "Bracelet watches (17.01.01)"
    },
    "17.03.03": {
      code: "17.03.03",
      description: "Rings, including wedding bands",
      division: "17.03"
    },
    "17.03.04": {
      code: "17.03.04",
      description: "Ingots, whether or not of precious metal",
      division: "17.03"
    },
    "17.03.25": {
      code: "17.03.25",
      description: "Other jewelry, including pendants, earrings and brooches",
      division: "17.03"
    },
    "17.05.01": {
      code: "17.05.01",
      description: "Bathroom scales, doctors' scales",
      division: "17.05"
    },
    "17.05.02": {
      code: "17.05.02",
      description: "Two-pan balance scales, including Scales of Justice; weights therefor",
      division: "17.05"
    },
    "17.05.25": {
      code: "17.05.25",
      description: "Other scales, including industrial scales and postage scales",
      division: "17.05"
    },
    "17.07.01": {
      code: "17.07.01",
      description: "Instruments for linear measurement, including rulers, yard sticks, tape measures and surveyor's tapes and chains",
      division: "17.07",
      excludes: "Time measuring instruments are coded in 17.01; scales and weights are coded in 17.03"
    },
    "17.07.02": {
      code: "17.07.02",
      description: "Slide rules, abacuses and the like",
      division: "17.07"
    },
    "17.07.03": {
      code: "17.07.03",
      description: "Gauges, including tachometers and speedometers",
      division: "17.07"
    },
    "17.07.04": {
      code: "17.07.04",
      description: "French curves, T-squares, carpenter squares, drawing triangles",
      division: "17.07"
    },
    "17.07.05": {
      code: "17.07.05",
      description: "Directional compasses, including mariner's compasses and compass points",
      division: "17.07"
    },
    "17.07.06": {
      code: "17.07.06",
      description: "Carpenter's levels",
      division: "17.07"
    },
    "17.07.07": {
      code: "17.07.07",
      description: "Barometers, thermometers",
      division: "17.07"
    },
    "17.07.08": {
      code: "17.07.08",
      description: "Calipers, micrometers, compasses for draftsmen",
      division: "17.07",
      excludes: "Directional compasses (17.07.05)"
    },
    "17.07.09": {
      code: "17.07.09",
      description: "Weather vanes",
      division: "17.07"
    },
    "17.07.10": {
      code: "17.07.10",
      description: "Plumb lines, weights for plumb lines",
      division: "17.07"
    },
    "17.07.25": {
      code: "17.07.25",
      description: "Other measuring instruments and markers, including seismographs, Geiger counters and windsocks",
      division: "17.07",
      guidelines: "For zig-zag lines, such as those appearing on an oscilloscope, see 17.07.25 and 26.17.10"
    },
    "18.01.01": {
      code: "18.01.01",
      description: "Chariots for racing or combat",
      division: "18.01"
    },
    "18.01.02": {
      code: "18.01.02",
      description: "Other horse-drawn carriages with two wheels",
      division: "18.01"
    },
    "18.01.03": {
      code: "18.01.03",
      description: "Stage coaches and other animal-drawn vehicles with front and back wheels",
      division: "18.01",
      guidelines: "Individual four-wheel vehicles for transporting commodities and drawn by horses or other animals are in 18.01.03, even if the animals which draw them are not pictured"
    },
    "18.01.04": {
      code: "18.01.04",
      description: "Wagon Trains",
      division: "18.01",
      guidelines: "A column of animal-drawn vehicles is in 18.01.04 exclusively. It is not in 18.01.03 unless one of the wagons is significantly prominent"
    },
    "18.01.05": {
      code: "18.01.05",
      description: "Dog sleds, sleighs pulled by horses or reindeer",
      division: "18.01"
    },
    "18.01.25": {
      code: "18.01.25",
      description: "Other vehicles propelled by animal power",
      division: "18.01"
    },
    "18.03.01": {
      code: "18.03.01",
      description: "Bicycles, tricycles, unicycles",
      division: "18.03",
      guidelines: "For stationary exercise bicycles, see also 21.03.07 (Weights for lifting, exercise machines)"
    },
    "18.03.02": {
      code: "18.03.02",
      description: "Rickshaws",
      division: "18.03"
    },
    "18.03.03": {
      code: "18.03.03",
      description: "Wheel barrows, hand trucks",
      division: "18.03"
    },
    "18.03.04": {
      code: "18.03.04",
      description: "Wagons, including toy wagons and dollies",
      division: "18.03",
      guidelines: "Wagons are low four-wheel vehicles with open rectangular bodies such as toy wagons",
      excludes: "Wagons propelled by animal power (18.01.03 or 18.01.04)"
    },
    "18.03.05": {
      code: "18.03.05",
      description: "Shopping carts",
      division: "18.03"
    },
    "18.03.06": {
      code: "18.03.06",
      description: "Baby carriages and strollers",
      division: "18.03"
    },
    "18.03.07": {
      code: "18.03.07",
      description: "Toboggans, sleds",
      division: "18.03"
    },
    "18.03.25": {
      code: "18.03.25",
      description: "Other land vehicles propelled by human power excluding skateboards",
      division: "18.03"
    },
    "18.05.01": {
      code: "18.05.01",
      description: "Automobiles",
      division: "18.05"
    },
    "18.05.02": {
      code: "18.05.02",
      description: "Motorcycles, motor scooters, mopeds",
      division: "18.05"
    },
    "18.05.03": {
      code: "18.05.03",
      description: "Trains, train cars, locomotives, subway cars",
      division: "18.05"
    },
    "18.05.04": {
      code: "18.05.04",
      description: "Buses, trolleys",
      division: "18.05"
    },
    "18.05.05": {
      code: "18.05.05",
      description: "Trucks, vans",
      division: "18.05",
      excludes: "Fire trucks (18.05.12)"
    },
    "18.05.06": {
      code: "18.05.06",
      description: "Snowmobiles, motorized golf carts, riding lawn mowers",
      division: "18.05"
    },
    "18.05.07": {
      code: "18.05.07",
      description: "Trailers, motor homes, recreational vehicles such as campers",
      division: "18.05"
    },
    "18.05.08": {
      code: "18.05.08",
      description: "Tractors, threshers, combines, tillers",
      division: "18.05"
    },
    "18.05.09": {
      code: "18.05.09",
      description: "Bulldozers, road rollers, cement mixers, cranes, (including stationary cranes), other road construction or building site vehicles",
      division: "18.05"
    },
    "18.05.10": {
      code: "18.05.10",
      description: "Lifts, fork-lifts",
      division: "18.05"
    },
    "18.05.11": {
      code: "18.05.11",
      description: "Military tanks",
      division: "18.05"
    },
    "18.05.12": {
      code: "18.05.12",
      description: "Emergency vehicles, including ambulances, fire trucks and police cars",
      division: "18.05"
    },
    "18.05.25": {
      code: "18.05.25",
      description: "Other land motor vehicles",
      division: "18.05"
    },
    "18.07.01": {
      code: "18.07.01",
      description: "Row boats, canoes, kayaks, inflatable boats and the like",
      division: "18.07"
    },
    "18.07.02": {
      code: "18.07.02",
      description: "Gondolas",
      division: "18.07"
    },
    "18.07.03": {
      code: "18.07.03",
      description: "Viking boats, ancient sailing vessels, Chinese junks, boats with single square sail",
      division: "18.07",
      guidelines: "Boats with a single square lug sail composed of a series of panels (junks) and boats characterized by a single square sail located in the middle of the ship (Viking boats) are in 18.07.03. Viking boats are often characterized by a serpent-like ornamentation at the bow"
    },
    "18.07.04": {
      code: "18.07.04",
      description: "Ships with two or three masts, including brigs, clippers and schooners",
      division: "18.07"
    },
    "18.07.05": {
      code: "18.07.05",
      description: "Recreational sail boats, including sailing yachts, catamarans, small sail boats, sail boards",
      division: "18.07"
    },
    "18.07.06": {
      code: "18.07.06",
      description: "Other stylized sail boats",
      division: "18.07"
    },
    "18.07.08": {
      code: "18.07.08",
      description: "Steamships, ocean liners",
      division: "18.07"
    },
    "18.07.09": {
      code: "18.07.09",
      description: "Paddle wheel boats",
      division: "18.07",
      excludes: "Paddle wheels (15.07.02)"
    },
    "18.07.10": {
      code: "18.07.10",
      description: "Destroyers, air craft carriers and similar military ships",
      division: "18.07"
    },
    "18.07.11": {
      code: "18.07.11",
      description: "Submarines",
      division: "18.07"
    },
    "18.07.12": {
      code: "18.07.12",
      description: "Recreational motor boats, yachts",
      division: "18.07"
    },
    "18.07.13": {
      code: "18.07.13",
      description: "Other motor boats, including tugboats, ferry boats and fishing boats",
      division: "18.07"
    },
    "18.07.16": {
      code: "18.07.16",
      description: "Amphibious vehicles",
      division: "18.07"
    },
    "18.07.25": {
      code: "18.07.25",
      description: "Other vehicles for use on water, including log rafts, personal watercrafts and houseboats, Noah's ark",
      division: "18.07"
    },
    "18.09.01": {
      code: "18.09.01",
      description: "Airplanes, including gliders, propeller and jet-powered planes, ultra lights",
      division: "18.09"
    },
    "18.09.02": {
      code: "18.09.02",
      description: "Space rockets, missiles and capsules",
      division: "18.09"
    },
    "18.09.03": {
      code: "18.09.03",
      description: "Helicopters",
      division: "18.09"
    },
    "18.09.04": {
      code: "18.09.04",
      description: "Balloons",
      division: "18.09",
      excludes: "Toy balloons (21.01.13)"
    },
    "18.09.05": {
      code: "18.09.05",
      description: "Blimps",
      division: "18.09"
    },
    "18.09.06": {
      code: "18.09.06",
      description: "Parachutes, parasails",
      division: "18.09"
    },
    "18.09.07": {
      code: "18.09.07",
      description: "Hang gliders and the like",
      division: "18.09",
      excludes: "Toy kites (21.01.14)"
    },
    "18.09.25": {
      code: "18.09.25",
      description: "Other air or space vehicles, including satellites and flying saucers",
      division: "18.09",
      excludes: "Satellite dishes (16.01.01)"
    },
    "18.11.01": {
      code: "18.11.01",
      description: "Tires, inner tubes, tire marks, snow chains",
      division: "18.11",
      guidelines: "This section only includes designs of wheels fitted with tires. For other vehicular wheels, see 15.07.25",
      excludes: "Vehicular wheels (15.07); motors and engines (15.01.04); spark plugs (15.09.02); tachometers and speedometers (17.07.03)"
    },
    "18.11.02": {
      code: "18.11.02",
      description: "Ship's wheels, steering wheels",
      division: "18.11"
    },
    "18.11.03": {
      code: "18.11.03",
      description: "Shock absorbers, mufflers, tailpipes",
      division: "18.11"
    },
    "18.11.04": {
      code: "18.11.04",
      description: "Propellers",
      division: "18.11",
      guidelines: "Other propeller designs are classified in 15.01.05 (Propellers of all kinds, ventilators, blowers, turbines)"
    },
    "18.11.05": {
      code: "18.11.05",
      description: "Anchors",
      division: "18.11"
    },
    "18.11.06": {
      code: "18.11.06",
      description: "Life preservers and jackets, water wings",
      division: "18.11"
    },
    "18.11.07": {
      code: "18.11.07",
      description: "Oars and boat paddles",
      division: "18.11"
    },
    "18.11.25": {
      code: "18.11.25",
      description: "Other parts of land vehicles, water vehicles or air vehicles, including license plates",
      division: "18.11"
    },
    "18.13.01": {
      code: "18.13.01",
      description: "Horseshoes",
      division: "18.13"
    },
    "18.13.02": {
      code: "18.13.02",
      description: "Stirrups, spurs",
      division: "18.13"
    },
    "18.13.03": {
      code: "18.13.03",
      description: "Saddles, harnesses for horses",
      division: "18.13"
    },
    "18.13.04": {
      code: "18.13.04",
      description: "Other equipment for horses",
      division: "18.13"
    },
    "18.13.05": {
      code: "18.13.05",
      description: "Yokes, collars, leashes, and harnesses for other animals",
      division: "18.13"
    },
    "18.13.06": {
      code: "18.13.06",
      description: "Animal feeding equipment, including dog bowls",
      division: "18.13"
    },
    "18.13.25": {
      code: "18.13.25",
      description: "Other equipment for animals other than horses",
      division: "18.13"
    },
    "18.15.01": {
      code: "18.15.01",
      description: "Stop signs",
      division: "18.15"
    },
    "18.15.02": {
      code: "18.15.02",
      description: "Mileage signs and markers",
      division: "18.15"
    },
    "18.15.03": {
      code: "18.15.03",
      description: "Other road signs",
      division: "18.15",
      guidelines: "For similar designs, see 18.15.25",
      excludes: "Billboards (07.13.01)"
    },
    "18.15.04": {
      code: "18.15.04",
      description: "Traffic and pedestrian lights, stop lights",
      division: "18.15"
    },
    "18.15.06": {
      code: "18.15.06",
      description: "Channel markers, buoys",
      division: "18.15"
    },
    "18.15.25": {
      code: "18.15.25",
      description: "Other traffic signs, including railroad signs and lights",
      division: "18.15",
      guidelines: "For similar designs, see 18.15.03"
    }
  } 