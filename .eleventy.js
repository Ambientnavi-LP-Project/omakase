module.exports = function(eleventyConfig) {
  // Copy /src/images directly to output (no processing)
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  eleventyConfig.addFilter("urlencode", function(str) {
    return encodeURIComponent(str || "");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
