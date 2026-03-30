module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });

  eleventyConfig.addCollection("games", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md");
    const games = {};
    for (const post of posts) {
      const game = post.data.game;
      if (game) {
        if (!games[game]) {
          games[game] = [];
        }
        games[game].push(post);
      }
    }
    // Sort posts within each game newest-first
    for (const game of Object.keys(games)) {
      games[game].sort((a, b) => b.date - a.date);
    }
    return games;
  });

  eleventyConfig.addFilter("slugify", function (str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  });

  eleventyConfig.addFilter("dateFormat", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
