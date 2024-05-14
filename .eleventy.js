/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("resources/**/*");
  eleventyConfig.setLiquidOptions({ tagDelimiterLeft: '<|', tagDelimiterRight: '|>' })
  eleventyConfig.addCollection("posts", function (collection) {
    const allLessons = collection.getFilteredByGlob("lessons/**/index.html")
    const groupedLessons = groupBy(allLessons, ({ inputPath }) => inputPath.split('/')[2])
    return [...groupedLessons.entries()]
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