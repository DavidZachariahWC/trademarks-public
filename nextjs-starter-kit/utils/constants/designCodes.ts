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
  "03.25": { code: "03.25", description: "Prehistoric animals", category: "03" },
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
  "02.01.22": {
    code: "02.01.22",
    description: "Sailors, fishermen, navigators, men in boats",
    division: "02.01"
  },
  "02.01.23": {
    code: "02.01.23",
    description: "Knights and other men in armor",
    division: "02.01"
  },
  "02.01.24": {
    code: "02.01.24",
    description: "Soldiers, cavalrymen, men in military uniform, including men dressed in band uniforms with a military appearance",
    division: "02.01"
  },
  "02.01.25": {
    code: "02.01.25",
    description: "Hunters, archers and other men with a significantly prominent weapon",
    division: "02.01",
    excludes: "Colonial militiamen (02.01.06), cowboys and westerners (02.01.07), frontiersmen, pioneers, mountaineers and trappers (02.01.08), pirates (02.01.14) are not coded in this section."
  },
  "02.01.26": {
    code: "02.01.26",
    description: "Mechanical men, robots",
    division: "02.01"
  },
  "02.01.27": {
    code: "02.01.27",
    description: "Policemen, firemen",
    division: "02.01"
  },
  "02.01.28": {
    code: "02.01.28",
    description: "Prospectors, miners",
    division: "02.01"
  },
  "02.01.29": {
    code: "02.01.29",
    description: "Doctors, dentists, nurses and laboratory personnel",
    division: "02.01"
  },
  "02.01.30": {
    code: "02.01.30",
    description: "Men wearing two or three piece business suits",
    division: "02.01"
  },
  "02.01.31": {
    code: "02.01.31",
    description: "Stylized men, including men depicted in caricature form",
    division: "02.01",
    guidelines: "Reference General Guideline 12"
  },
  "02.01.32": {
    code: "02.01.32",
    description: "Other men, including frogmen, men wearing space suits and men wearing monocles",
    division: "02.01"
  },
  "02.01.33": {
    code: "02.01.33",
    description: "Grotesque men formed by letters, numbers, punctuation or geometric shapes",
    division: "02.01",
    guidelines: "04.07.03 Geometric figures representing a person 27.01.01 Letters or numerals, including punctuation, forming representations of human beings 27.03.02 Representations of human beings forming letters or numerals, including punctuation\nReference General Guideline 12"
  },
  "02.01.34": {
    code: "02.01.34",
    description: "Other grotesque men including men formed by plants or objects",
    division: "02.01",
    guidelines: "04.07.01 Plants representing a person 04.07.02 Objects representing a person\nReference General Guideline 12"
  },
  "02.01.35": {
    code: "02.01.35",
    description: "Snowmen",
    division: "02.01"
  },
  "02.01.37": {
    code: "02.01.37",
    description: "Heads, portraits or busts of men in profile",
    division: "02.01"
  },
  "02.01.38": {
    code: "02.01.38",
    description: "Merchants, other store clerks and men in aprons",
    division: "02.01",
    excludes: "Butchers, chefs and bakers wearing aprons are in 02.01.20."
  },
  "02.01.39": {
    code: "02.01.39",
    description: "Nude men, men wearing underclothes, bathing suits or brief attire",
    division: "02.01"
  },
  "02.03.01": {
    code: "02.03.01",
    description: "Heads, portraits, busts of women not in profile",
    division: "02.03",
    guidelines: [
      "This section is limited to designs which reveal only a small portion of the shoulder area of the upper torso.",
      "Heads, portraits, busts of women in profile are in 02.03.22."
    ].join("\n")
  },
  "02.03.02": {
    code: "02.03.02",
    description: "Shadows or silhouettes of women",
    division: "02.03",
    excludes: "Stick figures."
  },
  "02.03.03": {
    code: "02.03.03",
    description: "Women wearing crowns or other symbols of royalty, including queens and princesses",
    division: "02.03"
  },
  "02.03.04": {
    code: "02.03.04",
    description: "Pilgrims, women in colonial dress or hoop skirts",
    division: "02.03"
  },
  "02.03.05": {
    code: "02.03.05",
    description: "American Indians",
    division: "02.03"
  },
  "02.03.06": {
    code: "02.03.06",
    description: "Spaniards or Mexicans",
    division: "02.03"
  },
  "02.03.07": {
    code: "02.03.07",
    description: "Asian-Pacific women",
    division: "02.03"
  },
  "02.03.08": {
    code: "02.03.08",
    description: "Hawaiian women",
    division: "02.03"
  },
  "02.03.09": {
    code: "02.03.09",
    description: "Romans, Greeks or Egyptian women (ancient dress)",
    division: "02.03"
  },
  "02.03.10": {
    code: "02.03.10",
    description: "Dutch women",
    division: "02.03"
  },
  "02.03.11": {
    code: "02.03.11",
    description: "Swiss, Bavarian women",
    division: "02.03"
  },
  "02.03.12": {
    code: "02.03.12",
    description: "Scottish women",
    division: "02.03"
  },
  "02.03.13": {
    code: "02.03.13",
    description: "Other women wearing folk, historical or cowgirl costumes, including gypsies; nuns",
    division: "02.03"
  },
  "02.03.14": {
    code: "02.03.14",
    description: "Women wearing bonnets",
    division: "02.03"
  },
  "02.03.15": {
    code: "02.03.15",
    description: "Women wearing scarves on their heads",
    division: "02.03"
  },
  "02.03.16": {
    code: "02.03.16",
    description: "Women wearing hats",
    division: "02.03"
  },
  "02.03.17": {
    code: "02.03.17",
    description: "Women with ponytails or pigtails",
    division: "02.03"
  },
  "02.03.18": {
    code: "02.03.18",
    description: "Women wearing ribbons or flowers in their hair",
    division: "02.03"
  },
  "02.03.19": {
    code: "02.03.19",
    description: "Nude women, women wearing underclothes, bathing suits or brief attire",
    division: "02.03"
  },
  "02.03.20": {
    code: "02.03.20",
    description: "Women holding umbrellas",
    division: "02.03"
  },
  "02.03.21": {
    code: "02.03.21",
    description: "Women wearing aprons",
    division: "02.03"
  },
  "02.03.22": {
    code: "02.03.22",
    description: "Heads, portraits or busts of women in profile",
    division: "02.03"
  },
  "02.03.23": {
    code: "02.03.23",
    description: "Mechanical women or robots",
    division: "02.03"
  },
  "02.03.24": {
    code: "02.03.24",
    description: "Stylized women, including women depicted in caricature form",
    division: "02.03",
    guidelines: "Reference General Guideline 12"
  },
  "02.03.25": {
    code: "02.03.25",
    description: "Other women including hobos, women holding fans and women with weaponry",
    division: "02.03"
  },
  "02.03.26": {
    code: "02.03.26",
    description: "Grotesque women formed by letters, numbers, punctuation or geometric shapes",
    division: "02.03",
    guidelines: [
      "04.07.03 Geometric figures representing a person 27.01.01 Letters or numerals, including punctuation, forming representations of human beings 27.03.02 Representations of human beings forming letters or numerals, including punctuation",
      "Other grotesque women including women formed by plants or objects are in 02.03.28.",
      "Reference General Guideline 12"
    ].join("\n")
  },
  "02.03.27": {
    code: "02.03.27",
    description: "Women athletes",
    division: "02.03"
  },
  "02.03.28": {
    code: "02.03.28",
    description: "Other grotesque women including women formed by plants or objects",
    division: "02.03",
    guidelines: [
      "04.07.01 Plants representing a person 04.07.02 Objects representing a person",
      "Grotesque women formed by letters, numbers, punctuation or geometric shapes are coded in 02.03.26."
    ].join("\n")
  },
  "02.05.01": {
    code: "02.05.01",
    description: "Heads, portraiture, busts of children not in profile",
    division: "02.05",
    guidelines: "This section is limited to designs which reveal only a small portion of the shoulder area of the upper torso."
  },
  "02.05.02": {
    code: "02.05.02",
    description: "Silhouettes or profiles of children",
    division: "02.05",
    excludes: "Stick figures"
  },
  "02.05.04": {
    code: "02.05.04",
    description: "Girl(s)",
    division: "02.05"
  },
  "02.05.05": {
    code: "02.05.05",
    description: "Boy(s)",
    division: "02.05"
  },
  "02.05.06": {
    code: "02.05.06",
    description: "Baby or babies",
    division: "02.05"
  },
  "02.05.07": {
    code: "02.05.07",
    description: "Children wearing folk, historical, farm, Indian or cowboy costumes",
    division: "02.05"
  },
  "02.05.08": {
    code: "02.05.08",
    description: "Children wearing uniforms",
    division: "02.05"
  },
  "02.05.24": {
    code: "02.05.24",
    description: "Stylized children, including children depicted in caricature form",
    division: "02.05",
    guidelines: "Reference General Guideline 12"
  },
  "02.05.26": {
    code: "02.05.26",
    description: "Grotesque children formed by letters, numbers, punctuation or geometric shapes",
    division: "02.05",
    guidelines: [
      "04.07.03 Geometric figures representing a person 27.01.01 Letters or numerals, including punctuation, forming representations of human beings 27.03.02 Representations of human beings forming letters or numerals, including punctuation",
      "Reference General Guideline 12"
    ].join("\n")
  },
  "02.05.27": {
    code: "02.05.27",
    description: "Other grotesque children including children formed by plants or objects",
    division: "02.05",
    guidelines: "04.07.01 Plants representing a person 04.07.02 Objects representing a person"
  },
  "02.07.01": {
    code: "02.07.01",
    description: "Groups of males",
    division: "02.07",
    guidelines: "A group consists of two or more humans. Each human in the couple or group is coded individually."
  },
  "02.07.02": {
    code: "02.07.02",
    description: "Groups of females",
    division: "02.07",
    guidelines: "A group consists of two or more humans. Each human in the couple or group is coded individually."
  },
  "02.07.03": {
    code: "02.07.03",
    description: "Males and females",
    division: "02.07",
    guidelines: "A group consists of two or more humans. Each human in the couple or group is coded individually."
  },
  "02.07.04": {
    code: "02.07.04",
    description: "Adults and children, including family groups",
    division: "02.07",
    guidelines: "A group consists of two or more humans. Each human in the couple or group is coded individually."
  },
  "02.07.05": {
    code: "02.07.05",
    description: "Groups of children",
    division: "02.07",
    guidelines: "A group consists of two or more humans. Each human in the couple or group is coded individually."
  },
  "02.07.25": {
    code: "02.07.25",
    description: "Other groups of humans",
    division: "02.07",
    guidelines: "A group consists of two or more humans. Each human in the couple or group is coded individually."
  },
  "02.07.26": {
    code: "02.07.26",
    description: "Grotesque groups of men, women and/or children having human features",
    division: "02.07",
    guidelines: [
      "A group consists of two or more humans. Each human in the couple or group is coded individually.",
      "Reference General Guideline 12"
    ].join("\n")
  },
  "02.09.01": {
    code: "02.09.01",
    description: "Eating or drinking",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.02": {
    code: "02.09.02",
    description: "Smoking",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.03": {
    code: "02.09.03",
    description: "Reclining or sleeping",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.04": {
    code: "02.09.04",
    description: "Sitting or kneeling",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.05": {
    code: "02.09.05",
    description: "Running",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.06": {
    code: "02.09.06",
    description: "Carrying items such as buckets or bags",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.07": {
    code: "02.09.07",
    description: "Cooking",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.08": {
    code: "02.09.08",
    description: "Painting (artistic, house painting and the like)",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.09": {
    code: "02.09.09",
    description: "Working in fields, on lawns or in gardens",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.10": {
    code: "02.09.10",
    description: "Working in factories",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.11": {
    code: "02.09.11",
    description: "Humans engaged in other work",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.12": {
    code: "02.09.12",
    description: "Flying (self-propelled)",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.13": {
    code: "02.09.13",
    description: "Swinging on a swing, rope, tire, etc.",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.14": {
    code: "02.09.14",
    description: "Dancing",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.15": {
    code: "02.09.15",
    description: "Playing musical instruments",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.16": {
    code: "02.09.16",
    description: "Children playing",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.17": {
    code: "02.09.17",
    description: "Riding horses and other animals",
    division: "02.09",
    guidelines: [
      "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05.",
      "Humans riding a horse, a donkey or a mule are in 02.09.17. These animals are not coded individually in Category 03. If, however the human is riding any other type of animal, that animal should be coded in the appropriate section of Category 03.",
      "A statue of a man riding a horse is coded in 02.01, 02.09.17, 22.05.03 and 22.05.04."
    ].join("\n")
  },
  "02.09.18": {
    code: "02.09.18",
    description: "Swimming",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.09.19": {
    code: "02.09.19",
    description: "Humans playing games or engaged in other sports",
    division: "02.09",
    guidelines: "Humans engaged in activities should be cross-coded to the specific type of human in 02.01, 02.03, or 02.05."
  },
  "02.11.01": {
    code: "02.11.01",
    description: "Hearts",
    division: "02.11",
    excludes: "Hearts depicted on playing cards are in 02.11.12; Hearts used as background or carriers are in 02.11.13."
  },
  "02.11.02": {
    code: "02.11.02",
    description: "Eyes",
    division: "02.11"
  },
  "02.11.03": {
    code: "02.11.03",
    description: "Ears",
    division: "02.11"
  },
  "02.11.04": {
    code: "02.11.04",
    description: "Lips or mouths",
    division: "02.11"
  },
  "02.11.05": {
    code: "02.11.05",
    description: "Teeth, dentures",
    division: "02.11"
  },
  "02.11.06": {
    code: "02.11.06",
    description: "Hair, locks of hair, wigs, beards, mustaches",
    division: "02.11"
  },
  "02.11.07": {
    code: "02.11.07",
    description: "Hands, fingers and arms",
    division: "02.11",
    excludes: "Hands and fingers forming the following: handshake, finger pointing, fingers walking, OK sign, and thumbs up or thumbs down are coded in 02.11.14."
  },
  "02.11.08": {
    code: "02.11.08",
    description: "Feet, toes, imprints of feet or toes, legs",
    division: "02.11",
    excludes: "Boot and shoe prints, soles of shoes (09.07.07)"
  },
  "02.11.09": {
    code: "02.11.09",
    description: "Bodies or dummies without heads or without feet",
    division: "02.11"
  },
  "02.11.10": {
    code: "02.11.10",
    description: "Skeletons, parts of skeletons, bones, skulls",
    division: "02.11"
  },
  "02.11.11": {
    code: "02.11.11",
    description: "Skull and crossbones (poison symbol)",
    division: "02.11"
  },
  "02.11.12": {
    code: "02.11.12",
    description: "Hearts depicted on playing cards",
    division: "02.11"
  },
  "02.11.13": {
    code: "02.11.13",
    description: "Hearts used as background or carriers",
    division: "02.11"
  },
  "02.11.14": {
    code: "02.11.14",
    description: "Hands and fingers forming the following: handshake, finger pointing, fingers walking, OK sign, and thumbs up or thumbs down",
    division: "02.11",
    guidelines: "Only the gestures listed are in 02.11.14. For other gestures see 02.11.07."
  },
  "02.11.15": {
    code: "02.11.15",
    description: "Imprints of hands; fingerprints",
    division: "02.11"
  },
  "02.11.16": {
    code: "02.11.16",
    description: "Smiley faces",
    division: "02.11",
    guidelines: [
      "A design is coded as a smiley face if it has either dots for eyes or a single line for a mouth or otherwise has the general appearance of a smiley face.",
      "Smiley faces are not double coded in the individual parts of the face."
    ].join("\n")
  },
  "02.11.25": {
    code: "02.11.25",
    description: "Other parts of the human body",
    division: "02.11"
  },
  "03.01.01": {
    code: "03.01.01",
    description: "Lions",
    division: "03.01",
    guidelines: "Lions with mythical elements should be primarily coded elsewhere, but cross-coding may be appropriate (03.01.02 for heraldic lion-based creatures, 04.05.01 for griffons, and other mythical creatures may be in 04.05). Naturalistic lion heads should be cross-coded as 03.01.18 (heads of felines)."
  },
  "03.01.02": {
    code: "03.01.02",
    description: "Lions shown with shields, seals, or other heraldic styles or symbols",
    division: "03.01",
    guidelines: "Lions are cross-coded in 03.01.01 if naturalistic and 03.01.24 if notably stylized. Lions with mythical elements are cross-coded elsewhere (e.g., sphinxes in 04.03.02, griffons in 04.05.01)."
  },
  "03.01.03": {
    code: "03.01.03",
    description: "Cats, large or wild, such as tigers, leopards, and jaguars, excluding lions and domestic cats",
    division: "03.01"
  },
  "03.01.04": {
    code: "03.01.04",
    description: "Domestic cats",
    division: "03.01"
  },
  "03.01.07": {
    code: "03.01.07",
    description: "Dogs rendered only as outlines, shadows, or silhouettes",
    division: "03.01",
    guidelines: "Cross-code with basic dog code 03.01.08."
  },
  "03.01.08": {
    code: "03.01.08",
    description: "Dogs",
    division: "03.01",
    guidelines: "Dogs shown in mere outlines or silhouettes are coded in 03.01.07."
  },
  "03.01.09": {
    code: "03.01.09",
    description: "Wolf-like wild animals, such as coyotes, jackals, and hyenas",
    division: "03.01"
  },
  "03.01.11": {
    code: "03.01.11",
    description: "Foxes",
    division: "03.01"
  },
  "03.01.13": {
    code: "03.01.13",
    description: "Panda bears, including heads and other parts uniquely identifiable with pandas, and also including stylized, costumed, and those with human attributes, but not including red pandas",
    division: "03.01",
    guidelines: "As an identifiable single species, code includes heads and other parts uniquely identifiable with the species, also including stylized, costumed, and those with human attributes."
  },
  "03.01.14": {
    code: "03.01.14",
    description: "Bears other than pandas or teddy bears",
    division: "03.01",
    guidelines: "Panda bears are in 03.01.13 and teddy bears are in 21.01.11."
  },
  "03.01.18": {
    code: "03.01.18",
    description: "Heads of felines",
    division: "03.01",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.01.19": {
    code: "03.01.19",
    description: "Heads of dogs, wolves, and foxes",
    division: "03.01",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.01.20": {
    code: "03.01.20",
    description: "Heads of bears",
    division: "03.01",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate. However, identifiable panda bear heads are coded only in 03.01.13."
  },
  "03.01.21": {
    code: "03.01.21",
    description: "Stylized felines",
    division: "03.01",
    guidelines: "Cross-code with proper code(s) for associated cats."
  },
  "03.01.22": {
    code: "03.01.22",
    description: "Stylized dogs, wolves, and foxes",
    division: "03.01",
    guidelines: "Cross-code with proper code(s) for associated dogs, wolves, or foxes."
  },
  "03.01.23": {
    code: "03.01.23",
    description: "Stylized bears, excluding panda bears",
    division: "03.01",
    guidelines: "Cross-code with proper code(s) for associated bears, except that for designs of panda bears all aspects are coded in 03.01.13."
  },
  "03.01.24": {
    code: "03.01.24",
    description: "Costumed felines and those with human attributes, including cats of all sizes",
    division: "03.01",
    guidelines: "Cross-code with proper code(s) for associated cats, as well as the stylized code if appropriate."
  },
  "03.01.25": {
    code: "03.01.25",
    description: "Costumed dogs, wolves, and foxes, and those with human attributes",
    division: "03.01",
    guidelines: "Cross-code with proper code(s) for associated dogs, wolves, or foxes, as well as the stylized code if appropriate."
  },
  "03.01.26": {
    code: "03.01.26",
    description: "Costumed bears and those with human attributes",
    division: "03.01",
    guidelines: "Cross-code with proper code(s) for associated bears, as well as the stylized code if appropriate, except that for designs of panda bears all aspects are coded in 03.01.13."
  },
  "03.03.01": {
    code: "03.03.01",
    description: "Elephants, mammoths",
    division: "03.03"
  },
  "03.03.03": {
    code: "03.03.03",
    description: "Hippos, rhinos",
    division: "03.03"
  },
  "03.03.05": {
    code: "03.03.05",
    description: "Giraffes, including heads and other parts uniquely identifiable with giraffes, and also including stylized, costumed, and those with human attributes",
    division: "03.03",
    guidelines: "As an identifiable single species, code includes heads and other parts uniquely identifiable with the species, also including stylized, costumed, and those with human attributes."
  },
  "03.03.07": {
    code: "03.03.07",
    description: "Alpacas, llamas",
    division: "03.03"
  },
  "03.03.09": {
    code: "03.03.09",
    description: "Camels, both bactrian and dromedary, including heads and other parts uniquely identifiable with camels, also including stylized, costumed, and those with human attributes",
    division: "03.03",
    guidelines: "As an identifiable single species, code includes heads and other parts uniquely identifiable with the species, also including stylized, costumed, and those with human attributes."
  },
  "03.03.16": {
    code: "03.03.16",
    description: "Heads of elephants, hippos, rhinos, alpacas, llamas",
    division: "03.03",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.03.24": {
    code: "03.03.24",
    description: "Stylized elephants, hippos, rhinos, alpacas, llamas",
    division: "03.03",
    guidelines: "Cross-code with basic code(s) for associated animals of these types."
  },
  "03.03.26": {
    code: "03.03.26",
    description: "Costumed elephants, hippos, rhinos, alpacas, and llamas, and those with human attributes",
    division: "03.03",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.05.01": {
    code: "03.05.01",
    description: "Horses",
    division: "03.05",
    excludes: "Winged horses, including Pegasus, are coded in 04.05.03, and unicorns are coded in 04.05.04."
  },
  "03.05.02": {
    code: "03.05.02",
    description: "Donkeys, mules",
    division: "03.05"
  },
  "03.05.03": {
    code: "03.05.03",
    description: "Zebras, including heads and other parts uniquely identifiable with zebra, also including stylized, costumed, and those with human attributes",
    division: "03.05",
    guidelines: "As an identifiable single species, code includes heads and other parts uniquely identifiable with the species, also including stylized, costumed, and those with human attributes."
  },
  "03.05.16": {
    code: "03.05.16",
    description: "Heads of horses and donkeys",
    division: "03.05",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.05.24": {
    code: "03.05.24",
    description: "Stylized horses and donkeys",
    division: "03.05",
    guidelines: "Cross-code with basic code(s) for associated animals of these types."
  },
  "03.05.26": {
    code: "03.05.26",
    description: "Costumed horses and donkeys and those with human attributes",
    division: "03.05",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.01": {
    code: "03.07.01",
    description: "Cows, bulls, oxen, and other cattle",
    division: "03.07"
  },
  "03.07.03": {
    code: "03.07.03",
    description: "Heads of cows, bulls, oxen, and other cattle",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.05": {
    code: "03.07.05",
    description: "Buffalos, yaks, and other bovines other than basic cows, bulls and other cattle",
    division: "03.07"
  },
  "03.07.07": {
    code: "03.07.07",
    description: "Deer and other wild animals often featuring antlers, including reindeer, antelopes, moose, gazelles",
    division: "03.07"
  },
  "03.07.08": {
    code: "03.07.08",
    description: "Heads of deer, elk, reindeer, fawns, antelopes, moose, gazelles",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.09": {
    code: "03.07.09",
    description: "Pigs, boars",
    division: "03.07"
  },
  "03.07.10": {
    code: "03.07.10",
    description: "Goats, sheep, rams",
    division: "03.07"
  },
  "03.07.11": {
    code: "03.07.11",
    description: "Heads of pigs and boars",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.12": {
    code: "03.07.12",
    description: "Heads of goats, sheep, and rams",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.21": {
    code: "03.07.21",
    description: "Stylized cows, buffalo, and other bovines",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types."
  },
  "03.07.22": {
    code: "03.07.22",
    description: "Stylized deer, moose, and other similar animals with antlers",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types."
  },
  "03.07.23": {
    code: "03.07.23",
    description: "Stylized pigs and boars",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types."
  },
  "03.07.24": {
    code: "03.07.24",
    description: "Stylized goats and sheep",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types."
  },
  "03.07.26": {
    code: "03.07.26",
    description: "Costumed cows, buffalo, and other bovines, and those with human attributes",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.27": {
    code: "03.07.27",
    description: "Costumed deer, moose, and other similar animals with antlers, and those with human attributes",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.28": {
    code: "03.07.28",
    description: "Costumed pigs and boars and those with human attributes",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  },
  "03.07.29": {
    code: "03.07.29",
    description: "Costumed goats and sheep and those with human attributes",
    division: "03.07",
    guidelines: "Cross-code with basic code(s) for associated animals of these types, as well as the stylized code if appropriate."
  }
} 