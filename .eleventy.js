const fs = require('fs');
const path = require('path');

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("resources/**/*");
  eleventyConfig.setLiquidOptions({ tagDelimiterLeft: '<|', tagDelimiterRight: '|>' })
  eleventyConfig.addCollection("posts", function (collection) {
    const allLessons = collection.getFilteredByGlob("lessons/**/index.html")
    const groupedLessons = groupBy(allLessons, ({ inputPath }) => inputPath.split('/')[2])
    return [...groupedLessons.entries()]
  })

  // Add chapters to list them on the front page
  eleventyConfig.addCollection("chapterFolders", function (collection) {
    // Path to the lessons
    const lessonsDirectory = 'lessons';
    // Use fs.readdirSync() to get an array of all files and directories in the lessonsDirectory
    const chapters = fs.readdirSync(lessonsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(({ name }) => name).sort(sortLessonFiles);
    // read the associated json files. This is because eleventy doesn't let us only get the top level data
    return chapters.map(chapter => {
      // Construct the path to the JSON file
      const jsonFilePath = path.join(lessonsDirectory, chapter, `${chapter}.json`);
      // Read the JSON file
      return readJSONData(jsonFilePath);
    });
  })
  return eleventyConfig
};

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
//export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function readJSONData(jsonFilePath) {
  // Read the JSON file
  try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading JSON file for chapter ${chapter}:`, error);
    return null; // Return null or handle the error as needed
  }
}

function sortLessonFiles(a, b) {
  // Yet to generalize this sorting logic
  // If a or b is "appendix" or "study-tools", sort them to the end
  if (a === "appendix" || a === "study-tools") return 1;
  if (b === "appendix" || b === "study-tools") return -1;

  // Extract numeric parts from strings, if any
  const numA = parseInt(a.match(/\d+/)?.[0]) ?? Infinity; // If no numeric part, treat as Infinity
  const numB = parseInt(b.match(/\d+/)?.[0]) ?? Infinity; // If no numeric part, treat as Infinity

  // Compare the extracted numeric parts
  return numA - numB;
}