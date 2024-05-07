/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("resources/**/*");
  eleventyConfig.setLiquidOptions({ tagDelimiterLeft: 'somethingrandomtonotclashwithgenkicode', tagDelimiterRightRight: 'alsosomethingrandomtonotclashwithgenkicode' })
  return {
    ...eleventyConfig,
  }
};